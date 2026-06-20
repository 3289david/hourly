"use client";

const MODELS = [
  { name: "DeepSeek R1", sub: "May 2025", specialty: "Reasoning", badge: "Updated", badgeColor: "#00d4ff", color: "#0066ff" },
  { name: "Qwen3 Coder", sub: "2025", specialty: "Coding", badge: "New", badgeColor: "#00e87a", color: "#ff6600" },
  { name: "Gemini 2.5 Flash", sub: "Google", specialty: "Reasoning", badge: "1M ctx", badgeColor: "#4285f4", color: "#4285f4" },
  { name: "DeepSeek V4 Flash", sub: "Ultra-cheap", specialty: "Fast", badge: "Cheapest", badgeColor: "#ffb020", color: "#ffb020" },
  { name: "Llama 4 Scout", sub: "Meta", specialty: "General", badge: "10M ctx", badgeColor: "#7c3aed", color: "#7c3aed" },
  { name: "Kimi K2", sub: "Moonshot", specialty: "Debug", badge: "New", badgeColor: "#00e87a", color: "#00c853" },
  { name: "Mistral Codestral", sub: "2508", specialty: "Coding", badge: "256k ctx", badgeColor: "#ff6600", color: "#ff6600" },
  { name: "Gemini Flash Lite", sub: "Google", specialty: "Fast", badge: "Free tier", badgeColor: "#4285f4", color: "#4285f4" },
  { name: "Qwen3 Coder", sub: "Free tier", specialty: "Coding", badge: "Free", badgeColor: "#00e87a", color: "#00e87a" },
  { name: "Auto Route", sub: "Smart select", specialty: "Auto", badge: "Recommended", badgeColor: "#00d4ff", color: "#00d4ff" },
];

export function ModelGrid() {
  return (
    <section
      className="py-28"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div
            className="text-sm font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--color-accent)" }}
          >
            Models
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            10 models.{" "}
            <span style={{ color: "var(--color-text-2)" }}>All switching instantly.</span>
          </h2>
          <p className="mt-3 text-base" style={{ color: "var(--color-text-3)" }}>
            Routed via OpenRouter. Switch mid-session at any time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MODELS.map((model) => (
            <div
              key={model.name + model.sub}
              className="flex flex-col items-center text-center p-4 rounded-xl"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full mb-3 flex-shrink-0"
                style={{ background: model.color + "22", border: `1.5px solid ${model.color}55` }}
              />
              <div
                className="font-medium text-sm mb-1 leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {model.name}
              </div>
              <div
                className="mb-2.5"
                style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)", fontSize: "11px" }}
              >
                {model.sub}
              </div>
              <div
                className="px-2 py-0.5 rounded-full w-full text-center"
                style={{
                  background: model.badgeColor + "18",
                  color: model.badgeColor,
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                }}
              >
                {model.badge}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-3)" }}>
          BYOK users can connect their own OpenRouter key to access even more models.
        </p>
      </div>
    </section>
  );
}
