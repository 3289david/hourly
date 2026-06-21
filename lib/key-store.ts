import fs from "fs/promises";
import path from "path";
import type { SessionTier } from "@/lib/session";

const STORE_PATH = process.env.KEY_STORE_PATH ?? "/tmp/hourly-key-store.json";

// A session is considered "actively in use" if pinged within this window.
// After the user closes their browser, pings stop and the session becomes
// available to restore from another device after this timeout.
export const ACTIVE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export interface KeyRecord {
  sessionId: string;
  tier: SessionTier;
  expiresAt: number;
  claimedAt: number;
  lastSeen: number; // updated by /api/ping every 60s while workspace is open
}

type Store = Record<string, KeyRecord>;

let cache: Store | null = null;
let writeLock: Promise<void> = Promise.resolve();
// Debounce disk flushes for touchSession (in-memory is always current)
const lastFlush = new Map<string, number>();

async function load(): Promise<Store> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await fs.readFile(STORE_PATH, "utf-8")) as Store;
  } catch {
    cache = {};
  }
  return cache;
}

async function save(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store), "utf-8");
}

export function isActive(record: KeyRecord): boolean {
  return Date.now() - record.lastSeen < ACTIVE_TIMEOUT_MS;
}

export async function getRecord(key: string): Promise<KeyRecord | null> {
  const store = await load();
  return store[key] ?? null;
}

// Claim a brand-new key. Returns false if already in store (race-safe).
export async function claimKey(
  key: string,
  record: Omit<KeyRecord, "claimedAt" | "lastSeen">
): Promise<boolean> {
  let ok = false;
  writeLock = writeLock.then(async () => {
    const store = await load();
    if (!store[key]) {
      store[key] = { ...record, claimedAt: Date.now(), lastSeen: Date.now() };
      await save(store);
      ok = true;
    }
  });
  await writeLock;
  return ok;
}

// Atomically take over an inactive session from another device.
// Returns the stored record on success, or a reason string on failure.
export async function restoreKey(
  key: string
): Promise<KeyRecord | "expired" | "active" | "not_found"> {
  let result: KeyRecord | "expired" | "active" | "not_found" = "not_found";
  writeLock = writeLock.then(async () => {
    const store = await load();
    const rec = store[key];
    if (!rec) { result = "not_found"; return; }
    if (rec.expiresAt <= Date.now()) { result = "expired"; return; }
    if (isActive(rec)) { result = "active"; return; }
    // Take over: update lastSeen so old device can no longer restore
    store[key] = { ...rec, lastSeen: Date.now() };
    await save(store);
    result = store[key];
  });
  await writeLock;
  return result;
}

// Update heartbeat for an active session (called by /api/ping).
// In-memory update is immediate; disk flush is debounced to once per 60s.
export function touchSession(key: string): void {
  if (!cache || !cache[key]) return;
  const now = Date.now();
  cache[key] = { ...cache[key], lastSeen: now };

  const last = lastFlush.get(key) ?? 0;
  if (now - last < 60_000) return;
  lastFlush.set(key, now);

  writeLock = writeLock.then(async () => {
    const store = await load();
    if (store[key]) {
      store[key] = { ...store[key], lastSeen: Date.now() };
      await save(store);
    }
  });
}
