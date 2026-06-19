import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { getModelById, routeModel } from "@/lib/models";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are an expert AI coding agent running inside Hourly — a time-based AI coding workspace.

Your role:
- Write, debug, refactor, and explain code
- Help users ship features fast during their limited session
- Be concise and action-oriented — users are on the clock
- When writing code, always provide complete, working implementations
- When asked about files, reference the workspace context if provided

You have access to the user's workspace. When they share file contents or error messages, use that context.

Formatting:
- Use markdown code blocks with language identifiers
- Keep explanations brief — show, don't tell
- Suggest next steps after completing a task`;

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const { messages, modelId, fileContext } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    modelId?: string;
    fileContext?: string;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const lastUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";
  const resolvedModelId =
    modelId === "auto" ? routeModel(lastUserMessage) : (modelId ?? "deepseek-r1");
  const model = getModelById(resolvedModelId);

  const apiKey = session.byokKey ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key configured. Add your OpenRouter key in settings." },
      { status: 500 }
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://hourly.dev",
      "X-Title": "Hourly",
    },
  });

  const systemContent = fileContext
    ? `${SYSTEM_PROMPT}\n\nCurrent workspace context:\n${fileContext}`
    : SYSTEM_PROMPT;

  const stream = await client.chat.completions.create({
    model: model.openRouterId,
    messages: [
      { role: "system", content: systemContent },
      ...messages,
    ],
    stream: true,
    max_tokens: 4096,
    temperature: 0.3,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
            );
          }
          if (chunk.choices[0]?.finish_reason) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ done: true, model: model.id })}\n\n`
              )
            );
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
      } finally {
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
