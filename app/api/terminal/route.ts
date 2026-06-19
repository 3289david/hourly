import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { ensureWorkspace } from "@/lib/workspace";
import { spawn } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOCKED_COMMANDS = [
  "rm -rf /",
  "dd if=/dev/",
  "mkfs",
  ":(){ :|:& };:",
  "wget",
  "curl -o",
  "chmod 777 /",
];

function isSafeCommand(cmd: string): boolean {
  const lower = cmd.toLowerCase().trim();
  return !BLOCKED_COMMANDS.some((blocked) => lower.includes(blocked));
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: "Session expired" }, { status: 401 });

  const { command } = (await req.json()) as { command?: string };

  if (!command || typeof command !== "string") {
    return NextResponse.json({ error: "command required" }, { status: 400 });
  }

  if (!isSafeCommand(command)) {
    return NextResponse.json(
      { error: "Command not permitted", output: "Command blocked for safety reasons.\n" },
      { status: 403 }
    );
  }

  const workspaceDir = await ensureWorkspace(session.sessionId);

  return new Promise<NextResponse>((resolve) => {
    let output = "";
    let error = "";

    const child = spawn("bash", ["-c", command], {
      cwd: workspaceDir,
      env: {
        ...process.env,
        HOME: workspaceDir,
        PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        TERM: "xterm-256color",
      },
      timeout: 30000,
    });

    child.stdout.on("data", (d: Buffer) => (output += d.toString()));
    child.stderr.on("data", (d: Buffer) => (error += d.toString()));

    child.on("close", (code) => {
      resolve(
        NextResponse.json({
          output: output + error,
          exitCode: code,
        })
      );
    });

    child.on("error", (err) => {
      resolve(
        NextResponse.json(
          { error: err.message, output: "", exitCode: -1 },
          { status: 500 }
        )
      );
    });

    setTimeout(() => {
      child.kill();
      resolve(
        NextResponse.json({
          output: output + "\n[Command timed out after 30s]",
          exitCode: -1,
        })
      );
    }, 30000);
  });
}
