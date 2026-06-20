"use client";

import { IconBolt, IconCpu, IconTerminal, IconBranch, IconShield, IconSparkle } from "./icons";

const FEATURES = [
  { icon: IconBolt, title: "Unlimited prompts", description: "No token counting. Send 1,000 messages in an hour — we don't care. Unlimited file edits and code generation from the moment your session starts." },
  { icon: IconCpu, title: "10 models, instant switch", description: "DeepSeek R1, Qwen3 Coder, Gemini 2.5 Flash, Kimi K2, Mistral Codestral, Llama 4 Scout and more. Switch mid-session or let Auto Routing decide." },
  { icon: IconTerminal, title: "Cloud workspace", description: "Browser-based terminal, Monaco editor, and file manager. No local setup. Your workspace persists for the full duration of your session." },
  { icon: IconBranch, title: "GitHub integration", description: "Clone any repo directly into your workspace. The AI can read your codebase, commit changes, and push branches — all within your window." },
  { icon: IconShield, title: "Bring your own key", description: "Connect your own OpenRouter key for a lower session price. Your keys are encrypted in-session and never stored after the session ends." },
  { icon: IconSparkle, title: "Smart model routing", description: "Auto mode routes your task to the best model. React components go to Qwen Coder. Complex reasoning goes to DeepSeek R1. Debugging to Kimi." },
];

export function Features() {
  return (
    <section
      id="features"
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-6xl px-6">
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            Features
          </p>
          <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, textAlign: "center" }}>
            Everything you need.{" "}
            <span style={{ color: "var(--color-text-2)" }}>Nothing you don&apos;t.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.75rem", padding: "2rem", textAlign: "center" }}
            >
              <div
                className="flex items-center justify-center"
                style={{ width: "3rem", height: "3rem", borderRadius: "0.75rem", background: "var(--color-accent-dim)", color: "var(--color-accent)", marginBottom: "1.25rem" }}
              >
                <feature.icon size={20} />
              </div>
              <h3 style={{ color: "var(--color-text)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", textAlign: "center" }}>
                {feature.title}
              </h3>
              <p style={{ color: "var(--color-text-2)", fontSize: "1rem", lineHeight: 1.7, textAlign: "center" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
