"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconHourly, IconSettings, IconClock } from "@/components/icons";
import { MODELS } from "@/lib/models";

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
  const [showSettings, setShowSettings] = useState(false);

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

  return (
    <header
      className="flex items-center justify-between px-4 flex-shrink-0"
      style={{
        height: "48px",
        background: "var(--color-surface-3)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <IconHourly size={22} />
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
          >
            Hourly
          </span>
        </Link>

        {/* Model selector */}
        <select
          value={modelId}
          onChange={(e) => onModelChange(e.target.value)}
          className="text-xs rounded-lg px-2 py-1 outline-none"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-2)",
            color: "var(--color-text-2)",
          }}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id === "auto" ? "Auto" : m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Center: timer */}
      {expiresAt && (
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
          style={{
            background: isUrgent
              ? "rgba(255,68,68,0.1)"
              : isLow
              ? "rgba(255,170,0,0.1)"
              : "var(--color-surface)",
            border: `1px solid ${
              isUrgent
                ? "rgba(255,68,68,0.3)"
                : isLow
                ? "rgba(255,170,0,0.3)"
                : "var(--color-border)"
            }`,
          }}
        >
          <IconClock
            size={12}
            style={{
              color: isUrgent
                ? "var(--color-error)"
                : isLow
                ? "var(--color-warning)"
                : "var(--color-text-3)",
            } as React.CSSProperties}
          />
          <span
            className="text-xs font-mono tabular-nums"
            style={{
              color: isUrgent
                ? "var(--color-error)"
                : isLow
                ? "var(--color-warning)"
                : "var(--color-text-2)",
            }}
          >
            {formatDuration(remaining)}
          </span>
          {isLow && (
            <span className="text-xs" style={{ color: isUrgent ? "var(--color-error)" : "var(--color-warning)" }}>
              {isUrgent ? "Critical!" : "Low"}
            </span>
          )}
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">
        {isLow && (
          <a
            href="/#pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1 rounded-lg font-medium hidden sm:flex"
            style={{
              background: "var(--color-accent)",
              color: "#000",
            }}
          >
            Extend
          </a>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-text-3)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-text)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-3)")
          }
          title="Settings"
        >
          <IconSettings size={15} />
        </button>

        {showSettings && (
          <div
            className="absolute top-12 right-4 z-50 rounded-xl py-1 min-w-[140px]"
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm transition-colors"
              style={{ color: "var(--color-text-2)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface)";
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
