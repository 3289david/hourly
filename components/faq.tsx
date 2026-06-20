"use client";

import { useState } from "react";
import { IconChevronDown } from "./icons";

const FAQS = [
  { q: "What happens when my time runs out?", a: "Your session ends and workspace access is paused. Files are retained for 48 hours. You can purchase another pass to continue where you left off." },
  { q: "When does the timer start?", a: "The timer starts the moment you activate your license key and enter the workspace — not when you purchase." },
  { q: "Can I use my own API keys?", a: "Yes. BYOK lets you connect your own OpenRouter or model-specific keys. Keys are encrypted in-session and never stored. BYOK sessions cost less because we're not paying for inference." },
  { q: "Is there really no token limit?", a: "During your session, yes — unlimited prompts, no token counting. We absorb inference cost as a fixed operating expense. That's why we charge for time, not usage." },
  { q: "What models are available?", a: "DeepSeek R1, Qwen3 Coder, Gemini 2.5 Flash, Kimi K2, Mistral Codestral, Llama 4 Scout, and more. Auto mode selects the best model for your task." },
  { q: "What is the refund policy?", a: "If you haven't activated your key, we'll refund within 7 days of purchase. Once a session is active, we can't refund used time. Contact support if you hit a technical issue." },
  { q: "How does GitHub integration work?", a: "You provide a GitHub Personal Access Token in your workspace settings. The AI can then clone repos, read files, create commits, and push branches on your behalf." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-2xl px-6">
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            FAQ
          </p>
          <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, textAlign: "center" }}>
            Common questions.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.75rem", overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem", background: "none", border: "none", cursor: "pointer", textAlign: "center" }}
              >
                <span style={{ flex: 1, color: "var(--color-text)", fontSize: "1rem", fontWeight: 500, textAlign: "center" }}>
                  {faq.q}
                </span>
                <IconChevronDown
                  size={16}
                  style={{ color: "var(--color-text-3)", flexShrink: 0, transition: "transform 0.2s ease", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" } as React.CSSProperties}
                />
              </button>
              {open === i && (
                <p style={{ color: "var(--color-text-2)", fontSize: "1rem", lineHeight: 1.7, padding: "0 1.5rem 1.25rem", textAlign: "center" }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
