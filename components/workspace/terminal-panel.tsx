"use client";

import { useState, useRef, useEffect } from "react";

interface TerminalEntry {
  command: string;
  output: string;
  exitCode: number | null;
}

function formatCwd(cwd: string): string {
  if (cwd === "/workspace" || cwd === "/workspace/") return "~/workspace";
  if (cwd.startsWith("/workspace/")) return "~/" + cwd.slice("/workspace/".length);
  if (cwd === "/home/sandbox") return "~";
  if (cwd.startsWith("/home/sandbox/")) return "~/" + cwd.slice("/home/sandbox/".length);
  return cwd;
}

export function TerminalPanel() {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cwd, setCwd] = useState("/workspace");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  async function runCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);
    setInput("");
    setRunning(true);

    if (trimmed === "clear") {
      setHistory([]); setRunning(false); return;
    }

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmed }),
      });
      const data = (await res.json()) as { output?: string; error?: string; exitCode?: number; cwd?: string };
      if (data.cwd) setCwd(data.cwd);
      setHistory((prev) => [
        ...prev,
        { command: trimmed, output: data.output ?? data.error ?? "", exitCode: data.exitCode ?? (res.ok ? 0 : 1) },
      ]);
    } catch {
      setHistory((prev) => [...prev, { command: trimmed, output: "Network error", exitCode: -1 }]);
    } finally {
      setRunning(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { runCommand(input); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(idx); setInput(cmdHistory[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx); setInput(idx === -1 ? "" : (cmdHistory[idx] ?? ""));
    } else if (e.key === "c" && e.ctrlKey) {
      setInput(""); setRunning(false);
    }
  }

  const prompt = formatCwd(cwd);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", background: "#08080e", fontFamily: "var(--font-mono)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Chrome bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", flexShrink: 0, background: "var(--color-surface-3)", borderBottom: "1px solid var(--color-border)" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#ffbd2e", display: "inline-block" }} />
        <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#28c840", display: "inline-block" }} />
        <span style={{ flex: 1 }} />
        <span style={{ color: "var(--color-text-3)", fontSize: "0.75rem" }}>sandbox — isolated</span>
        <span style={{ flex: 1 }} />
      </div>

      {/* Output */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem", lineHeight: 1.6 }}>
        {history.length === 0 && (
          <div style={{ color: "var(--color-text-3)" }}>
            <div style={{ color: "var(--color-accent)", marginBottom: "0.25rem" }}>Hourly sandbox terminal</div>
            <div>Isolated environment — your code runs safely in a container.</div>
            <div>Type <span style={{ color: "var(--color-text-2)" }}>ls</span> to list files, <span style={{ color: "var(--color-text-2)" }}>clear</span> to clear screen.</div>
          </div>
        )}

        {history.map((entry, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--color-text-3)" }}>{formatCwd(cwd)}</span>
              <span style={{ color: "var(--color-accent)" }}>$</span>
              <span style={{ color: "var(--color-text)" }}>{entry.command}</span>
            </div>
            {entry.output && (
              <pre style={{ marginTop: "0.25rem", whiteSpace: "pre-wrap", wordBreak: "break-word", color: entry.exitCode !== 0 ? "var(--color-error)" : "var(--color-text-2)", paddingLeft: "0.5rem" }}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--color-text-3)" }}>{prompt}</span>
          <span style={{ color: "var(--color-accent)" }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={running}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}
            aria-label="Terminal input"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          />
          {running && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", color: "var(--color-accent)" } as React.CSSProperties} aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
