"use client";

const SHOWCASE = [
  {
    name: "DeepSeek R1",
    sub: "May 2025",
    specialty: "Reasoning",
    badge: "Updated",
    badgeColor: "#00d4ff",
    price: "$0.50/1M",
    ctx: "163k ctx",
    color: "#0066ff",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#0066ff" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#0066ff" strokeWidth="1.5" />
        <path d="M12 20h16M20 12v16" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="4" fill="#0066ff" />
      </svg>
    ),
  },
  {
    name: "Qwen3 Coder",
    sub: "2025",
    specialty: "Coding",
    badge: "New",
    badgeColor: "#00ff88",
    price: "$0.22/1M",
    ctx: "1M ctx",
    color: "#ff6600",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#ff6600" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#ff6600" strokeWidth="1.5" />
        <polyline points="14,16 10,20 14,24" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="26,16 30,20 26,24" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="13" x2="22" y2="27" stroke="#ff6600" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Gemini 2.5 Flash",
    sub: "Google",
    specialty: "Reasoning",
    badge: "1M ctx",
    badgeColor: "#4285f4",
    price: "$0.30/1M",
    ctx: "1M ctx",
    color: "#4285f4",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#4285f4" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#4285f4" strokeWidth="1.5" />
        <path d="M20 10 L27 25 L20 22 L13 25 Z" fill="#4285f4" opacity="0.4" stroke="#4285f4" strokeWidth="1" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3" fill="#4285f4" />
      </svg>
    ),
  },
  {
    name: "DeepSeek V4 Flash",
    sub: "Ultra-cheap",
    specialty: "Fast",
    badge: "Cheapest",
    badgeColor: "#ffaa00",
    price: "$0.09/1M",
    ctx: "1M ctx",
    color: "#0066ff",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#ffaa00" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#ffaa00" strokeWidth="1.5" />
        <polygon points="20,10 28,25 12,25" fill="#ffaa00" opacity="0.3" stroke="#ffaa00" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="20" y1="14" x2="20" y2="22" stroke="#ffaa00" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Llama 4 Scout",
    sub: "Meta",
    specialty: "General",
    badge: "10M ctx",
    badgeColor: "#7c3aed",
    price: "$0.10/1M",
    ctx: "10M ctx",
    color: "#7c3aed",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#7c3aed" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#7c3aed" strokeWidth="1.5" />
        <path d="M12 28 C12 20 16 12 20 12 C24 12 28 20 28 28" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="12" r="2.5" fill="#7c3aed" />
      </svg>
    ),
  },
  {
    name: "Kimi K2",
    sub: "Moonshot",
    specialty: "Debug",
    badge: "New",
    badgeColor: "#00ff88",
    price: "$0.57/1M",
    ctx: "131k ctx",
    color: "#00c853",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#00c853" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#00c853" strokeWidth="1.5" />
        <circle cx="15" cy="17" r="2.5" fill="#00c853" />
        <circle cx="25" cy="17" r="2.5" fill="#00c853" />
        <path d="M13 25c2-3 12-3 14 0" stroke="#00c853" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Mistral Codestral",
    sub: "2508",
    specialty: "Coding",
    badge: "2508",
    badgeColor: "#ff6600",
    price: "$0.30/1M",
    ctx: "256k ctx",
    color: "#ff6600",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#ff6600" opacity="0.12" />
        <circle cx="20" cy="20" r="18" stroke="#ff6600" strokeWidth="1.5" />
        <rect x="13" y="13" width="14" height="14" rx="2" stroke="#ff6600" strokeWidth="1.5" />
        <path d="M16 20h8M20 16v8" stroke="#ff6600" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Gemini Flash Lite",
    sub: "Google",
    specialty: "Fast",
    badge: "Free tier",
    badgeColor: "#4285f4",
    price: "$0.10/1M",
    ctx: "1M ctx",
    color: "#4285f4",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#4285f4" opacity="0.12" />
        <circle cx="20" cy="20" r="18" stroke="#4285f4" strokeWidth="1.5" />
        <path d="M14 20l4 4 8-8" stroke="#4285f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Qwen3 Coder",
    sub: "Free tier",
    specialty: "Coding",
    badge: "Free",
    badgeColor: "#00ff88",
    price: "$0/1M",
    ctx: "1M ctx",
    color: "#00ff88",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#00ff88" opacity="0.1" />
        <circle cx="20" cy="20" r="18" stroke="#00ff88" strokeWidth="1.5" />
        <path d="M20 12v16M12 20h16" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="4" stroke="#00ff88" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Auto Route",
    sub: "Smart select",
    specialty: "Auto",
    badge: "Recommended",
    badgeColor: "#00d4ff",
    price: "Best fit",
    ctx: "Varies",
    color: "#00d4ff",
    svg: (
      <svg width="26" height="26" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="#00d4ff" opacity="0.15" />
        <circle cx="20" cy="20" r="18" stroke="#00d4ff" strokeWidth="1.5" />
        <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 20l-3-3-3 3" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="23" r="3" stroke="#00d4ff" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const SPECIALTY_COLORS: Record<string, string> = {
  Reasoning: "#0066ff",
  Coding: "#ff6600",
  Debug: "#00c853",
  Fast: "#ffaa00",
  General: "#7c3aed",
  Auto: "#00d4ff",
};

export function ModelGrid() {
  return (
    <section
      className="py-24"
      style={{ borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Models
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            10 models. All switching instantly.
            <br />
            <span style={{ color: "var(--color-text-2)" }}>Or let Auto pick for you.</span>
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--color-text-3)" }}
          >
            All routed via OpenRouter. Switch mid-session at any time.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SHOWCASE.map((model) => (
            <div
              key={model.name + model.sub}
              className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  model.color + "60";
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
              <div className="mb-2">{model.svg}</div>
              <div
                className="font-semibold text-xs mb-0.5 leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {model.name}
              </div>
              <div
                className="text-xs mb-2"
                style={{ color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}
              >
                {model.sub}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <div
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: model.badgeColor + "20",
                    color: model.badgeColor,
                    border: `1px solid ${model.badgeColor}40`,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {model.badge}
                </div>
                <div className="flex gap-1">
                  <div
                    className="flex-1 text-xs px-1 py-0.5 rounded"
                    style={{
                      background: "var(--color-surface-3)",
                      color: "var(--color-text-3)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                    }}
                  >
                    {model.price}
                  </div>
                  <div
                    className="flex-1 text-xs px-1 py-0.5 rounded"
                    style={{
                      background: "var(--color-surface-3)",
                      color: "var(--color-text-3)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                    }}
                  >
                    {model.ctx}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--color-text-3)" }}
        >
          BYOK users can also bring their own OpenRouter key to access even more models.
        </p>
      </div>
    </section>
  );
}
