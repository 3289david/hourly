"use client";

import { useState } from "react";
import { IconChevronDown } from "./icons";

const FAQS = [
  {
    q: "What happens when my time runs out?",
    a: "Your session ends and workspace access is paused. Files are retained for 48 hours. You can purchase another pass to continue where you left off.",
  },
  {
    q: "When does the timer start?",
    a: "The timer starts the moment you activate your license key and enter the workspace — not when you purchase.",
  },
  {
    q: "Can I use my own API keys?",
    a: "Yes. BYOK lets you connect your own OpenRouter or model-specific keys. Keys are encrypted in-session and never stored. BYOK sessions cost less because we're not paying for inference.",
  },
  {
    q: "Is there really no token limit?",
    a: "During your session, yes — unlimited prompts, no token counting. We absorb inference cost as a fixed operating expense. That's why we charge for time, not usage.",
  },
  {
    q: "What models are available?",
    a: "DeepSeek R1, Qwen3 Coder, Gemini 2.5 Flash, Kimi K2, Mistral Codestral, Llama 4 Scout, and more. Auto mode selects the best model for your task.",
  },
  {
    q: "What is the refund policy?",
    a: "If you haven't activated your key, we'll refund within 7 days of purchase. Once a session is active, we can't refund used time. Contact support if you hit a technical issue.",
  },
  {
    q: "How does GitHub integration work?",
    a: "You provide a GitHub Personal Access Token in your workspace settings. The AI can then clone repos, read files, create commits, and push branches on your behalf.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            FAQ
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Common questions.
          </h2>
        </div>

        <div className="flex flex-col gap-1.5">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                className="w-full text-left flex items-center justify-between px-4 py-3 gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {faq.q}
                </span>
                <IconChevronDown
                  size={14}
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
                  className="px-4 pb-3 text-xs leading-relaxed"
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
