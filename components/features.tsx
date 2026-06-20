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
    title: "Unlimited Agent During Session",
    description:
      "No prompt limits. No token counting. Send 1,000 messages in an hour — we don't care. Unlimited file modifications and code generation from the moment your session starts.",
  },
  {
    icon: IconCpu,
    title: "Multi-Model Selection",
    description:
      "10 models including DeepSeek R1 (May 2025), Qwen3 Coder, Gemini 2.5 Flash, Kimi K2, Mistral Codestral, Llama 4 Scout, and more. Switch mid-session or let Auto Routing pick based on your task.",
  },
  {
    icon: IconTerminal,
    title: "Cloud Workspace",
    description:
      "Full browser-based terminal, Monaco code editor, and file manager. No local setup required. Your workspace persists for the duration of your session.",
  },
  {
    icon: IconBranch,
    title: "GitHub Integration",
    description:
      "Clone any repo directly into your workspace. The AI agent can read your codebase, commit changes, and push branches — all within your time window.",
  },
  {
    icon: IconShield,
    title: "BYOK Support",
    description:
      "Bring Your Own Key — connect your own OpenRouter or model API keys for a reduced session price. Your keys stay encrypted and are never stored after your session ends.",
  },
  {
    icon: IconSparkle,
    title: "Smart Model Routing",
    description:
      "Auto mode analyzes your task and routes to the best model. React components go to Qwen Coder. Complex reasoning goes to DeepSeek R1. Debugging goes to Kimi.",
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
        <div className="text-center mb-16">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Features
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Everything you need.
            <br />
            <span style={{ color: "var(--color-text-2)" }}>Nothing you don&apos;t.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl transition-all duration-200 group"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-border-2)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "var(--color-border)";
                (e.currentTarget as HTMLDivElement).style.background =
                  "var(--color-surface)";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "var(--color-accent-dim)",
                  border: "1px solid var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                <feature.icon size={18} />
              </div>

              <h3
                className="font-semibold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-2)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
