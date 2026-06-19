import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import {
  listFiles,
  readFile,
  writeFile,
  deleteFile,
  ensureWorkspace,
} from "@/lib/workspace";

async function auth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function GET(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path") ?? "";
  const action = searchParams.get("action") ?? "list";

  await ensureWorkspace(session.sessionId);

  if (action === "read" && filePath) {
    try {
      const content = await readFile(session.sessionId, filePath);
      return NextResponse.json({ content });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  }

  const files = await listFiles(session.sessionId, filePath);
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path: filePath, content } = (await req.json()) as {
    path?: string;
    content?: string;
  };

  if (!filePath) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  await ensureWorkspace(session.sessionId);
  await writeFile(session.sessionId, filePath, content ?? "");

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  await deleteFile(session.sessionId, filePath);
  return NextResponse.json({ ok: true });
}
