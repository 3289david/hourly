"use client";

import { useState } from "react";
import { IconChevronDown } from "./icons";

const FAQS = [
  {
    q: "What happens when my time runs out?",
    a: "Your session ends and access to the workspace is paused. Your files are retained for 48 hours. You can purchase another pass at any time to continue where you left off.",
  },
  {
    q: "When does the timer start?",
    a: "The timer starts the moment you activate your license key and enter the workspace — not when you purchase. Take your time reading this page.",
  },
  {
    q: "Can I use my own API keys?",
    a: "Yes. BYOK (Bring Your Own Key) lets you connect your own OpenRouter, DeepSeek, or model API keys. Your keys are encrypted in-session and never stored. BYOK sessions cost less because we're not paying for inference.",
  },
  {
    q: "Is there really no token limit?",
    a: "During your session, yes — unlimited prompts and no token counting. We absorb the inference cost as a fixed operating expense. That's why we charge for time, not usage.",
  },
  {
    q: "What models are available?",
    a: "DeepSeek R1 (reasoning), Qwen 2.5 Coder 32B (frontend/coding), Kimi (debugging/analysis), and GLM-4 (fast tasks). Auto mode selects the best one based on your prompt. More models are added regularly.",
  },
  {
    q: "Can I share a session?",
    a: "Each license key creates one session. You can use it from any browser, but concurrent multi-device access is not supported.",
  },
  {
    q: "What is the refund policy?",
    a: "If you haven't activated your license key, we'll refund within 7 days of purchase. Once a session is activated, we can't refund used time. Reach out to support if you run into a technical issue.",
  },
  {
    q: "How does GitHub integration work?",
    a: "You provide a GitHub Personal Access Token in your workspace settings. The AI agent can then clone repos, read files, create commits, and push branches on your behalf — all within your workspace.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-28"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            FAQ
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Common questions.
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                className="w-full text-left flex items-center justify-between px-5 py-4 gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className="font-medium text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {faq.q}
                </span>
                <IconChevronDown
                  size={16}
                  style={{
                    color: "var(--color-text-3)",
                    flexShrink: 0,
                    transition: "transform 0.2s ease",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                  } as React.CSSProperties}
                />
              </button>

              {open === i && (
                <div
                  className="px-5 pb-4 text-sm leading-relaxed"
                  style={{ color: "var(--color-text-2)" }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
