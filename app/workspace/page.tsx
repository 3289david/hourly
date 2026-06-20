"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceHeader } from "@/components/workspace/header";
import { ChatPanel } from "@/components/workspace/chat";
import { EditorPanel } from "@/components/workspace/editor";
import { TerminalPanel } from "@/components/workspace/terminal-panel";
import { FileSidebar } from "@/components/workspace/file-sidebar";

type Tab = "chat" | "editor" | "terminal";

interface SessionState {
  tier: string;
  expiresAt: number;
  sessionId: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [modelId, setModelId] = useState("auto");
  const [activeFile, setActiveFile] = useState<string | undefined>();
  const [fileContent, setFileContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) {
          router.replace("/activate");
          return;
        }
        const data = (await res.json()) as SessionState;
        setSession(data);
      } catch {
        router.replace("/activate");
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  async function handleFileSave(path: string, content: string) {
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, content }),
    });
  }

  function handleFileSelect(path: string, content: string) {
    setActiveFile(path);
    setFileContent(content);
    setActiveTab("editor");
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spin 1s linear infinite", color: "var(--color-accent)" } as React.CSSProperties}
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
            Loading workspace...
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <WorkspaceHeader
        modelId={modelId}
        onModelChange={setModelId}
        expiresAt={session.expiresAt}
      />

      <div className="flex flex-1 min-h-0">
        {/* File sidebar */}
        {sidebarOpen && (
          <div className="w-52 flex-shrink-0 min-h-0">
            <FileSidebar
              onFileSelect={handleFileSelect}
              onFileSave={handleFileSave}
              activeFile={activeFile}
            />
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              background: "rgba(6,6,10,0.8)",
              borderBottom: "1px solid var(--color-border)",
              height: "38px",
            }}
          >
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                flexShrink: 0,
                color: sidebarOpen ? "var(--color-accent)" : "var(--color-text-3)",
                background: "transparent",
                border: "none",
                borderRight: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = sidebarOpen ? "var(--color-accent)" : "var(--color-text-3)")
              }
              title={sidebarOpen ? "Hide files" : "Show files"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {(["chat", "editor", "terminal"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0 1.25rem",
                  height: "38px",
                  fontSize: "0.75rem",
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "var(--color-text)" : "var(--color-text-3)",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--color-accent)" : "2px solid transparent",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) e.currentTarget.style.color = "var(--color-text-2)";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) e.currentTarget.style.color = "var(--color-text-3)";
                }}
              >
                {tab === "chat"
                  ? "AI Chat"
                  : tab === "editor"
                  ? activeFile
                    ? activeFile.split("/").pop()
                    : "Editor"
                  : "Terminal"}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 relative">
            <div
              className="absolute inset-0"
              style={{ display: activeTab === "chat" ? "block" : "none" }}
            >
              <ChatPanel
                modelId={modelId}
                onModelChange={setModelId}
                fileContext={
                  activeFile && fileContent
                    ? `File: ${activeFile}\n\`\`\`\n${fileContent.slice(0, 8000)}\n\`\`\``
                    : undefined
                }
              />
            </div>

            <div
              className="absolute inset-0"
              style={{ display: activeTab === "editor" ? "block" : "none" }}
            >
              <EditorPanel
                filePath={activeFile}
                initialContent={fileContent}
                onSave={activeFile ? (c) => handleFileSave(activeFile, c) : undefined}
              />
            </div>

            <div
              className="absolute inset-0"
              style={{ display: activeTab === "terminal" ? "block" : "none" }}
            >
              <TerminalPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
