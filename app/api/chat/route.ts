import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { getModelById, routeModel } from "@/lib/models";
import { getOrCreateContainer, execInContainer } from "@/lib/sandbox";
import {
  ensureWorkspace, readFile, writeFile, deleteFile, listFiles,
  appendToFile, createDirectory, moveFile, replaceInFile, searchInFiles,
} from "@/lib/workspace";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TOOL_ROUNDS = 20;

const SYSTEM_PROMPT = `You are an expert AI coding agent inside Hourly — a cloud coding workspace.

## Tools you have (use them proactively — don't describe, DO it)
File operations:
- list_files — explore the workspace structure
- read_file — read a file before editing it
- write_file — create or overwrite a file (write COMPLETE content, never truncate)
- write_many_files — scaffold multiple files at once (great for new projects)
- append_to_file — add content to end of a file
- replace_in_file — surgically edit a specific part of a file (preferred over rewriting whole files)
- delete_file — remove files/directories
- move_file — rename or move files

Search & discovery:
- search_in_files — grep across the workspace with context lines
- fetch_url — fetch any URL: docs, APIs, npm registry, GitHub, etc.

Execution:
- run_terminal — run any shell command (npm, pip, git, node, python, make, tests, etc.)

## How to work
- For new projects: use write_many_files to scaffold everything in one shot
- For edits to existing files: read_file first, then replace_in_file for targeted changes
- For bugs: search_in_files to locate the issue, read_file, replace_in_file, run_terminal to verify
- Always run code after writing it — verify it actually works
- Chain tools freely — a single turn can have many tool calls
- Be terse in text — let tool output speak for itself`;

// ── Tool schemas ─────────────────────────────────────────────────────────────

const TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "run_terminal",
      description: "Run any shell command in the isolated workspace sandbox (npm, pip, git, node, python, cargo, make, curl, etc.). Output is returned. Commands timeout at 30s.",
      parameters: {
        type: "object",
        properties: { command: { type: "string", description: "Shell command to execute" } },
        required: ["command"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read the full contents of a file. Always call this before replace_in_file.",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "File path relative to workspace root" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Create or completely overwrite a file. Write the FULL file content — never use '...' or truncate. For targeted edits to existing files, use replace_in_file instead.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path relative to workspace root" },
          content: { type: "string", description: "Complete file content" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_many_files",
      description: "Create multiple files in one call. Ideal for scaffolding a new project or making coordinated changes across many files.",
      parameters: {
        type: "object",
        properties: {
          files: {
            type: "array",
            description: "Files to write",
            items: {
              type: "object",
              properties: {
                path: { type: "string", description: "File path relative to workspace root" },
                content: { type: "string", description: "Complete file content" },
              },
              required: ["path", "content"],
            },
          },
        },
        required: ["files"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "replace_in_file",
      description: "Surgically replace a specific piece of text in a file. Use this instead of write_file when making targeted edits. The old_text must match EXACTLY (including whitespace and indentation). All occurrences are replaced.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
          old_text: { type: "string", description: "Exact text to find and replace (must match precisely)" },
          new_text: { type: "string", description: "Replacement text" },
        },
        required: ["path", "old_text", "new_text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "append_to_file",
      description: "Append content to the end of an existing file (or create it if it doesn't exist).",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
          content: { type: "string", description: "Content to append" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List files and directories in the workspace. Use to explore project structure before starting work.",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "Directory path (default: workspace root)" } },
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
        properties: { path: { type: "string", description: "File or directory path" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "move_file",
      description: "Move or rename a file or directory.",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Source path" },
          to: { type: "string", description: "Destination path" },
        },
        required: ["from", "to"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_directory",
      description: "Create a directory (and all parent directories) in the workspace.",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "Directory path to create" } },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_in_files",
      description: "Search for a text pattern or regex across all workspace files. Returns file paths, line numbers, and surrounding context. Use to find where functions are defined, locate errors, find usages, etc.",
      parameters: {
        type: "object",
        properties: {
          pattern: { type: "string", description: "Search pattern or regex (case-insensitive)" },
          path: { type: "string", description: "Subdirectory to search in (default: entire workspace)" },
          file_glob: { type: "string", description: "File name filter, e.g. '*.ts' or '*.py' (optional)" },
        },
        required: ["pattern"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_url",
      description: "Fetch any URL and return its content: npm package pages, API docs, GitHub raw files, REST APIs, etc. HTML is converted to readable text. JSON is pretty-printed.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to fetch" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "DELETE"], description: "HTTP method (default: GET)" },
          body: { type: "string", description: "Request body for POST/PUT (JSON string)" },
          headers: { type: "string", description: "Extra headers as JSON object string" },
        },
        required: ["url"],
      },
    },
  },
];

// ── Tool execution ────────────────────────────────────────────────────────────

type ToolArgs = Record<string, unknown>;

async function fetchUrl(args: ToolArgs): Promise<string> {
  const url = args.url as string;
  const method = (args.method as string | undefined) ?? "GET";
  let extraHeaders: Record<string, string> = {};
  try { if (args.headers) extraHeaders = JSON.parse(args.headers as string); } catch {}

  const res = await fetch(url, {
    method,
    headers: { "User-Agent": "HourlyAI/1.0", "Accept": "application/json, text/html, */*", ...extraHeaders },
    body: args.body ? (args.body as string) : undefined,
    signal: AbortSignal.timeout(15000),
  });

  const ct = res.headers.get("content-type") ?? "";
  const text = await res.text();

  if (ct.includes("application/json")) {
    try { return JSON.stringify(JSON.parse(text), null, 2).slice(0, 12000); } catch {}
  }

  if (ct.includes("text/html")) {
    const stripped = text
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, " ")
      .trim();
    return `HTTP ${res.status} — ${url}\n\n${stripped.slice(0, 10000)}`;
  }

  return `HTTP ${res.status} — ${url}\n\n${text.slice(0, 12000)}`;
}

async function executeTool(
  name: string,
  args: ToolArgs,
  sessionId: string,
  workspaceDir: string
): Promise<string> {
  switch (name) {
    case "run_terminal": {
      const containerId = await getOrCreateContainer(sessionId, workspaceDir);
      const result = await execInContainer(containerId, sessionId, (args.command as string) ?? "");
      return result.output || "(no output)";
    }
    case "read_file":
      return (await readFile(sessionId, (args.path as string) ?? "")) || "(empty file)";

    case "write_file":
      await writeFile(sessionId, (args.path as string) ?? "", (args.content as string) ?? "");
      return `Written: ${args.path}`;

    case "write_many_files": {
      const files = (args.files as Array<{ path: string; content: string }>) ?? [];
      for (const f of files) await writeFile(sessionId, f.path, f.content);
      return `Written ${files.length} file(s):\n${files.map((f) => `  ${f.path}`).join("\n")}`;
    }

    case "replace_in_file": {
      const result = await replaceInFile(
        sessionId,
        (args.path as string) ?? "",
        (args.old_text as string) ?? "",
        (args.new_text as string) ?? ""
      );
      return `Replaced ${result.replaced} occurrence(s) in ${args.path}`;
    }

    case "append_to_file":
      await appendToFile(sessionId, (args.path as string) ?? "", (args.content as string) ?? "");
      return `Appended to ${args.path}`;

    case "list_files": {
      const entries = await listFiles(sessionId, (args.path as string) ?? "");
      if (!entries.length) return "(empty)";
      return entries.map((e) => `${e.isDir ? "d" : "-"} ${e.path}`).join("\n");
    }

    case "delete_file":
      await deleteFile(sessionId, (args.path as string) ?? "");
      return `Deleted: ${args.path}`;

    case "move_file":
      await moveFile(sessionId, (args.from as string) ?? "", (args.to as string) ?? "");
      return `Moved: ${args.from} → ${args.to}`;

    case "create_directory":
      await createDirectory(sessionId, (args.path as string) ?? "");
      return `Created directory: ${args.path}`;

    case "search_in_files":
      return searchInFiles(
        sessionId,
        (args.pattern as string) ?? "",
        (args.path as string) ?? "",
        (args.file_glob as string) ?? ""
      );

    case "fetch_url":
      return fetchUrl(args);

    default:
      return `Unknown tool: ${name}`;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

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
    ? `${SYSTEM_PROMPT}\n\nOpen file context:\n${fileContext}`
    : SYSTEM_PROMPT;

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const conv: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
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
              messages: conv,
              tools: supportsTools ? TOOLS : undefined,
              tool_choice: supportsTools ? "auto" : undefined,
              stream: true,
              max_tokens: 8192,
              temperature: 0.15,
            });
          } catch (err) {
            const status = (err as { status?: number }).status ?? 500;
            send({
              type: "error",
              message: status === 429
                ? "Rate limit reached — try a different model or wait a moment."
                : err instanceof Error ? err.message : "AI request failed",
            });
            break;
          }

          let textContent = "";
          const tcMap = new Map<number, { id: string; name: string; arguments: string }>();
          let finishReason = "";

          for await (const chunk of stream) {
            const choice = chunk.choices[0];
            if (!choice) continue;

            const delta = choice.delta as OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta & {
              tool_calls?: Array<{ index: number; id?: string; function?: { name?: string; arguments?: string } }>;
            };

            if (delta.content) {
              textContent += delta.content;
              send({ type: "text", content: delta.content });
            }

            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (!tcMap.has(tc.index)) tcMap.set(tc.index, { id: "", name: "", arguments: "" });
                const e = tcMap.get(tc.index)!;
                if (tc.id) e.id = tc.id;
                if (tc.function?.name) e.name = tc.function.name;
                if (tc.function?.arguments) e.arguments += tc.function.arguments;
              }
            }

            if (choice.finish_reason) finishReason = choice.finish_reason;
          }

          const toolCalls = Array.from(tcMap.values()).filter((t) => t.name);

          if (!toolCalls.length || finishReason === "stop") {
            conv.push({ role: "assistant", content: textContent });
            break;
          }

          conv.push({
            role: "assistant",
            content: textContent || null,
            tool_calls: toolCalls.map((t) => ({
              id: t.id || `call_${Math.random().toString(36).slice(2)}`,
              type: "function" as const,
              function: { name: t.name, arguments: t.arguments },
            })),
          });

          for (const tc of toolCalls) {
            const callId = tc.id || `call_${Math.random().toString(36).slice(2)}`;
            let args: ToolArgs = {};
            try { args = JSON.parse(tc.arguments); } catch {}

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
            conv.push({ role: "tool", tool_call_id: callId, content: output });
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
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
