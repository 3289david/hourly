"use client";

import { useState, useRef, useEffect } from "react";

interface TerminalEntry {
  command: string;
  output: string;
  exitCode: number | null;
}

export function TerminalPanel() {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function runCommand(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);
    setRunning(true);

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      setRunning(false);
      return;
    }

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: trimmed }),
      });

      const data = (await res.json()) as {
        output?: string;
        error?: string;
        exitCode?: number;
      };

      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: data.output ?? data.error ?? "",
          exitCode: data.exitCode ?? (res.ok ? 0 : 1),
        },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: "Error: Failed to run command",
          exitCode: -1,
        },
      ]);
    } finally {
      setInput("");
      setRunning(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(newIdx);
      setInput(cmdHistory[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? "" : (cmdHistory[newIdx] ?? ""));
    } else if (e.key === "c" && e.ctrlKey) {
      setInput("");
      setRunning(false);
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "#0a0a0a",
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
        style={{
          background: "var(--color-surface-3)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <span
          className="text-xs ml-2"
          style={{ color: "var(--color-text-3)" }}
        >
          bash — workspace
        </span>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {history.length === 0 && (
          <div style={{ color: "var(--color-text-3)" }}>
            <div>Hourly workspace terminal.</div>
            <div>Type &apos;ls&apos; to see your files, &apos;clear&apos; to clear the screen.</div>
            <div style={{ marginTop: "8px", color: "var(--color-text-3)" }}>
              Commands run in your isolated workspace directory.
            </div>
          </div>
        )}

        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex items-center gap-2" style={{ color: "var(--color-accent)" }}>
              <span style={{ opacity: 0.6 }}>~/workspace</span>
              <span>$</span>
              <span style={{ color: "var(--color-text)" }}>{entry.command}</span>
            </div>
            {entry.output && (
              <pre
                className="mt-1 leading-relaxed whitespace-pre-wrap break-words"
                style={{
                  color:
                    entry.exitCode !== 0
                      ? "var(--color-error)"
                      : "var(--color-text-2)",
                }}
              >
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--color-accent)", opacity: 0.6 }}>~/workspace</span>
          <span style={{ color: "var(--color-accent)" }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={running}
            className="flex-1 bg-transparent border-none outline-none"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
            }}
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {running && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "spin 1s linear infinite", color: "var(--color-accent)" } as React.CSSProperties}
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
