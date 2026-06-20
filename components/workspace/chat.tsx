"use client";

import { useState, useRef, useEffect } from "react";
import { IconSend, IconStop, IconSparkle, IconCopy } from "@/components/icons";
import { MODELS } from "@/lib/models";

interface Message {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

interface ChatPanelProps {
  modelId: string;
  onModelChange: (id: string) => void;
  fileContext?: string;
  tier?: string;
}

const SUGGESTIONS = [
  "Refactor this component to use React hooks",
  "Find the bug causing this TypeScript error",
  "Write a REST API for user authentication",
  "Optimize this SQL query for performance",
];

export function ChatPanel({ modelId, onModelChange, fileContext, tier }: ChatPanelProps) {
  const isTrial = tier === "trial";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || streaming) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          modelId,
          fileContext,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setMessages([...newMessages, { role: "assistant", content: `Error: ${err.error ?? "Request failed"}` }]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const data = JSON.parse(jsonStr) as { content?: string; done?: boolean; model?: string; error?: string };
            if (data.error) accumulated += `\n\nError: ${data.error}`;
            else if (data.content) accumulated += data.content;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated, model: data.model };
              return updated;
            });
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: "Connection error. Please try again." };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stopStream() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  async function copyMessage(content: string, idx: number) {
    await navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-surface)" }}>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{
              width: "3.5rem", height: "3.5rem", borderRadius: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--color-accent-dim)", border: "1px solid rgba(0,212,255,0.25)",
              color: "var(--color-accent)", marginBottom: "1.25rem",
            }}>
              <IconSparkle size={24} />
            </div>
            <p style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
              Start coding with AI
            </p>
            <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "22rem", marginBottom: "2rem" }}>
              Ask anything — write code, debug, refactor, or explain concepts.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", width: "100%", maxWidth: "26rem" }}>
              {SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); textareaRef.current?.focus(); }}
                  style={{
                    textAlign: "left", padding: "0.75rem 1rem",
                    borderRadius: "0.75rem", fontSize: "0.875rem",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-2)", cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-2)";
                    e.currentTarget.style.color = "var(--color-text)";
                    e.currentTarget.style.background = "var(--color-surface-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-2)";
                    e.currentTarget.style.background = "var(--color-surface-2)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", position: "relative" }} className="group">

              {msg.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}>
                  <IconSparkle size={11} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
                  <span style={{ color: "var(--color-text-3)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {msg.model ? (MODELS.find((m) => m.id === msg.model)?.name ?? msg.model) : "AI"}
                  </span>
                </div>
              )}

              <div style={msg.role === "user" ? {
                padding: "0.75rem 1rem",
                borderRadius: "1rem", borderBottomRightRadius: "0.25rem",
                background: "var(--color-accent)",
                color: "#000", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 450,
              } : {
                padding: "0.875rem 1.125rem",
                borderRadius: "1rem", borderBottomLeftRadius: "0.25rem",
                background: "var(--color-surface-3)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)", fontSize: "0.9rem", lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>
                {msg.content || (
                  <span style={{ display: "inline-block", width: "8px", height: "15px", background: "var(--color-accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", borderRadius: "1px" }} />
                )}
              </div>

              {msg.role === "assistant" && msg.content && (
                <button
                  className="group-hover-show"
                  style={{
                    position: "absolute", top: "2rem", right: "-1.75rem",
                    opacity: 0, padding: "0.25rem", borderRadius: "0.375rem",
                    color: "var(--color-text-3)", background: "transparent", border: "none", cursor: "pointer",
                  }}
                  onClick={() => copyMessage(msg.content, i)}
                  title="Copy"
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                >
                  {copiedIdx === i ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <polyline points="20,6 9,17 4,12" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : <IconCopy size={13} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "0 1rem 1rem", flexShrink: 0 }}>
        {/* Model selector row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem", padding: "0 0.25rem" }}>
          {isTrial ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                background: "var(--color-surface-3)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-3)",
                borderRadius: "0.5rem",
                padding: "0.375rem 0.625rem",
                fontSize: "0.75rem",
              }}>
                Qwen3 Coder (Free)
              </span>
              <span style={{
                fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-mono)",
                padding: "0.15rem 0.5rem", borderRadius: "9999px",
                background: "rgba(255,170,0,0.12)", border: "1px solid rgba(255,170,0,0.35)",
                color: "var(--color-warning)", textTransform: "uppercase", letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}>
                Trial — free models only
              </span>
            </div>
          ) : (
            <select
              value={modelId}
              onChange={(e) => onModelChange(e.target.value)}
              style={{
                background: "var(--color-surface-3)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-2)",
                borderRadius: "0.5rem",
                padding: "0.375rem 0.625rem",
                fontSize: "0.75rem",
                outline: "none",
                cursor: "pointer",
                maxWidth: "260px",
              }}
            >
              <option value="auto">Auto — Smart Routing</option>
              <optgroup label="── Reasoning">
                <option value="deepseek-r1">DeepSeek R1</option>
                <option value="gemini-flash">Gemini 2.5 Flash</option>
              </optgroup>
              <optgroup label="── Coding">
                <option value="qwen3-coder">Qwen3 Coder</option>
                <option value="codestral">Codestral 2508</option>
                <option value="deepseek-v3">DeepSeek V3</option>
              </optgroup>
              <optgroup label="── Debug">
                <option value="kimi-k2">Kimi K2</option>
              </optgroup>
              <optgroup label="── Fast">
                <option value="deepseek-v4-flash">DeepSeek V4 Flash</option>
                <option value="gemini-flash-lite">Gemini Flash Lite</option>
                <option value="llama4-scout">Llama 4 Scout (10M ctx)</option>
                <option value="qwen3-coder-free">Qwen3 Coder (Free)</option>
              </optgroup>
            </select>
          )}

          {messages.length > 0 && (
            <button
              style={{ fontSize: "0.75rem", color: "var(--color-text-3)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem 0.5rem" }}
              onClick={() => setMessages([])}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
            >
              Clear chat
            </button>
          )}
        </div>

        {/* Textarea + send */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: "0.625rem",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border-2)",
          borderRadius: "0.875rem",
          padding: "0.75rem",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI anything… (Enter to send, Shift+Enter for newline)"
            rows={1}
            style={{
              flex: 1, resize: "none", background: "transparent",
              border: "none", outline: "none",
              color: "var(--color-text)", fontSize: "0.9375rem",
              lineHeight: 1.55, minHeight: "1.5rem", maxHeight: "160px",
              fontFamily: "var(--font-sans)",
            }}
          />

          {streaming ? (
            <button
              onClick={stopStream}
              style={{
                flexShrink: 0, width: "2.25rem", height: "2.25rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "0.625rem", cursor: "pointer",
                background: "rgba(255,68,68,0.1)",
                border: "1px solid rgba(255,68,68,0.3)",
                color: "var(--color-error)",
              }}
              title="Stop"
            >
              <IconStop size={16} />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                flexShrink: 0, width: "2.25rem", height: "2.25rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "0.625rem", cursor: input.trim() ? "pointer" : "default",
                background: input.trim() ? "var(--color-accent)" : "var(--color-surface)",
                border: "none",
                color: input.trim() ? "#000" : "var(--color-text-3)",
                transition: "all 0.15s",
              }}
              title="Send (Enter)"
            >
              <IconSend size={16} />
            </button>
          )}
        </div>

        <p style={{ color: "var(--color-text-3)", fontSize: "0.7rem", marginTop: "0.5rem", textAlign: "center" }}>
          AI may make mistakes — review important code before deploying
        </p>
      </div>

      <style>{`
        .group:hover .group-hover-show { opacity: 1 !important; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
      `}</style>
    </div>
  );
}
