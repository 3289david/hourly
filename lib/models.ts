export interface AIModel {
  id: string;
  name: string;
  description: string;
  specialty: "reasoning" | "frontend" | "debug" | "fast" | "auto";
  openRouterId: string;
}

export const MODELS: AIModel[] = [
  {
    id: "auto",
    name: "Auto",
    description: "Smart routing — picks the best model for your task",
    specialty: "auto",
    openRouterId: "deepseek/deepseek-r1",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    description: "Best for complex reasoning, algorithms, and Python",
    specialty: "reasoning",
    openRouterId: "deepseek/deepseek-r1",
  },
  {
    id: "qwen-coder",
    name: "Qwen 2.5 Coder",
    description: "Best for frontend, React, and TypeScript",
    specialty: "frontend",
    openRouterId: "qwen/qwen-2.5-coder-32b-instruct",
  },
  {
    id: "kimi",
    name: "Kimi",
    description: "Best for debugging, code review, and analysis",
    specialty: "debug",
    openRouterId: "moonshotai/moonshot-v1-8k",
  },
  {
    id: "glm4",
    name: "GLM-4",
    description: "Fast and efficient for quick tasks",
    specialty: "fast",
    openRouterId: "thudm/glm-4-9b",
  },
];

const ROUTING_KEYWORDS: Record<string, string> = {
  react: "qwen-coder",
  jsx: "qwen-coder",
  tsx: "qwen-coder",
  vue: "qwen-coder",
  svelte: "qwen-coder",
  css: "qwen-coder",
  tailwind: "qwen-coder",
  component: "qwen-coder",
  frontend: "qwen-coder",
  ui: "qwen-coder",
  html: "qwen-coder",
  debug: "kimi",
  error: "kimi",
  bug: "kimi",
  fix: "kimi",
  review: "kimi",
  refactor: "kimi",
  analyze: "kimi",
  why: "kimi",
  explain: "kimi",
  reason: "deepseek-r1",
  algorithm: "deepseek-r1",
  optimize: "deepseek-r1",
  math: "deepseek-r1",
  python: "deepseek-r1",
  backend: "deepseek-r1",
  api: "deepseek-r1",
  database: "deepseek-r1",
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
