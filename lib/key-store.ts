import fs from "fs/promises";
import path from "path";

const STORE_PATH = process.env.KEY_STORE_PATH ?? "/tmp/hourly-key-store.json";

// In-memory Set for fast lookups — loaded from disk on first access
let cache: Set<string> | null = null;
// Serialized write lock to prevent concurrent file corruption
let writeLock: Promise<void> = Promise.resolve();

async function loadCache(): Promise<Set<string>> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    cache = new Set(JSON.parse(raw) as string[]);
  } catch {
    cache = new Set();
  }
  return cache;
}

async function persist(keys: Set<string>): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify([...keys]), "utf-8");
}

export async function isKeyUsed(key: string): Promise<boolean> {
  const keys = await loadCache();
  return keys.has(key);
}

// Atomically claim a key. Returns false if already claimed (race-safe).
export async function claimKey(key: string): Promise<boolean> {
  let claimed = false;
  writeLock = writeLock.then(async () => {
    const keys = await loadCache();
    if (!keys.has(key)) {
      keys.add(key);
      await persist(keys);
      claimed = true;
    }
  });
  await writeLock;
  return claimed;
}
