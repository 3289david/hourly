"use client";

import {
  IconBolt,
  IconCpu,
  IconTerminal,
  IconBranch,
  IconShield,
  IconSparkle,
} from "./icons";

const FEATURES = [
  {
    icon: IconBolt,
    title: "Unlimited prompts",
    description:
      "No token counting. Send 1,000 messages in an hour — we don't care. Unlimited file edits and code generation from the moment your session starts.",
  },
  {
    icon: IconCpu,
    title: "10 models, instant switch",
    description:
      "DeepSeek R1, Qwen3 Coder, Gemini 2.5 Flash, Kimi K2, Mistral Codestral, Llama 4 Scout and more. Switch mid-session or let Auto Routing decide.",
  },
  {
    icon: IconTerminal,
    title: "Cloud workspace",
    description:
      "Browser-based terminal, Monaco editor, and file manager. No local setup. Your workspace persists for the full duration of your session.",
  },
  {
    icon: IconBranch,
    title: "GitHub integration",
    description:
      "Clone any repo directly into your workspace. The AI can read your codebase, commit changes, and push branches — all within your window.",
  },
  {
    icon: IconShield,
    title: "Bring your own key",
    description:
      "Connect your own OpenRouter key for a lower session price. Your keys are encrypted in-session and never stored after the session ends.",
  },
  {
    icon: IconSparkle,
    title: "Smart model routing",
    description:
      "Auto mode routes your task to the best model. React components go to Qwen Coder. Complex reasoning goes to DeepSeek R1. Debugging to Kimi.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-28"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div
            className="text-sm font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--color-accent)" }}
          >
            Features
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Everything you need.{" "}
            <span style={{ color: "var(--color-text-2)" }}>Nothing you don&apos;t.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-8 rounded-xl"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "var(--color-accent-dim)",
                  color: "var(--color-accent)",
                }}
              >
                <feature.icon size={20} />
              </div>

              <h3
                className="font-semibold text-lg mb-3"
                style={{ color: "var(--color-text)" }}
              >
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "var(--color-text-2)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
