"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconHourly, IconClock } from "@/components/icons";

interface WorkspaceHeaderProps {
  modelId: string;
  onModelChange: (id: string) => void;
  expiresAt?: number;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function WorkspaceHeader({
  modelId,
  onModelChange,
  expiresAt,
}: WorkspaceHeaderProps) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number>(
    expiresAt ? expiresAt - Date.now() : 0
  );
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const r = expiresAt - Date.now();
      setRemaining(r);
      if (r <= 0) {
        clearInterval(interval);
        router.push("/activate?expired=1");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, router]);

  const isLow = remaining < 10 * 60 * 1000;
  const isUrgent = remaining < 5 * 60 * 1000;

  async function handleLogout() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/");
  }

  const timerColor = isUrgent
    ? "var(--color-error)"
    : isLow
    ? "var(--color-warning)"
    : "var(--color-accent)";

  return (
    <header
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        flexShrink: 0,
        background: "rgba(6,6,10,0.95)",
        borderBottom: `1px solid ${isUrgent ? "rgba(255,68,68,0.4)" : isLow ? "rgba(255,170,0,0.3)" : "var(--color-border)"}`,
        backdropFilter: "blur(16px)",
        position: "relative",
        zIndex: 40,
      }}
    >
      {/* Left — logo + model */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <IconHourly size={22} />
          <span
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Hourly
          </span>
        </Link>

        <div
          style={{
            width: "1px",
            height: "18px",
            background: "var(--color-border)",
          }}
        />

        <select
          value={modelId}
          onChange={(e) => onModelChange(e.target.value)}
          style={{
            background: "var(--color-surface-3)",
            border: "1px solid var(--color-border-2)",
            color: "var(--color-text-2)",
            borderRadius: "0.5rem",
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem",
            outline: "none",
            cursor: "pointer",
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
      </div>

      {/* Center — session timer */}
      {expiresAt && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.875rem",
            borderRadius: "9999px",
            background: isUrgent
              ? "rgba(255,68,68,0.08)"
              : isLow
              ? "rgba(255,170,0,0.08)"
              : "rgba(0,212,255,0.06)",
            border: `1px solid ${
              isUrgent
                ? "rgba(255,68,68,0.25)"
                : isLow
                ? "rgba(255,170,0,0.25)"
                : "rgba(0,212,255,0.2)"
            }`,
          }}
        >
          <IconClock
            size={12}
            style={{ color: timerColor } as React.CSSProperties}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: timerColor,
              tabularNums: "tabular-nums",
            } as React.CSSProperties}
          >
            {formatDuration(remaining)}
          </span>
          {isLow && (
            <span style={{ fontSize: "0.7rem", color: timerColor }}>
              {isUrgent ? "Critical" : "Low"}
            </span>
          )}
        </div>
      )}

      {/* Right — extend + menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
        {isLow && (
          <a
            href="/#pricing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.375rem 0.875rem",
              borderRadius: "0.5rem",
              background: "var(--color-accent)",
              color: "#000",
              textDecoration: "none",
            }}
          >
            Extend
          </a>
        )}

        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "0.5rem",
            background: "transparent",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-3)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-2)";
            e.currentTarget.style.color = "var(--color-text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
          title="Menu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 0.5rem)",
              right: 0,
              zIndex: 50,
              borderRadius: "0.75rem",
              padding: "0.375rem",
              minWidth: "160px",
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                background: "transparent",
                border: "none",
                color: "var(--color-text-2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,68,68,0.08)";
                e.currentTarget.style.color = "var(--color-error)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-2)";
              }}
            >
              End session
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
