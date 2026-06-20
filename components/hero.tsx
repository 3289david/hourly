"use client";

import { useEffect, useState } from "react";
import { IconArrowRight } from "./icons";

const DEMO_LINES = [
  { text: "$ hourly activate --key HRL-XXXX-XXXX-XXXX", delay: 0 },
  { text: "  Session started. 6 hours remaining.", delay: 700, color: "#00d4ff" },
  { text: "$ git clone https://github.com/you/your-app", delay: 1500 },
  { text: "  Cloning into 'your-app'...", delay: 2100, color: "#7878a0" },
  { text: "> Fix the auth bug in /api/login", delay: 2900 },
  { text: "  Analyzing codebase...", delay: 3500, color: "#7878a0" },
  { text: "  Found issue in middleware.ts:47", delay: 4200, color: "#00e87a" },
  { text: "  Applying fix...", delay: 4800, color: "#7878a0" },
  { text: "  Done. 3 files modified.", delay: 5400, color: "#00e87a" },
];

export function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    function run() {
      DEMO_LINES.forEach((line, i) => {
        const t = setTimeout(() => setVisibleLines(i + 1), line.delay + 400);
        timers.push(t);
      });
    }
    run();
    const reset = setTimeout(() => setVisibleLines(0), 7200);
    timers.push(reset);
    const interval = setInterval(() => { setVisibleLines(0); run(); }, 8000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <section
      className="relative flex flex-col items-center"
      style={{ overflow: "hidden" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.15]" aria-hidden />

      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "500px",
          background: "radial-gradient(ellipse at 50% 20%, rgba(0,212,255,0.13) 0%, rgba(0,100,255,0.05) 45%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── HEADLINE BLOCK ── */}
      <div
        className="relative w-full flex flex-col items-center"
        style={{ paddingTop: "5rem", paddingBottom: "3rem", textAlign: "center", maxWidth: "56rem", margin: "0 auto", padding: "5rem 1.5rem 3rem" }}
      >
        {/* Pill badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.375rem 1rem", borderRadius: "9999px", marginBottom: "2rem",
            background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.25)",
            color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 500,
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "var(--color-accent)", display: "inline-block", animation: "pulse-glow 2s ease-in-out infinite" }} />
          Unlimited AI — pay only for time
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800,
            lineHeight: 1.04, letterSpacing: "-0.03em",
            marginBottom: "1.5rem", textAlign: "center",
          }}
        >
          <span style={{ color: "var(--color-text)", display: "block" }}>Hire AI</span>
          <span
            style={{
              display: "block",
              background: "linear-gradient(100deg, #ffffff 10%, #a8eeff 50%, #00d4ff 85%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            by the hour.
          </span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            color: "var(--color-text-2)", fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            lineHeight: 1.7, maxWidth: "38rem", marginBottom: "2.5rem", textAlign: "center",
          }}
        >
          Unlimited AI coding agent — no subscription. Buy an hour, use it hard.
          Unlimited prompts, file edits, and code generation during your session.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <a
            href="#pricing"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.875rem 2rem", borderRadius: "0.625rem",
              background: "var(--color-accent)", color: "#000",
              fontWeight: 700, fontSize: "1rem", textDecoration: "none",
              boxShadow: "0 0 32px rgba(0,212,255,0.25)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start for $1.99 <IconArrowRight size={16} />
          </a>
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.875rem 2rem", borderRadius: "0.625rem",
              border: "1px solid var(--color-border-2)", color: "var(--color-text-2)",
              fontWeight: 500, fontSize: "1rem", textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; e.currentTarget.style.borderColor = "var(--color-text-3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-2)"; e.currentTarget.style.borderColor = "var(--color-border-2)"; }}
          >
            See how it works
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0", paddingTop: "2rem", width: "100%",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {[
            { value: "10", label: "AI models" },
            { value: "$1.99", label: "starting price" },
            { value: "∞", label: "prompts per session" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1, textAlign: "center",
                borderRight: i < 2 ? "1px solid var(--color-border)" : "none",
                padding: "0 1.5rem",
              }}
            >
              <div style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "clamp(1.25rem, 3vw, 1.875rem)", fontWeight: 700 }}>
                {stat.value}
              </div>
              <div style={{ color: "var(--color-text-3)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TERMINAL DEMO ── */}
      <div
        className="relative w-full"
        style={{ maxWidth: "44rem", margin: "0 auto", padding: "0 1.5rem 5rem" }}
      >
        <div
          style={{
            border: "1px solid var(--color-border-2)",
            borderRadius: "0.875rem",
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(0,212,255,0.04), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1rem",
              background: "var(--color-surface-3)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#ff5f57" }} />
            <span style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#ffbd2e" }} />
            <span style={{ width: "12px", height: "12px", borderRadius: "9999px", background: "#28c840" }} />
            <span style={{ flex: 1 }} />
            <span style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
              hourly — bash
            </span>
            <span style={{ flex: 1 }} />
          </div>

          {/* Terminal body */}
          <div
            style={{
              background: "var(--color-surface)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              lineHeight: 2,
              padding: "1.25rem 1.5rem",
              minHeight: "14rem",
              textAlign: "left",
            }}
          >
            {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} style={{ color: line.color ?? "var(--color-text)", animation: "fadeInUp 0.15s ease forwards" }}>
                {line.text}
              </div>
            ))}
            {visibleLines < DEMO_LINES.length && (
              <span style={{ display: "inline-block", width: "9px", height: "1.1em", background: "var(--color-accent)", animation: "blink 1s step-end infinite", verticalAlign: "middle", borderRadius: "1px" }} />
            )}
          </div>
        </div>

        {/* Glow under terminal */}
        <div
          style={{
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "1px",
            background: "radial-gradient(ellipse at 50%, rgba(0,212,255,0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
      </div>
    </section>
  );
}
