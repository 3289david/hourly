"use client";

import { useState, useEffect, useCallback } from "react";
import { IconFolder, IconFile, IconPlus, IconTrash, IconRefresh, IconGitHub } from "@/components/icons";

interface FileEntry {
  name: string;
  isDir: boolean;
  path: string;
}

interface FileSidebarProps {
  onFileSelect: (path: string, content: string) => void;
  onFileSave: (path: string, content: string) => void;
  activeFile?: string;
}

export function FileSidebar({ onFileSelect, activeFile }: FileSidebarProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClone, setShowClone] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);

  const loadFiles = useCallback(async (subPath = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(subPath)}`);
      const data = (await res.json()) as { files?: FileEntry[]; error?: string };
      setFiles(data.files ?? []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  async function openFile(file: FileEntry) {
    if (file.isDir) {
      loadFiles(file.path);
      return;
    }

    try {
      const res = await fetch(
        `/api/files?action=read&path=${encodeURIComponent(file.path)}`
      );
      const data = (await res.json()) as { content?: string; error?: string };
      if (data.content !== undefined) {
        onFileSelect(file.path, data.content);
      }
    } catch {
      // ignore
    }
  }

  async function deleteFile(file: FileEntry, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete ${file.name}?`)) return;

    await fetch(`/api/files?path=${encodeURIComponent(file.path)}`, {
      method: "DELETE",
    });
    loadFiles();
  }

  async function createFile() {
    if (!newFileName.trim()) return;

    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: newFileName.trim(), content: "" }),
    });

    setNewFileName("");
    setShowNewFile(false);
    loadFiles();
  }

  async function handleClone() {
    if (!repoUrl.trim()) return;
    setCloning(true);
    setCloneError("");

    try {
      const res = await fetch("/api/github/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; repoName?: string };

      if (!res.ok || !data.ok) {
        setCloneError(data.error ?? "Clone failed");
        return;
      }

      setShowClone(false);
      setRepoUrl("");
      setGithubToken("");
      loadFiles();
    } catch {
      setCloneError("Network error");
    } finally {
      setCloning(false);
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span className="text-xs font-medium" style={{ color: "var(--color-text-3)" }}>
          FILES
        </span>
        <div className="flex items-center gap-1">
          <button
            title="Clone repository"
            onClick={() => setShowClone(!showClone)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-3)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-3)")
            }
          >
            <IconGitHub size={13} />
          </button>
          <button
            title="New file"
            onClick={() => setShowNewFile(!showNewFile)}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-3)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-3)")
            }
          >
            <IconPlus size={13} />
          </button>
          <button
            title="Refresh"
            onClick={() => loadFiles()}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-3)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-3)")
            }
          >
            <IconRefresh size={13} />
          </button>
        </div>
      </div>

      {/* Clone panel */}
      {showClone && (
        <div
          className="p-3 flex flex-col gap-2"
          style={{
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            className="text-xs px-2 py-1.5 rounded-lg outline-none w-full"
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-2)",
              color: "var(--color-text)",
              fontFamily: "var(--font-mono)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--color-border-2)")
            }
          />
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="GitHub token (for private repos)"
            className="text-xs px-2 py-1.5 rounded-lg outline-none w-full"
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-2)",
              color: "var(--color-text)",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--color-border-2)")
            }
          />
          {cloneError && (
            <p className="text-xs" style={{ color: "var(--color-error)" }}>
              {cloneError}
            </p>
          )}
          <button
            onClick={handleClone}
            disabled={!repoUrl.trim() || cloning}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: "var(--color-accent)",
              color: "#000",
              opacity: cloning ? 0.7 : 1,
            }}
          >
            {cloning ? "Cloning..." : "Clone"}
          </button>
        </div>
      )}

      {/* New file panel */}
      {showNewFile && (
        <div
          className="p-3 flex gap-2"
          style={{
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFile()}
            placeholder="filename.ts"
            autoFocus
            className="flex-1 text-xs px-2 py-1.5 rounded-lg outline-none"
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-accent)",
              color: "var(--color-text)",
              fontFamily: "var(--font-mono)",
            }}
          />
          <button
            onClick={createFile}
            className="text-xs px-2 py-1.5 rounded-lg"
            style={{ background: "var(--color-accent)", color: "#000" }}
          >
            Create
          </button>
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto py-1">
        {loading ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              Loading...
            </p>
          </div>
        ) : files.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
              No files yet.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-3)" }}>
              Clone a repo or create a file.
            </p>
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => openFile(file)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-left group transition-colors"
              style={{
                background:
                  activeFile === file.path
                    ? "var(--color-surface-3)"
                    : "transparent",
                borderLeft:
                  activeFile === file.path
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (activeFile !== file.path)
                  e.currentTarget.style.background = "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                if (activeFile !== file.path)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                {file.isDir ? (
                  <IconFolder
                    size={13}
                    style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties}
                  />
                ) : (
                  <IconFile
                    size={13}
                    style={{ color: "var(--color-text-3)", flexShrink: 0 } as React.CSSProperties}
                  />
                )}
                <span
                  className="text-xs truncate"
                  style={{
                    color:
                      activeFile === file.path
                        ? "var(--color-text)"
                        : "var(--color-text-2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {file.name}
                </span>
              </div>

              {!file.isDir && (
                <button
                  onClick={(e) => deleteFile(file, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                  style={{ color: "var(--color-text-3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-error)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-3)")
                  }
                >
                  <IconTrash size={11} />
                </button>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
