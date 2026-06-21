"use client";

import { useState, useRef, useEffect } from "react";
import { IconSend, IconStop, IconSparkle, IconCopy } from "@/components/icons";
import { MODELS } from "@/lib/models";

// ── Types ────────────────────────────────────────────────────────────────────

type TextBlock = { type: "text"; content: string };
type ToolBlock = {
  type: "tool";
  id: string;
  name: string;
  input: Record<string, string>;
  output?: string;
  error?: boolean;
  running: boolean;
};
type Block = TextBlock | ToolBlock;

interface UserMessage { role: "user"; content: string }
interface AssistantMessage { role: "assistant"; blocks: Block[]; model?: string }
type Message = UserMessage | AssistantMessage;

interface ChatPanelProps {
  modelId: string;
  onModelChange: (id: string) => void;
  fileContext?: string;
  tier?: string;
}

const SUGGESTIONS = [
  "Create a Next.js todo app with Tailwind CSS",
  "Build a REST API with Express and SQLite",
  "Write a Python script to process CSV files",
  "Set up a TypeScript project from scratch",
];

// ── Tool config ───────────────────────────────────────────────────────────────

const TOOL_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  run_terminal: { label: "Terminal",   color: "#00d4ff", bg: "rgba(0,212,255,0.06)",    border: "rgba(0,212,255,0.2)" },
  read_file:    { label: "Read file",  color: "#a78bfa", bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.2)" },
  write_file:   { label: "Write file", color: "#34d399", bg: "rgba(52,211,153,0.06)",  border: "rgba(52,211,153,0.2)" },
  list_files:   { label: "List files", color: "#fbbf24", bg: "rgba(251,191,36,0.06)",  border: "rgba(251,191,36,0.2)" },
  delete_file:  { label: "Delete",     color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)" },
};

function toolInputPreview(name: string, input: Record<string, string>): string {
  switch (name) {
    case "run_terminal": return `$ ${input.command ?? ""}`;
    case "read_file":    return input.path ?? "";
    case "write_file":   return input.path ?? "";
    case "list_files":   return input.path ? input.path : "/";
    case "delete_file":  return input.path ?? "";
    default:             return JSON.stringify(input);
  }
}

// ── Markdown-lite renderer ────────────────────────────────────────────────────

function renderContent(content: string): React.ReactNode[] {
  const codeBlockRe = /```([\w]*)\n?([\s\S]*?)```/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = codeBlockRe.exec(content)) !== null) {
    if (m.index > last) {
      nodes.push(
        <span key={last} style={{ whiteSpace: "pre-wrap" }}>
          {content.slice(last, m.index)}
        </span>
      );
    }
    nodes.push(
      <div key={m.index} style={{ margin: "0.625rem 0", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid var(--color-border)" }}>
        {m[1] && (
          <div style={{ background: "var(--color-surface-2)", padding: "0.25rem 0.875rem", fontSize: "0.7rem", color: "var(--color-text-3)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--color-border)" }}>
            {m[1]}
          </div>
        )}
        <pre style={{ margin: 0, padding: "0.875rem", background: "#0a0a12", overflowX: "auto", fontSize: "0.8125rem", lineHeight: 1.6, fontFamily: "var(--font-mono)", color: "var(--color-text)" }}>
          <code>{m[2].replace(/\n$/, "")}</code>
        </pre>
      </div>
    );
    last = m.index + m[0].length;
  }

  if (last < content.length) {
    nodes.push(
      <span key={last} style={{ whiteSpace: "pre-wrap" }}>
        {content.slice(last)}
      </span>
    );
  }

  return nodes;
}

// ── Tool block component ──────────────────────────────────────────────────────

function ToolBlock({ block }: { block: ToolBlock }) {
  const [expanded, setExpanded] = useState(true);
  const meta = TOOL_META[block.name] ?? { label: block.name, color: "#888", bg: "rgba(128,128,128,0.06)", border: "rgba(128,128,128,0.2)" };
  const preview = toolInputPreview(block.name, block.input);
  const isTerminal = block.name === "run_terminal";
  const isWrite = block.name === "write_file";

  return (
    <div style={{ margin: "0.375rem 0", borderRadius: "0.625rem", overflow: "hidden", border: `1px solid ${block.error ? "rgba(248,113,113,0.35)" : meta.border}`, background: block.error ? "rgba(248,113,113,0.04)" : meta.bg }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 0.75rem", borderBottom: expanded && (block.output !== undefined || block.running) ? `1px solid ${meta.border}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: block.error ? "#f87171" : meta.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {meta.label}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-text-2)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {preview}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {block.running && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", color: meta.color } as React.CSSProperties} aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {!block.running && block.output !== undefined && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ fontSize: "0.65rem", color: "var(--color-text-3)", background: "none", border: "none", cursor: "pointer", padding: "0 0.25rem" }}
            >
              {expanded ? "▲" : "▼"}
            </button>
          )}
        </div>
      </div>

      {/* Output */}
      {expanded && block.output !== undefined && (
        <div style={{ padding: "0.625rem 0.75rem", maxHeight: isWrite ? "none" : "280px", overflowY: "auto" }}>
          <pre style={{
            margin: 0, padding: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "0.775rem",
            lineHeight: 1.6,
            color: block.error ? "#f87171" : "var(--color-text-2)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {isWrite
              ? `// ${block.input.path}\n${block.output}`
              : (block.output || "(no output)")}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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

  function getMessageText(msg: Message): string {
    if (msg.role === "user") return msg.content;
    return msg.blocks.filter((b): b is TextBlock => b.type === "text").map((b) => b.content).join("");
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || streaming) return;

    const userMsg: UserMessage = { role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setStreaming(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const assistantMsg: AssistantMessage = { role: "assistant", blocks: [] };
    setMessages([...history, assistantMsg]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: getMessageText(m) })),
          modelId,
          fileContext,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setMessages([...history, { role: "assistant", blocks: [{ type: "text", content: `Error: ${err.error ?? "Request failed"}` }] }]);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const event = JSON.parse(jsonStr) as {
              type?: string;
              content?: string;
              id?: string;
              name?: string;
              input?: Record<string, string>;
              output?: string;
              error?: boolean | string;
              model?: string;
              message?: string;
            };

            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role !== "assistant") return prev;
              const blocks = [...last.blocks];

              switch (event.type) {
                case "text": {
                  const lastBlock = blocks[blocks.length - 1];
                  if (lastBlock?.type === "text") {
                    blocks[blocks.length - 1] = { ...lastBlock, content: lastBlock.content + (event.content ?? "") };
                  } else {
                    blocks.push({ type: "text", content: event.content ?? "" });
                  }
                  break;
                }
                case "tool_call": {
                  blocks.push({
                    type: "tool",
                    id: event.id ?? "",
                    name: event.name ?? "",
                    input: event.input ?? {},
                    running: true,
                  });
                  break;
                }
                case "tool_result": {
                  const idx = blocks.findLastIndex((b) => b.type === "tool" && b.id === event.id);
                  if (idx >= 0) {
                    blocks[idx] = {
                      ...(blocks[idx] as ToolBlock),
                      output: event.output ?? "",
                      error: !!event.error,
                      running: false,
                    };
                  }
                  break;
                }
                case "done": {
                  updated[updated.length - 1] = { ...last, blocks, model: event.model };
                  return updated;
                }
                case "error": {
                  const lastBlock = blocks[blocks.length - 1];
                  if (lastBlock?.type === "text") {
                    blocks[blocks.length - 1] = { ...lastBlock, content: lastBlock.content + `\n\nError: ${event.message}` };
                  } else {
                    blocks.push({ type: "text", content: `Error: ${event.message}` });
                  }
                  break;
                }
              }

              updated[updated.length - 1] = { ...last, blocks };
              return updated;
            });
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = { ...last, blocks: [{ type: "text", content: "Connection error. Please try again." }] };
          }
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

  async function copyMessage(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-surface)" }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-accent-dim)", border: "1px solid rgba(0,212,255,0.25)", color: "var(--color-accent)", marginBottom: "1.25rem" }}>
              <IconSparkle size={24} />
            </div>
            <p style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.375rem" }}>AI coding agent</p>
            <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "24rem", marginBottom: "2rem" }}>
              Ask it to build, fix, or explain anything. It can run terminal commands, edit files, and verify its own work.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", maxWidth: "26rem" }}>
              {SUGGESTIONS.map((prompt) => (
                <button key={prompt} onClick={() => { setInput(prompt); textareaRef.current?.focus(); }}
                  style={{ textAlign: "left", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", fontSize: "0.85rem", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-2)", cursor: "pointer", lineHeight: 1.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-border-2)"; e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.background = "var(--color-surface-3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-2)"; e.currentTarget.style.background = "var(--color-surface-2)"; }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: msg.role === "user" ? "80%" : "96%", position: "relative", width: msg.role === "assistant" ? "100%" : undefined }} className="group">

              {msg.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}>
                  <IconSparkle size={11} style={{ color: "var(--color-accent)" } as React.CSSProperties} />
                  <span style={{ color: "var(--color-text-3)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {msg.model ? (MODELS.find((m) => m.id === msg.model)?.name ?? msg.model) : "AI"}
                  </span>
                </div>
              )}

              {msg.role === "user" ? (
                <div style={{ padding: "0.75rem 1rem", borderRadius: "1rem", borderBottomRightRadius: "0.25rem", background: "var(--color-accent)", color: "#000", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 450, whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </div>
              ) : (
                <div>
                  {msg.blocks.length === 0 && (
                    <span style={{ display: "inline-block", width: "8px", height: "15px", background: "var(--color-accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", borderRadius: "1px" }} />
                  )}
                  {msg.blocks.map((block, bi) => {
                    if (block.type === "text") {
                      return (
                        <div key={bi} style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--color-text)", marginBottom: block.content ? "0.25rem" : 0 }}>
                          {block.content
                            ? renderContent(block.content)
                            : <span style={{ display: "inline-block", width: "8px", height: "15px", background: "var(--color-accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", borderRadius: "1px" }} />
                          }
                        </div>
                      );
                    }
                    return <ToolBlock key={bi} block={block} />;
                  })}

                  {msg.blocks.some((b) => b.type === "text" && b.content) && (
                    <button
                      className="group-hover-show"
                      style={{ opacity: 0, marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: "0.375rem", color: "var(--color-text-3)", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.7rem" }}
                      onClick={() => copyMessage(getMessageText(msg), i)}
                      title="Copy"
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-3)")}
                    >
                      {copiedIdx === i
                        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden><polyline points="20,6 9,17 4,12" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Copied</>
                        : <><IconCopy size={12} /> Copy</>
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "0 1rem 1rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", padding: "0 0.25rem" }}>
          {isTrial ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", color: "var(--color-text-3)", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem" }}>
                Qwen3 Coder (Free)
              </span>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, fontFamily: "var(--font-mono)", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: "rgba(255,170,0,0.12)", border: "1px solid rgba(255,170,0,0.35)", color: "var(--color-warning)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                Trial — free only
              </span>
            </div>
          ) : (
            <select
              value={modelId}
              onChange={(e) => onModelChange(e.target.value)}
              style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)", color: "var(--color-text-2)", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem", outline: "none", cursor: "pointer", maxWidth: "260px" }}
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
              Clear
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.625rem", background: "var(--color-surface-3)", border: "1px solid var(--color-border-2)", borderRadius: "0.875rem", padding: "0.75rem" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI to build, fix, or explain anything…"
            rows={1}
            style={{ flex: 1, resize: "none", background: "transparent", border: "none", outline: "none", color: "var(--color-text)", fontSize: "0.9375rem", lineHeight: 1.55, minHeight: "1.5rem", maxHeight: "160px", fontFamily: "var(--font-sans)" }}
          />

          {streaming ? (
            <button onClick={stopStream} style={{ flexShrink: 0, width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", cursor: "pointer", background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.3)", color: "var(--color-error)" }} title="Stop">
              <IconStop size={16} />
            </button>
          ) : (
            <button onClick={sendMessage} disabled={!input.trim()} style={{ flexShrink: 0, width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", cursor: input.trim() ? "pointer" : "default", background: input.trim() ? "var(--color-accent)" : "var(--color-surface)", border: "none", color: input.trim() ? "#000" : "var(--color-text-3)", transition: "all 0.15s" }} title="Send (Enter)">
              <IconSend size={16} />
            </button>
          )}
        </div>

        <p style={{ color: "var(--color-text-3)", fontSize: "0.7rem", marginTop: "0.5rem", textAlign: "center" }}>
          AI can run terminal commands and edit files — review before deploying
        </p>
      </div>

      <style>{`
        .group:hover .group-hover-show { opacity: 1 !important; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
