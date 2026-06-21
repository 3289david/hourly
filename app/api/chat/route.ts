import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { getModelById, routeModel } from "@/lib/models";
import { getOrCreateContainer, execInContainer } from "@/lib/sandbox";
import { ensureWorkspace, readFile, writeFile, listFiles, deleteFile } from "@/lib/workspace";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TOOL_ROUNDS = 12;

const SYSTEM_PROMPT = `You are an expert AI coding agent running inside Hourly — a cloud coding workspace.

## Your tools (use them proactively — don't just describe, DO it)
- run_terminal — execute shell commands (npm, git, python, make, tests, compilers, etc.)
- read_file — read any file in the workspace
- write_file — create or overwrite any file
- list_files — browse the workspace directory tree
- delete_file — remove files or directories

## How to work like a senior engineer
- When asked to build something: create all the files, install deps, run it to verify
- When asked to fix a bug: read the file first, then write the fix, then run tests
- Chain multiple tools in one turn: list → read → write → run → verify
- Always verify your work by running the code or checking output
- Be concise in text — let tool output speak for itself
- Users are on the clock — act fast, be complete, don't ask unnecessary questions

## Code style
- Write complete, working implementations — never truncate with "// rest of file..."
- Use the language/framework the user already has in their project
- After writing a file, run it to confirm it works`;

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "run_terminal",
      description: "Execute a shell command in the user's isolated workspace sandbox. Use for: running code, installing packages (npm/pip/cargo), compiling, running tests, git commands, checking output, etc.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string", description: "The shell command to execute" },
        },
        required: ["command"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of a file in the workspace. Always read before editing.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path relative to workspace root (e.g. 'src/app.ts')" },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Create a new file or overwrite an existing file with the given content. Always write complete file content — never truncate.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path relative to workspace root" },
          content: { type: "string", description: "Complete file content to write" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List files and directories at a path in the workspace. Use to explore the project structure.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Directory path (default: workspace root)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_file",
      description: "Delete a file or directory from the workspace.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File or directory path relative to workspace root" },
        },
        required: ["path"],
      },
    },
  },
];

async function executeTool(
  name: string,
  args: Record<string, string>,
  sessionId: string,
  workspaceDir: string
): Promise<string> {
  switch (name) {
    case "run_terminal": {
      const containerId = await getOrCreateContainer(sessionId, workspaceDir);
      const result = await execInContainer(containerId, sessionId, args.command ?? "");
      return result.output || "(no output)";
    }
    case "read_file": {
      const content = await readFile(sessionId, args.path ?? "");
      return content || "(empty file)";
    }
    case "write_file": {
      await writeFile(sessionId, args.path ?? "", args.content ?? "");
      return `Written: ${args.path}`;
    }
    case "list_files": {
      const entries = await listFiles(sessionId, args.path ?? "");
      if (!entries.length) return "(empty directory)";
      return entries.map((e) => `${e.isDir ? "d" : "-"} ${e.path}`).join("\n");
    }
    case "delete_file": {
      await deleteFile(sessionId, args.path ?? "");
      return `Deleted: ${args.path}`;
    }
    default:
      return `Unknown tool: ${name}`;
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: "Session expired" }, { status: 401 });

  const { messages, modelId, fileContext } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    modelId?: string;
    fileContext?: string;
  };

  if (!messages?.length) return NextResponse.json({ error: "No messages" }, { status: 400 });

  const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
  let resolvedModelId = modelId === "auto" ? routeModel(lastUserMessage) : (modelId ?? "deepseek-r1");
  if (session.tier === "trial") resolvedModelId = "qwen3-coder-free";

  const model = getModelById(resolvedModelId);
  const supportsTools = resolvedModelId !== "qwen3-coder-free";

  const apiKey = session.byokKey ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key configured" }, { status: 500 });

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://hourly.dev",
      "X-Title": "Hourly",
    },
  });

  const workspaceDir = supportsTools ? await ensureWorkspace(session.sessionId) : "";

  const systemContent = fileContext
    ? `${SYSTEM_PROMPT}\n\nCurrent file context:\n${fileContext}`
    : SYSTEM_PROMPT;

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      let round = 0;

      try {
        while (round < MAX_TOOL_ROUNDS) {
          round++;

          let stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
          try {
            stream = await client.chat.completions.create({
              model: model.openRouterId,
              messages: conversationMessages,
              tools: supportsTools ? TOOLS : undefined,
              tool_choice: supportsTools ? "auto" : undefined,
              stream: true,
              max_tokens: 8192,
              temperature: 0.2,
            });
          } catch (err) {
            const status = (err as { status?: number }).status ?? 500;
            const message =
              status === 429
                ? "Rate limit reached — try switching models or wait a moment."
                : err instanceof Error
                ? err.message
                : "AI request failed";
            send({ type: "error", message });
            break;
          }

          let textContent = "";
          const toolCallsMap = new Map<number, { id: string; name: string; arguments: string }>();
          let finishReason = "";

          for await (const chunk of stream) {
            const choice = chunk.choices[0];
            if (!choice) continue;

            const delta = choice.delta as OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta & {
              tool_calls?: Array<{
                index: number;
                id?: string;
                function?: { name?: string; arguments?: string };
              }>;
            };

            if (delta.content) {
              textContent += delta.content;
              send({ type: "text", content: delta.content });
            }

            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (!toolCallsMap.has(tc.index)) {
                  toolCallsMap.set(tc.index, { id: "", name: "", arguments: "" });
                }
                const entry = toolCallsMap.get(tc.index)!;
                if (tc.id) entry.id = tc.id;
                if (tc.function?.name) entry.name = tc.function.name;
                if (tc.function?.arguments) entry.arguments += tc.function.arguments;
              }
            }

            if (choice.finish_reason) finishReason = choice.finish_reason;
          }

          const toolCalls = Array.from(toolCallsMap.values()).filter((tc) => tc.name);

          if (toolCalls.length === 0 || finishReason === "stop") {
            if (textContent) {
              conversationMessages.push({ role: "assistant", content: textContent });
            }
            break;
          }

          // Assistant turn with tool calls
          conversationMessages.push({
            role: "assistant",
            content: textContent || null,
            tool_calls: toolCalls.map((tc) => ({
              id: tc.id || `call_${Math.random().toString(36).slice(2)}`,
              type: "function" as const,
              function: { name: tc.name, arguments: tc.arguments },
            })),
          });

          // Execute each tool call
          for (const tc of toolCalls) {
            const callId = tc.id || `call_${Math.random().toString(36).slice(2)}`;
            let args: Record<string, string> = {};
            try { args = JSON.parse(tc.arguments); } catch { /* use empty */ }

            send({ type: "tool_call", id: callId, name: tc.name, input: args });

            let output = "";
            let isError = false;
            try {
              output = await executeTool(tc.name, args, session.sessionId, workspaceDir);
            } catch (err) {
              output = `Error: ${err instanceof Error ? err.message : String(err)}`;
              isError = true;
            }

            send({ type: "tool_result", id: callId, name: tc.name, output, error: isError });

            conversationMessages.push({
              role: "tool",
              tool_call_id: callId,
              content: output,
            });
          }
        }
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "Stream error" });
      } finally {
        send({ type: "done", model: model.id });
        controller.close();
      }
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
