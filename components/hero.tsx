"use client";

import { useEffect, useState } from "react";
import { IconArrowRight, IconClock } from "./icons";

const DEMO_LINES = [
  { text: "$ hourly activate --key HRL-XXXX-XXXX-XXXX", delay: 0 },
  { text: "  Session started. 6 hours remaining.", delay: 600, color: "#00d4ff" },
  { text: "$ git clone https://github.com/you/your-app", delay: 1400 },
  { text: "  Cloning into 'your-app'...", delay: 2000, color: "#888" },
  { text: '> Fix the auth bug in /api/login', delay: 2800 },
  { text: "  Analyzing codebase...", delay: 3400, color: "#888" },
  { text: "  Found issue in middleware.ts:47", delay: 4000, color: "#00ff88" },
  { text: "  Applying fix...", delay: 4600, color: "#888" },
  { text: "  Done. 3 files modified.", delay: 5200, color: "#00ff88" },
];

export function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    DEMO_LINES.forEach((line, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), line.delay + 400);
      timers.push(t);
    });
    const reset = setTimeout(() => setVisibleLines(0), 7000);
    timers.push(reset);
    const interval = setInterval(() => {
      setVisibleLines(0);
      DEMO_LINES.forEach((line, i) => {
        const t = setTimeout(() => setVisibleLines(i + 1), line.delay + 400);
        timers.push(t);
      });
    }, 8000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 grid-bg opacity-30"
        aria-hidden
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{
                background: "var(--color-accent-dim)",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <IconClock size={12} />
              Pay only for the time you use
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ color: "var(--color-text)" }}
            >
              Hire AI
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 60%, #0090ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                by the hour.
              </span>
            </h1>

            <p
              className="text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0"
              style={{ color: "var(--color-text-2)", lineHeight: "1.7" }}
            >
              Unlimited AI coding agent — no subscription needed. Buy an hour, use it hard.
              Unlimited prompts, file edits, and code generation during your session.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a
                href="#pricing"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "var(--color-accent)", color: "#000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-hover)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Start for $0.99
                <IconArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm transition-colors"
                style={{
                  color: "var(--color-text-2)",
                  border: "1px solid var(--color-border-2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                  e.currentTarget.style.borderColor = "var(--color-text-3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-2)";
                  e.currentTarget.style.borderColor = "var(--color-border-2)";
                }}
              >
                See how it works
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: "4 models", label: "available" },
                { value: "1 hour", label: "minimum" },
                { value: "0", label: "credits/tokens" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-xl font-bold"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-3)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal demo */}
          <div
            className="flex-1 w-full max-w-lg"
            style={{
              border: "1px solid var(--color-border-2)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(0,212,255,0.08)",
            }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{
                background: "var(--color-surface-3)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              <span
                className="ml-auto text-xs"
                style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}
              >
                hourly — bash
              </span>
            </div>

            {/* Terminal content */}
            <div
              className="p-5 min-h-[280px]"
              style={{
                background: "var(--color-surface)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                lineHeight: "1.8",
              }}
            >
              {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: line.color ?? "var(--color-text)",
                    animation: "fadeInUp 0.2s ease forwards",
                  }}
                >
                  {line.text}
                </div>
              ))}
              {visibleLines < DEMO_LINES.length && (
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "16px",
                    background: "var(--color-accent)",
                    animation: "blink 1s step-end infinite",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
