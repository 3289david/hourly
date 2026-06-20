"use client";

const MODELS = [
  { name: "DeepSeek R1", sub: "May 2025", badge: "Updated", badgeColor: "#00d4ff", color: "#0066ff" },
  { name: "Qwen3 Coder", sub: "2025", badge: "New", badgeColor: "#00e87a", color: "#ff6600" },
  { name: "Gemini 2.5 Flash", sub: "Google", badge: "1M ctx", badgeColor: "#4285f4", color: "#4285f4" },
  { name: "DeepSeek V4 Flash", sub: "Ultra-cheap", badge: "Cheapest", badgeColor: "#ffb020", color: "#ffb020" },
  { name: "Llama 4 Scout", sub: "Meta", badge: "10M ctx", badgeColor: "#7c3aed", color: "#7c3aed" },
  { name: "Kimi K2", sub: "Moonshot", badge: "New", badgeColor: "#00e87a", color: "#00c853" },
  { name: "Mistral Codestral", sub: "2508", badge: "256k ctx", badgeColor: "#ff6600", color: "#ff6600" },
  { name: "Gemini Flash Lite", sub: "Google", badge: "Free tier", badgeColor: "#4285f4", color: "#4285f4" },
  { name: "Qwen3 Coder Free", sub: "Free tier", badge: "Free", badgeColor: "#00e87a", color: "#00e87a" },
  { name: "Auto Route", sub: "Smart select", badge: "Recommended", badgeColor: "#00d4ff", color: "#00d4ff" },
];

export function ModelGrid() {
  return (
    <section
      className="flex flex-col items-center"
      style={{ borderTop: "1px solid var(--color-border)", paddingTop: "7rem", paddingBottom: "7rem", textAlign: "center" }}
    >
      <div className="w-full max-w-6xl px-6">
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", textAlign: "center" }}>
            Models
          </p>
          <h2 style={{ color: "var(--color-text)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, textAlign: "center" }}>
            10 models.{" "}
            <span style={{ color: "var(--color-text-2)" }}>All switching instantly.</span>
          </h2>
          <p style={{ color: "var(--color-text-3)", fontSize: "1rem", marginTop: "0.75rem", textAlign: "center" }}>
            Routed via OpenRouter. Switch mid-session at any time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MODELS.map((model) => (
            <div
              key={model.name + model.sub}
              className="flex flex-col items-center"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.75rem", padding: "1rem", textAlign: "center" }}
            >
              <div style={{ width: "2rem", height: "2rem", borderRadius: "9999px", marginBottom: "0.75rem", background: model.color + "22", border: `1.5px solid ${model.color}55` }} />
              <p style={{ color: "var(--color-text)", fontWeight: 500, fontSize: "0.875rem", marginBottom: "0.25rem", textAlign: "center" }}>
                {model.name}
              </p>
              <p style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)", fontSize: "11px", marginBottom: "0.625rem", textAlign: "center" }}>
                {model.sub}
              </p>
              <div style={{ background: model.badgeColor + "18", color: model.badgeColor, fontFamily: "var(--font-mono)", fontSize: "11px", borderRadius: "9999px", padding: "0.125rem 0.5rem", width: "100%", textAlign: "center" }}>
                {model.badge}
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--color-text-3)", fontSize: "0.875rem", marginTop: "1.5rem", textAlign: "center" }}>
          BYOK users can connect their own OpenRouter key to access even more models.
        </p>
      </div>
    </section>
  );
}
