import fs from "fs/promises";
import path from "path";

const WORKSPACE_ROOT =
  process.env.WORKSPACE_ROOT ?? "/tmp/hourly-workspaces";

export function getWorkspacePath(sessionId: string): string {
  const safeName = sessionId.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(WORKSPACE_ROOT, safeName);
}

export async function ensureWorkspace(sessionId: string): Promise<string> {
  const dir = getWorkspacePath(sessionId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function listFiles(
  sessionId: string,
  subPath = ""
): Promise<{ name: string; isDir: boolean; path: string }[]> {
  const base = getWorkspacePath(sessionId);
  const target = path.join(base, subPath);

  const safePath = path.resolve(target);
  if (!safePath.startsWith(path.resolve(base))) {
    throw new Error("Path traversal not allowed");
  }

  try {
    const entries = await fs.readdir(target, { withFileTypes: true });
    return entries
      .filter((e) => !e.name.startsWith(".git"))
      .map((e) => ({
        name: e.name,
        isDir: e.isDirectory(),
        path: path.join(subPath, e.name),
      }));
  } catch {
    return [];
  }
}

export async function readFile(
  sessionId: string,
  filePath: string
): Promise<string> {
  const base = getWorkspacePath(sessionId);
  const target = path.join(base, filePath);

  const safePath = path.resolve(target);
  if (!safePath.startsWith(path.resolve(base))) {
    throw new Error("Path traversal not allowed");
  }

  return fs.readFile(target, "utf-8");
}

export async function writeFile(
  sessionId: string,
  filePath: string,
  content: string
): Promise<void> {
  const base = getWorkspacePath(sessionId);
  const target = path.join(base, filePath);

  const safePath = path.resolve(target);
  if (!safePath.startsWith(path.resolve(base))) {
    throw new Error("Path traversal not allowed");
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf-8");
}

export async function deleteFile(
  sessionId: string,
  filePath: string
): Promise<void> {
  const base = getWorkspacePath(sessionId);
  const target = path.join(base, filePath);

  const safePath = path.resolve(target);
  if (!safePath.startsWith(path.resolve(base))) {
    throw new Error("Path traversal not allowed");
  }

  await fs.rm(target, { recursive: true, force: true });
}

export async function cleanupExpiredWorkspaces(): Promise<void> {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  try {
    const entries = await fs.readdir(WORKSPACE_ROOT, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((e) => e.isDirectory())
        .map(async (e) => {
          const stat = await fs.stat(path.join(WORKSPACE_ROOT, e.name));
          if (stat.mtimeMs < cutoff) {
            await fs.rm(path.join(WORKSPACE_ROOT, e.name), {
              recursive: true,
              force: true,
            });
          }
        })
    );
  } catch {
    // workspace root may not exist yet
  }
}
