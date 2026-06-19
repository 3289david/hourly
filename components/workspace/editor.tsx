"use client";

import { useEffect, useState } from "react";
import { IconFile } from "@/components/icons";
import type { editor } from "monaco-editor";

function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    rs: "rust",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    sh: "shell",
    bash: "shell",
    sql: "sql",
    toml: "toml",
    dockerfile: "dockerfile",
  };
  return map[ext] ?? "plaintext";
}

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

interface EditorPanelProps {
  filePath?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

type MonacoEditorType = React.ComponentType<{
  height: string;
  language: string;
  value: string;
  onChange: (v: string | undefined) => void;
  theme: string;
  options: editor.IStandaloneEditorConstructionOptions;
}>;

export function EditorPanel({ filePath, initialContent = "", onSave }: EditorPanelProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [EditorComponent, setEditorComponent] = useState<MonacoEditorType | null>(null);
  const language = getLanguageFromPath(filePath ?? "");

  useEffect(() => {
    import("@monaco-editor/react").then((mod) => {
      setEditorComponent(() => mod.default as MonacoEditorType);
    });
  }, []);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, filePath]);

  async function handleSave() {
    if (!filePath || !onSave) return;
    setSaving(true);
    try {
      onSave(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--color-surface)" }}>
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "var(--color-surface-3)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <IconFile size={14} style={{ color: "var(--color-text-3)" }} />
          <span
            className="text-xs"
            style={{
              color: filePath ? "var(--color-text-2)" : "var(--color-text-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {filePath ?? "No file selected"}
          </span>
          {filePath && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {language}
            </span>
          )}
        </div>

        {filePath && onSave && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              background: saved ? "rgba(0,255,136,0.1)" : "var(--color-surface)",
              color: saved ? "var(--color-success)" : "var(--color-text-2)",
              border: `1px solid ${saved ? "rgba(0,255,136,0.3)" : "var(--color-border-2)"}`,
            }}
          >
            <SaveIcon />
            {saved ? "Saved" : saving ? "Saving..." : "Save (Ctrl+S)"}
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {EditorComponent ? (
          <EditorComponent
            height="100%"
            language={language}
            value={content}
            onChange={(v) => setContent(v ?? "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              renderLineHighlight: "line",
              padding: { top: 12, bottom: 12 },
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: false,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: "var(--color-text-3)" }}>
              Loading editor...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
