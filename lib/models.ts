export interface AIModel {
  id: string;
  name: string;
  description: string;
  specialty: "reasoning" | "coding" | "fast" | "debug" | "general" | "auto";
  openRouterId: string;
  badge?: string;
  contextK: number;
  inputPer1M: number;
  outputPer1M: number;
}

export const MODELS: AIModel[] = [
  {
    id: "auto",
    name: "Auto",
    description: "Smart routing — picks the best model for your task",
    specialty: "auto",
    openRouterId: "deepseek/deepseek-r1-0528",
    contextK: 163,
    inputPer1M: 0,
    outputPer1M: 0,
  },
  // ── Reasoning ──────────────────────────────────────────
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (May 2025)",
    description: "Latest DeepSeek reasoning model. Best for algorithms, math, and hard backend problems.",
    specialty: "reasoning",
    openRouterId: "deepseek/deepseek-r1-0528",
    badge: "Updated",
    contextK: 163,
    inputPer1M: 0.5,
    outputPer1M: 2.15,
  },
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash",
    description: "Google's fast reasoning model. Great for code + context. 1M token context.",
    specialty: "reasoning",
    openRouterId: "google/gemini-2.5-flash",
    badge: "1M ctx",
    contextK: 1048,
    inputPer1M: 0.3,
    outputPer1M: 2.5,
  },
  // ── Coding ─────────────────────────────────────────────
  {
    id: "qwen3-coder",
    name: "Qwen3 Coder",
    description: "Qwen's latest coding model. 1M token context. Excellent for full-stack work.",
    specialty: "coding",
    openRouterId: "qwen/qwen3-coder",
    badge: "New",
    contextK: 1048,
    inputPer1M: 0.22,
    outputPer1M: 1.8,
  },
  {
    id: "codestral",
    name: "Mistral Codestral",
    description: "Mistral's dedicated code model. Fast, accurate, and great at completions.",
    specialty: "coding",
    openRouterId: "mistralai/codestral-2508",
    badge: "2508",
    contextK: 256,
    inputPer1M: 0.3,
    outputPer1M: 0.9,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    description: "DeepSeek's best chat/code model. Reliable, cheap, and handles most tasks well.",
    specialty: "coding",
    openRouterId: "deepseek/deepseek-chat-v3-0324",
    contextK: 163,
    inputPer1M: 0.2,
    outputPer1M: 0.77,
  },
  {
    id: "kimi-k2",
    name: "Kimi K2",
    description: "Moonshot's latest model. Strong at debugging, long-context analysis, and review.",
    specialty: "debug",
    openRouterId: "moonshotai/kimi-k2",
    badge: "New",
    contextK: 131,
    inputPer1M: 0.57,
    outputPer1M: 2.3,
  },
  // ── Fast / cheap ───────────────────────────────────────
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    description: "Ultra-cheap and fast. 1M context. Best for quick edits and simple tasks.",
    specialty: "fast",
    openRouterId: "deepseek/deepseek-v4-flash",
    badge: "Cheapest",
    contextK: 1048,
    inputPer1M: 0.09,
    outputPer1M: 0.18,
  },
  {
    id: "gemini-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Google's ultra-fast, ultra-cheap model. Great for high-volume tasks.",
    specialty: "fast",
    openRouterId: "google/gemini-2.5-flash-lite",
    badge: "1M ctx",
    contextK: 1048,
    inputPer1M: 0.1,
    outputPer1M: 0.4,
  },
  {
    id: "llama4-scout",
    name: "Llama 4 Scout",
    description: "Meta's latest model. Insane 10M token context. Good for large codebase work.",
    specialty: "general",
    openRouterId: "meta-llama/llama-4-scout",
    badge: "10M ctx",
    contextK: 10000,
    inputPer1M: 0.1,
    outputPer1M: 0.3,
  },
  {
    id: "qwen3-coder-free",
    name: "Qwen3 Coder (Free)",
    description: "Same Qwen3 Coder model, free tier. Rate limited, but costs nothing.",
    specialty: "coding",
    openRouterId: "qwen/qwen3-coder:free",
    badge: "Free",
    contextK: 1048,
    inputPer1M: 0,
    outputPer1M: 0,
  },
];

const ROUTING_KEYWORDS: Record<string, string> = {
  // Coding models
  react: "qwen3-coder",
  jsx: "qwen3-coder",
  tsx: "qwen3-coder",
  vue: "qwen3-coder",
  svelte: "qwen3-coder",
  angular: "qwen3-coder",
  nextjs: "qwen3-coder",
  css: "qwen3-coder",
  tailwind: "qwen3-coder",
  component: "qwen3-coder",
  frontend: "qwen3-coder",
  ui: "qwen3-coder",
  html: "qwen3-coder",
  typescript: "qwen3-coder",
  javascript: "qwen3-coder",
  // Debugging → Kimi K2
  debug: "kimi-k2",
  error: "kimi-k2",
  bug: "kimi-k2",
  traceback: "kimi-k2",
  exception: "kimi-k2",
  "not working": "kimi-k2",
  review: "kimi-k2",
  // Reasoning → DeepSeek R1
  algorithm: "deepseek-r1",
  optimize: "deepseek-r1",
  math: "deepseek-r1",
  complexity: "deepseek-r1",
  architecture: "deepseek-r1",
  design: "deepseek-r1",
  // Backend/general → DeepSeek V3
  python: "deepseek-v3",
  backend: "deepseek-v3",
  api: "deepseek-v3",
  database: "deepseek-v3",
  sql: "deepseek-v3",
  go: "deepseek-v3",
  rust: "deepseek-v3",
  // Fast/cheap → V4 Flash for simple things
  rename: "deepseek-v4-flash",
  format: "deepseek-v4-flash",
  comment: "deepseek-v4-flash",
  translate: "deepseek-v4-flash",
};

export function routeModel(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const [keyword, modelId] of Object.entries(ROUTING_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return modelId;
    }
  }
  return "deepseek-r1";
}

export function getModelById(id: string): AIModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[1];
}
