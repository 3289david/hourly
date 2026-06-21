import fs from "fs/promises";
import path from "path";
import * as prettier from "prettier";

const WORKSPACE_ROOT =
  process.env.WORKSPACE_ROOT ?? "/tmp/hourly-workspaces";

const PRETTIER_PARSERS: Record<string, string> = {
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".less": "less",
  ".js": "babel",
  ".jsx": "babel",
  ".mjs": "babel",
  ".cjs": "babel",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".json": "json",
  ".md": "markdown",
  ".mdx": "mdx",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".graphql": "graphql",
};

async function formatCode(filePath: string, content: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const parser = PRETTIER_PARSERS[ext];
  if (!parser) return content;
  try {
    return await prettier.format(content, {
      parser,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      htmlWhitespaceSensitivity: "css",
      endOfLine: "lf",
    });
  } catch {
    return content;
  }
}

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

  const formatted = await formatCode(filePath, content);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, formatted, "utf-8");
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

export async function appendToFile(
  sessionId: string,
  filePath: string,
  content: string
): Promise<void> {
  const base = getWorkspacePath(sessionId);
  const target = path.join(base, filePath);
  const safe = path.resolve(target);
  if (!safe.startsWith(path.resolve(base))) throw new Error("Path traversal not allowed");
  await fs.mkdir(path.dirname(safe), { recursive: true });
  await fs.appendFile(safe, content, "utf-8");
}

export async function createDirectory(
  sessionId: string,
  dirPath: string
): Promise<void> {
  const base = getWorkspacePath(sessionId);
  const target = path.resolve(path.join(base, dirPath));
  if (!target.startsWith(path.resolve(base))) throw new Error("Path traversal not allowed");
  await fs.mkdir(target, { recursive: true });
}

export async function moveFile(
  sessionId: string,
  fromPath: string,
  toPath: string
): Promise<void> {
  const base = getWorkspacePath(sessionId);
  const src = path.resolve(path.join(base, fromPath));
  const dst = path.resolve(path.join(base, toPath));
  if (!src.startsWith(path.resolve(base)) || !dst.startsWith(path.resolve(base))) {
    throw new Error("Path traversal not allowed");
  }
  await fs.mkdir(path.dirname(dst), { recursive: true });
  await fs.rename(src, dst);
}

export async function replaceInFile(
  sessionId: string,
  filePath: string,
  oldText: string,
  newText: string
): Promise<{ replaced: number }> {
  const content = await readFile(sessionId, filePath);
  if (!content.includes(oldText)) {
    throw new Error(
      `Text not found in ${filePath}. Ensure the text matches exactly (including whitespace and indentation).`
    );
  }
  const updated = content.split(oldText).join(newText);
  const replaced = (content.split(oldText).length - 1);
  await writeFile(sessionId, filePath, updated);
  return { replaced };
}

export async function searchInFiles(
  sessionId: string,
  pattern: string,
  subPath = "",
  fileGlob = ""
): Promise<string> {
  const base = getWorkspacePath(sessionId);
  const startDir = path.resolve(path.join(base, subPath));
  if (!startDir.startsWith(path.resolve(base))) throw new Error("Path traversal not allowed");

  const results: string[] = [];
  const MAX = 80;
  const SKIP_DIRS = new Set(["node_modules", ".git", ".next", "dist", "build", "__pycache__", ".venv"]);

  let re: RegExp;
  try { re = new RegExp(pattern, "gi"); }
  catch { re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"); }

  async function walk(dir: string) {
    if (results.length >= MAX) return;
    let entries: import("fs").Dirent[];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }

    for (const entry of entries) {
      if (results.length >= MAX) break;
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) { await walk(full); continue; }
      if (fileGlob && !entry.name.match(new RegExp(fileGlob.replace(/\*/g, ".*"), "i"))) continue;

      try {
        const text = await fs.readFile(full, "utf-8");
        const rel = path.relative(base, full);
        const lines = text.split("\n");
        for (let i = 0; i < lines.length && results.length < MAX; i++) {
          re.lastIndex = 0;
          if (re.test(lines[i])) {
            const ctx = lines.slice(Math.max(0, i - 1), i + 2).join("\n");
            results.push(`${rel}:${i + 1}:\n${ctx}`);
          }
        }
      } catch { /* binary, skip */ }
    }
  }

  await walk(startDir);
  if (!results.length) return "No matches found.";
  return results.join("\n---\n") + (results.length >= MAX ? `\n\n(truncated at ${MAX} results)` : "");
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
