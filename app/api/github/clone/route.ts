import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { ensureWorkspace, getWorkspacePath } from "@/lib/workspace";
import { simpleGit } from "simple-git";
import path from "path";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: "Session expired" }, { status: 401 });

  const { repoUrl, githubToken } = (await req.json()) as {
    repoUrl?: string;
    githubToken?: string;
  };

  if (!repoUrl) {
    return NextResponse.json({ error: "repoUrl required" }, { status: 400 });
  }

  const urlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;
  if (!urlPattern.test(repoUrl)) {
    return NextResponse.json(
      { error: "Only GitHub HTTPS URLs are supported" },
      { status: 400 }
    );
  }

  const repoName = path.basename(repoUrl, ".git");

  await ensureWorkspace(session.sessionId);
  const workspacePath = getWorkspacePath(session.sessionId);
  const clonePath = path.join(workspacePath, repoName);

  let cloneUrl = repoUrl;
  if (githubToken) {
    const parsed = new URL(repoUrl);
    parsed.username = githubToken;
    parsed.password = "x-oauth-basic";
    cloneUrl = parsed.toString();
  }

  try {
    const git = simpleGit();
    await git.clone(cloneUrl, clonePath, ["--depth", "1"]);

    return NextResponse.json({
      ok: true,
      repoName,
      path: repoName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Clone failed";
    const sanitized = message.replace(githubToken ?? "", "***");
    return NextResponse.json({ error: sanitized }, { status: 500 });
  }
}
