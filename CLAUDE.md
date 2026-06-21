# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (port 3010 via custom server.ts)

# Production deployment — ALWAYS use deploy, not build+restart separately
npm run deploy       # pm2 stop → next build → copy chunks → pm2 start (safe, no chunk mismatch)
npm run build        # next build + copy static + copy server/chunks to standalone

# If deploy script isn't available
pm2 stop hourly && npm run build && pm2 start hourly --update-env

# Rebuild sandbox Docker image (after changes to Dockerfile.sandbox)
docker build -f Dockerfile.sandbox -t hourly-sandbox:latest .

# PM2 management
pm2 status
pm2 logs hourly --lines 50
pm2 describe hourly
```

**Critical deployment rule:** Never run `npm run build` while PM2 is serving — it overwrites `.next/standalone/` in-place and causes `Cannot find module './chunks/XXX.js'` errors. Always use `npm run deploy` which stops PM2 first.

## Architecture

**Hourly** is a time-based AI coding workspace — users buy a license key (via Polar.sh) and get access for a fixed duration (1h, 6h, 24h, 7d, 30d) or a 5-minute free trial. The AI acts as a fully autonomous coding agent (like Claude Code) that writes files, runs terminal commands, and edits code directly in an isolated Docker sandbox.

### Request / Auth Flow

```
Browser → Cloudflare CDN → Nginx (port 443) → Next.js standalone (port 3010, PM2)
```

1. `middleware.ts` checks `hourly_session` cookie on every request — redirects `/` → `/workspace` if session exists, redirects `/workspace` → `/activate` if not.
2. Sessions are JWT tokens signed with `JWT_SECRET`, containing `{ sessionId, tier, expiresAt, licenseKey, byokKey? }`.
3. `middleware.ts` uses `x-forwarded-host` header (not `req.url`) to build redirect URLs — necessary because Next.js sees internal port 3010, not the public domain.

### License Key Activation

`lib/polar.ts` → `app/api/activate/route.ts`:
1. POST to Polar `/license-keys/validate` — checks status and usage count vs limit
2. GET `/benefit-grants/?customer_id=...` → find the `order_id` for this key
3. GET `/orders/{order_id}` → get `product_id` → map to tier + duration via env vars (`POLAR_PRODUCT_1H`, etc.)
4. POST `/license-keys/activate` — increments usage (marks key as used, non-fatal if fails)
5. If a valid session cookie already exists, **adds** new duration on top of remaining time (session extension, not reset)

Each key is single-use (`limit_usage: 1` in Polar). Trial sessions (`/api/trial`) bypass Polar entirely — 5 minutes, free AI models only.

### AI Agent Loop (`app/api/chat/route.ts`)

Streaming SSE endpoint. On each user message:
- Round 1: `tool_choice: "required"` — forces the model to call at least one tool
- Rounds 2–20: `tool_choice: "auto"` — model decides
- Text output is **buffered** and only emitted if the round has **no tool calls** — this prevents the AI from writing code in the chat when it also uses write_file
- Trial users are locked to `qwen/qwen3-coder:free` (no tools)
- Default model routing: keyword matching → `qwen3-coder` fallback (not deepseek-r1, which is bad at tool calling)

**12 tools:** `run_terminal`, `read_file`, `write_file`, `write_many_files`, `replace_in_file`, `append_to_file`, `list_files`, `delete_file`, `move_file`, `create_directory`, `search_in_files`, `fetch_url`

`write_file` (and `write_many_files`, `replace_in_file`, `append_to_file`) all call `lib/workspace.ts → writeFile()` which runs **prettier** on the content before saving, guaranteeing well-formatted output regardless of model behavior.

### Docker Sandbox (`lib/sandbox.ts`)

Each session gets a Docker container on first `run_terminal` call:
- Image: `hourly-sandbox:latest` (Ubuntu 24.04, uid 10000, dev tools pre-installed)
- Security: `--cap-drop ALL --security-opt no-new-privileges --memory 512m --cpus 0.5 --pids-limit 100`
- Only the session's workspace directory (`/tmp/hourly-workspaces/{sessionId}`) is mounted at `/workspace`
- No host env vars passed — only `HOME`, `USER`, `TERM`, `PATH`
- cwd tracked per-session in-memory via `::CWD::` marker in command output
- Container state is in-process memory (Map) — lost on PM2 restart; containers are recreated on next `run_terminal`

### Workspace Storage (`lib/workspace.ts`)

Files live at `WORKSPACE_ROOT/{sanitized-sessionId}/` (default `/tmp/hourly-workspaces/`). All paths are resolved and validated against the session root to prevent traversal. `writeFile` auto-formats via prettier for: `.html`, `.css`, `.scss`, `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.md`, `.yaml`, `.graphql`.

### Frontend Workspace (`app/workspace/page.tsx`)

Three-panel layout: file sidebar (left) + tabbed main panel (AI Chat / Editor / Terminal). Key wiring:
- `filesVersion` state increments whenever the AI completes a file-writing tool → triggers `FileSidebar` to re-fetch (auto-refresh without manual click)
- `ChatPanel` receives `onFilesChanged` callback; fires it on successful `write_file`, `write_many_files`, `replace_in_file`, `append_to_file`, `delete_file`, `move_file`, `create_directory` tool results
- `tier` prop propagates from session check → `ChatPanel` and `WorkspaceHeader` to lock trial users to free model

### Model Routing (`lib/models.ts`)

`routeModel(prompt)` keyword-matches → specific model. Default fallback: `qwen3-coder` (good at tool calling). Auto model's display `openRouterId` is `deepseek/deepseek-r1-0528` but actual routing goes through `routeModel()`, not that ID.

### SSE Event Protocol

`/api/chat` streams newline-delimited `data: {...}` events:
- `{type:"text", content}` — plain text (only emitted when round has no tool calls)
- `{type:"tool_call", id, name, input}` — tool being invoked
- `{type:"tool_result", id, name, output, error}` — tool finished
- `{type:"done", model}` — stream complete, model id for display
- `{type:"error", message}` — error

### Environment Variables

All required vars are in `.env` (gitignored). See `.env.example` for the full list. Key ones:
- `JWT_SECRET` — signs session tokens
- `OPENROUTER_API_KEY` — default AI key (users can BYOK via activate form)
- `POLAR_ACCESS_TOKEN`, `POLAR_ORGANIZATION_ID`, `POLAR_PRODUCT_*` — license validation
- `NEXT_PUBLIC_CHECKOUT_*` — Polar checkout URLs embedded in pricing page
- `NEXT_PUBLIC_APP_URL=https://hourly.krl.kr` — used for OG tags and HTTP-Referer

### Deployment Stack

- **PM2** (`ecosystem.config.js`): single instance, `hourly` process, port 3010, serves `.next/standalone/server.js`
- **Nginx**: reverse proxy on 443, passes `x-forwarded-host` and `x-forwarded-proto`, rate-limits `/api/activate` to 5r/m and other APIs to 30r/m
- **Cloudflare**: CDN in front of Nginx
- **Standalone build**: `next build` outputs to `.next/standalone/`. Static assets must be copied: `cp -r .next/static .next/standalone/.next/static` and server chunks: `cp -r .next/server/chunks .next/standalone/.next/server/chunks` (both done by `npm run build`).
