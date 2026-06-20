import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { ensureWorkspace } from "@/lib/workspace";
import { getOrCreateContainer, execInContainer } from "@/lib/sandbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: "Session expired" }, { status: 401 });

  const { command } = (await req.json()) as { command?: string };

  if (!command || typeof command !== "string" || command.length > 4096) {
    return NextResponse.json({ error: "Invalid command" }, { status: 400 });
  }

  const workspaceDir = await ensureWorkspace(session.sessionId);

  try {
    const containerId = await getOrCreateContainer(session.sessionId, workspaceDir);
    const result = await execInContainer(containerId, session.sessionId, command);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Sandbox error";
    return NextResponse.json(
      { output: `[Sandbox error: ${msg}]`, exitCode: 1, cwd: "/workspace" },
      { status: 500 }
    );
  }
}
