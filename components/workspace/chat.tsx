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
}

export function ChatPanel({ modelId, onModelChange, fileContext }: ChatPanelProps) {
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
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
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
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `Error: ${err.error ?? "Request failed"}`,
          },
        ]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr) as {
              content?: string;
              done?: boolean;
              model?: string;
              error?: string;
            };

            if (data.error) {
              accumulated += `\n\nError: ${data.error}`;
            } else if (data.content) {
              accumulated += data.content;
            }

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: accumulated,
                model: data.model,
              };
              return updated;
            });
          } catch {
            // skip malformed SSE line
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: "Connection error. Please try again.",
          };
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
    <div className="flex flex-col h-full" style={{ background: "var(--color-surface)" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "var(--color-accent-dim)",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
              }}
            >
              <IconSparkle size={20} />
            </div>
            <p
              className="font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Start coding with AI
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-3)" }}>
              Ask anything — write code, debug, refactor, explain.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
              {[
                "Refactor this component to use React hooks",
                "Find the bug causing this TypeScript error",
                "Write a REST API for user authentication",
                "Optimize this SQL query for performance",
              ].map((prompt) => (
                <button
                  key={prompt}
                  className="text-left px-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-2)",
                  }}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border-2)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-2)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[85%] group"
              style={{ position: "relative" }}
            >
              {msg.role === "assistant" && (
                <div
                  className="text-xs mb-1 flex items-center gap-1"
                  style={{ color: "var(--color-text-3)" }}
                >
                  <IconSparkle size={10} />
                  {msg.model
                    ? MODELS.find((m) => m.id === msg.model)?.name ?? msg.model
                    : "AI"}
                </div>
              )}
              <div
                className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "var(--color-accent)",
                        color: "#000",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "var(--color-surface-3)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        borderBottomLeftRadius: "4px",
                        whiteSpace: "pre-wrap",
                        fontFamily: msg.content.includes("```")
                          ? "inherit"
                          : undefined,
                      }
                }
              >
                {msg.content || (
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "14px",
                      background: "var(--color-accent)",
                      animation: "blink 1s step-end infinite",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>

              {msg.role === "assistant" && msg.content && (
                <button
                  className="absolute top-6 right-2 opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                  style={{ color: "var(--color-text-3)" }}
                  onClick={() => copyMessage(msg.content, i)}
                  title="Copy"
                >
                  {copiedIdx === i ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <polyline points="20,6 9,17 4,12" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <IconCopy size={13} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{
            background: "var(--color-surface-3)",
            border: "1px solid var(--color-border-2)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI anything... (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="flex-1 resize-none text-sm leading-relaxed bg-transparent border-none outline-none"
            style={{
              color: "var(--color-text)",
              minHeight: "24px",
              maxHeight: "200px",
            }}
          />

          {streaming ? (
            <button
              onClick={stopStream}
              className="p-2 rounded-lg transition-colors flex-shrink-0"
              style={{
                background: "rgba(255,68,68,0.1)",
                color: "var(--color-error)",
                border: "1px solid rgba(255,68,68,0.3)",
              }}
              title="Stop"
            >
              <IconStop size={14} />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-2 rounded-lg transition-all flex-shrink-0"
              style={{
                background: input.trim()
                  ? "var(--color-accent)"
                  : "var(--color-surface)",
                color: input.trim() ? "#000" : "var(--color-text-3)",
                cursor: input.trim() ? "pointer" : "default",
              }}
              title="Send (Enter)"
            >
              <IconSend size={14} />
            </button>
          )}
        </div>

        <div
          className="flex items-center justify-between mt-2 px-1"
        >
          <select
            value={modelId}
            onChange={(e) => onModelChange(e.target.value)}
            className="text-xs rounded-lg px-2 py-1 outline-none"
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-2)",
            }}
          >
              <option value="auto">Auto — Smart Route</option>
            <optgroup label="── Reasoning">
              <option value="deepseek-r1">DeepSeek R1 (May 2025) · $0.50/1M</option>
              <option value="gemini-flash">Gemini 2.5 Flash · $0.30/1M · 1M ctx</option>
            </optgroup>
            <optgroup label="── Coding">
              <option value="qwen3-coder">Qwen3 Coder · $0.22/1M · 1M ctx</option>
              <option value="codestral">Mistral Codestral 2508 · $0.30/1M</option>
              <option value="deepseek-v3">DeepSeek V3 · $0.20/1M</option>
            </optgroup>
            <optgroup label="── Debug">
              <option value="kimi-k2">Kimi K2 · $0.57/1M</option>
            </optgroup>
            <optgroup label="── Fast / Cheap">
              <option value="deepseek-v4-flash">DeepSeek V4 Flash · $0.09/1M · 1M ctx</option>
              <option value="gemini-flash-lite">Gemini 2.5 Flash Lite · $0.10/1M</option>
              <option value="llama4-scout">Llama 4 Scout · $0.10/1M · 10M ctx</option>
              <option value="qwen3-coder-free">Qwen3 Coder FREE · $0/1M</option>
            </optgroup>
          </select>

          {messages.length > 0 && (
            <button
              className="text-xs transition-colors"
              style={{ color: "var(--color-text-3)" }}
              onClick={() => setMessages([])}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text-2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-3)")
              }
            >
              Clear chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
