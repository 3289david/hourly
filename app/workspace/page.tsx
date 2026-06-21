"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceHeader } from "@/components/workspace/header";
import { ChatPanel } from "@/components/workspace/chat";
import { EditorPanel } from "@/components/workspace/editor";
import { TerminalPanel } from "@/components/workspace/terminal-panel";
import { FileSidebar } from "@/components/workspace/file-sidebar";
import { IconHourly } from "@/components/icons";

type Tab = "chat" | "editor" | "terminal";

interface SessionState {
  tier: string;
  expiresAt: number;
  sessionId: string;
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <polyline points="4 17 10 11 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
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
  const [filesVersion, setFilesVersion] = useState(0);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) { router.replace("/activate"); return; }
        const data = (await res.json()) as SessionState;
        setSession(data);
        if (data.tier === "trial") setModelId("qwen3-coder-free");
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.25rem", background: "var(--color-bg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
          <IconHourly size={28} />
          <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "1.125rem", fontWeight: 600 }}>Hourly</span>
        </div>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", color: "var(--color-accent)" } as React.CSSProperties} aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem" }}>Loading your workspace…</p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "AI Chat", icon: <ChatIcon /> },
    { id: "editor", label: activeFile ? activeFile.split("/").pop()! : "Editor", icon: <EditorIcon /> },
    { id: "terminal", label: "Terminal", icon: <TerminalIcon /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden", background: "var(--color-bg)" }}>
      <WorkspaceHeader modelId={modelId} onModelChange={setModelId} expiresAt={session.expiresAt} tier={session.tier} />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* File sidebar */}
        {sidebarOpen && (
          <div style={{ width: "220px", flexShrink: 0, minHeight: 0 }}>
            <FileSidebar onFileSelect={handleFileSelect} onFileSave={handleFileSave} activeFile={activeFile} refreshKey={filesVersion} />
          </div>
        )}

        {/* Main panel */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>

          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "stretch", flexShrink: 0,
            height: "42px",
            background: "var(--color-surface-3)",
            borderBottom: "1px solid var(--color-border)",
          }}>
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "42px", flexShrink: 0,
                color: sidebarOpen ? "var(--color-accent)" : "var(--color-text-3)",
                background: "transparent", border: "none",
                borderRight: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = sidebarOpen ? "var(--color-accent)" : "var(--color-text-3)")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Tabs */}
            {TABS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0 1.125rem",
                  fontSize: "0.8rem", fontWeight: activeTab === id ? 600 : 400,
                  color: activeTab === id ? "var(--color-text)" : "var(--color-text-3)",
                  background: activeTab === id ? "var(--color-surface-2)" : "transparent",
                  border: "none",
                  borderBottom: activeTab === id ? "2px solid var(--color-accent)" : "2px solid transparent",
                  borderRight: "1px solid var(--color-border)",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (activeTab !== id) { e.currentTarget.style.color = "var(--color-text-2)"; e.currentTarget.style.background = "var(--color-surface-2)"; } }}
                onMouseLeave={(e) => { if (activeTab !== id) { e.currentTarget.style.color = "var(--color-text-3)"; e.currentTarget.style.background = "transparent"; } }}
              >
                <span style={{ opacity: activeTab === id ? 1 : 0.6 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, display: activeTab === "chat" ? "flex" : "none", flexDirection: "column" }}>
              <ChatPanel
                modelId={modelId}
                onModelChange={setModelId}
                fileContext={activeFile && fileContent ? `File: ${activeFile}\n\`\`\`\n${fileContent.slice(0, 8000)}\n\`\`\`` : undefined}
                tier={session.tier}
                onFilesChanged={() => setFilesVersion((v) => v + 1)}
              />
            </div>
            <div style={{ position: "absolute", inset: 0, display: activeTab === "editor" ? "flex" : "none", flexDirection: "column" }}>
              <EditorPanel filePath={activeFile} initialContent={fileContent} onSave={activeFile ? (c) => handleFileSave(activeFile, c) : undefined} />
            </div>
            <div style={{ position: "absolute", inset: 0, display: activeTab === "terminal" ? "flex" : "none", flexDirection: "column" }}>
              <TerminalPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
