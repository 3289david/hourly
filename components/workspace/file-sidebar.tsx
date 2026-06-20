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

  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function openFile(file: FileEntry) {
    if (file.isDir) { loadFiles(file.path); return; }
    try {
      const res = await fetch(`/api/files?action=read&path=${encodeURIComponent(file.path)}`);
      const data = (await res.json()) as { content?: string };
      if (data.content !== undefined) onFileSelect(file.path, data.content);
    } catch { /* ignore */ }
  }

  async function deleteFile(file: FileEntry, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete ${file.name}?`)) return;
    await fetch(`/api/files?path=${encodeURIComponent(file.path)}`, { method: "DELETE" });
    loadFiles();
  }

  async function createFile() {
    if (!newFileName.trim()) return;
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: newFileName.trim(), content: "" }),
    });
    setNewFileName(""); setShowNewFile(false); loadFiles();
  }

  async function handleClone() {
    if (!repoUrl.trim()) return;
    setCloning(true); setCloneError("");
    try {
      const res = await fetch("/api/github/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim(), githubToken: githubToken.trim() || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) { setCloneError(data.error ?? "Clone failed"); return; }
      setShowClone(false); setRepoUrl(""); setGithubToken(""); loadFiles();
    } catch {
      setCloneError("Network error");
    } finally {
      setCloning(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.625rem", height: "38px", flexShrink: 0, borderBottom: "1px solid var(--color-border)" }}>
        <span style={{ color: "var(--color-text-3)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Files
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}>
          {[
            { icon: <IconGitHub size={13} />, title: "Clone repo", onClick: () => setShowClone(!showClone), active: showClone },
            { icon: <IconPlus size={13} />, title: "New file", onClick: () => setShowNewFile(!showNewFile), active: showNewFile },
            { icon: <IconRefresh size={13} />, title: "Refresh", onClick: () => loadFiles(), active: false },
          ].map(({ icon, title, onClick, active }) => (
            <button
              key={title}
              title={title}
              onClick={onClick}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "24px", height: "24px", borderRadius: "0.375rem",
                background: active ? "var(--color-accent-dim)" : "transparent",
                border: "none",
                color: active ? "var(--color-accent)" : "var(--color-text-3)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.background = "var(--color-surface-3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = active ? "var(--color-accent)" : "var(--color-text-3)"; e.currentTarget.style.background = active ? "var(--color-accent-dim)" : "transparent"; }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Clone panel */}
      {showClone && (
        <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ color: "var(--color-text-3)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Clone Repository</p>
          <input
            type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            style={{ width: "100%", padding: "0.5rem 0.625rem", borderRadius: "0.5rem", fontSize: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", fontFamily: "var(--font-mono)", outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
          />
          <input
            type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)}
            placeholder="Token (private repos)"
            style={{ width: "100%", padding: "0.5rem 0.625rem", borderRadius: "0.5rem", fontSize: "0.75rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", color: "var(--color-text)", outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border-2)")}
          />
          {cloneError && <p style={{ color: "var(--color-error)", fontSize: "0.75rem" }}>{cloneError}</p>}
          <button
            onClick={handleClone} disabled={!repoUrl.trim() || cloning}
            style={{ padding: "0.5rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, background: "var(--color-accent)", color: "#000", border: "none", cursor: cloning ? "wait" : "pointer", opacity: cloning ? 0.7 : 1 }}
          >
            {cloning ? "Cloning…" : "Clone"}
          </button>
        </div>
      )}

      {/* New file panel */}
      {showNewFile && (
        <div style={{ padding: "0.625rem", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", display: "flex", gap: "0.5rem" }}>
          <input
            type="text" value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFile()}
            placeholder="filename.ts" autoFocus
            style={{ flex: 1, padding: "0.4rem 0.625rem", borderRadius: "0.5rem", fontSize: "0.8rem", background: "var(--color-surface-3)", border: "1px solid var(--color-accent)", color: "var(--color-text)", fontFamily: "var(--font-mono)", outline: "none" }}
          />
          <button
            onClick={createFile}
            style={{ padding: "0.4rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, background: "var(--color-accent)", color: "#000", border: "none", cursor: "pointer" }}
          >
            Create
          </button>
        </div>
      )}

      {/* File list */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
        {loading ? (
          <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
            <p style={{ color: "var(--color-text-3)", fontSize: "0.8rem" }}>Loading…</p>
          </div>
        ) : files.length === 0 ? (
          <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
            <p style={{ color: "var(--color-text-3)", fontSize: "0.8rem" }}>No files yet</p>
            <p style={{ color: "var(--color-text-3)", fontSize: "0.75rem", marginTop: "0.25rem", lineHeight: 1.5 }}>Clone a repo or create a new file to get started.</p>
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => openFile(file)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.375rem 0.625rem", textAlign: "left",
                background: activeFile === file.path ? "var(--color-surface-3)" : "transparent",
                borderTop: "none", borderRight: "none", borderBottom: "none",
                borderLeft: `2px solid ${activeFile === file.path ? "var(--color-accent)" : "transparent"}`,
                cursor: "pointer",
              }}
              className="file-row"
              onMouseEnter={(e) => { if (activeFile !== file.path) e.currentTarget.style.background = "var(--color-surface-2)"; }}
              onMouseLeave={(e) => { if (activeFile !== file.path) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                {file.isDir
                  ? <IconFolder size={13} style={{ color: "var(--color-accent)", flexShrink: 0 } as React.CSSProperties} />
                  : <IconFile size={13} style={{ color: "var(--color-text-3)", flexShrink: 0 } as React.CSSProperties} />
                }
                <span style={{
                  color: activeFile === file.path ? "var(--color-text)" : "var(--color-text-2)",
                  fontSize: "0.8rem", fontFamily: "var(--font-mono)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {file.name}
                </span>
              </div>
              {!file.isDir && (
                <button
                  onClick={(e) => deleteFile(file, e)}
                  style={{ padding: "0.125rem", borderRadius: "0.25rem", background: "transparent", border: "none", color: "var(--color-text-3)", cursor: "pointer", opacity: 0, flexShrink: 0 }}
                  className="delete-btn"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                >
                  <IconTrash size={11} />
                </button>
              )}
            </button>
          ))
        )}
      </div>

      <style>{`.file-row:hover .delete-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
