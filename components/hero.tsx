"use client";

import { useEffect, useState } from "react";
import { IconArrowRight, IconClock } from "./icons";

const DEMO_LINES = [
  { text: "$ hourly activate --key HRL-XXXX-XXXX-XXXX", delay: 0 },
  { text: "  Session started. 6 hours remaining.", delay: 600, color: "#00d4ff" },
  { text: "$ git clone https://github.com/you/your-app", delay: 1400 },
  { text: "  Cloning into 'your-app'...", delay: 2000, color: "#7878a0" },
  { text: "> Fix the auth bug in /api/login", delay: 2800 },
  { text: "  Analyzing codebase...", delay: 3400, color: "#7878a0" },
  { text: "  Found issue in middleware.ts:47", delay: 4000, color: "#00e87a" },
  { text: "  Applying fix...", delay: 4600, color: "#7878a0" },
  { text: "  Done. 3 files modified.", delay: 5200, color: "#00e87a" },
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
    <section className="relative flex flex-col items-center pt-16 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[320px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-3xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8"
          style={{
            background: "var(--color-accent-dim)",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <IconClock size={11} />
          Pay only for the time you use
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.08]"
          style={{ color: "var(--color-text)" }}
        >
          Hire AI
          <br />
          <span
            style={{
              background: "linear-gradient(120deg, #fff 30%, #a0eeff 60%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            by the hour.
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-base md:text-lg mb-8 max-w-xl"
          style={{ color: "var(--color-text-2)", lineHeight: "1.7" }}
        >
          Unlimited AI coding agent — no subscription. Buy an hour, use it hard.
          Unlimited prompts, file edits, and code generation during your session.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <a
            href="#pricing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
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
            Start for $1.99
            <IconArrowRight size={14} />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors"
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
        <div
          className="flex items-center gap-10 pt-8 w-full justify-center"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {[
            { value: "4 models", label: "available" },
            { value: "1 hour", label: "minimum" },
            { value: "0", label: "tokens / credits" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-lg font-bold"
                style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-text-3)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal demo — centered below headline */}
      <div className="relative w-full max-w-2xl mx-auto px-6 pb-20">
        <div
          style={{
            border: "1px solid var(--color-border-2)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: "var(--color-surface-3)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
            <span
              className="ml-auto text-xs"
              style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}
            >
              hourly — bash
            </span>
          </div>

          {/* Content */}
          <div
            className="p-5 min-h-[200px]"
            style={{
              background: "var(--color-surface)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              lineHeight: "1.9",
            }}
          >
            {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.color ?? "var(--color-text)",
                  animation: "fadeInUp 0.15s ease forwards",
                }}
              >
                {line.text}
              </div>
            ))}
            {visibleLines < DEMO_LINES.length && (
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "14px",
                  background: "var(--color-accent)",
                  animation: "blink 1s step-end infinite",
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
