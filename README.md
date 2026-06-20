# Hourly

**Hire AI by the hour.**

Time-based AI coding agent. No subscriptions. No tokens. No credits. Buy time, use it hard.

---

## What is this?

Hourly is a self-hosted SaaS that sells time passes (1 hour, 6 hours, 24 hours, etc.) instead of monthly subscriptions. During an active session, users get unlimited access to an AI coding agent powered by DeepSeek R1, Qwen Coder 32B, Kimi, and GLM-4 — routed automatically based on the task.

Built for students, indie hackers, and side-project developers who don't code every day and hate paying $20/month for a tool they use twice a week.

---

## Features

- **Time-based sessions** — 1h / 6h / 24h / 7d / 30d passes, one-time payment
- **Unlimited during session** — no prompt limits, no token counting
- **Multi-model routing** — DeepSeek R1, Qwen 2.5 Coder 32B, Kimi, GLM-4, or Auto
- **Cloud workspace** — Monaco editor, bash terminal, file manager
- **GitHub integration** — clone repos directly into your workspace
- **BYOK** — bring your own OpenRouter key for reduced session prices
- **Session timer** — live countdown in the workspace header
- **Polar.sh payments** — license key delivered instantly by email

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | JWT (jose) via httpOnly cookies |
| Payments | Polar.sh (license keys) |
| AI | OpenRouter (unified API for all models) |
| File ops | Node.js fs / simple-git |
| Deployment | Docker + Nginx |

---

## Project Structure

```
hourly/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── activate/page.tsx         # License key activation
│   ├── workspace/page.tsx        # Main workspace
│   └── api/
│       ├── activate/             # License validation + session creation
│       ├── chat/                 # Streaming AI (SSE)
│       ├── files/                # Workspace file CRUD
│       ├── github/clone/         # GitHub repo cloning
│       ├── session/              # Session status + logout
│       ├── terminal/             # Shell command execution
│       └── webhooks/polar/       # Polar.sh webhook handler
├── components/
│   ├── hero.tsx                  # Animated terminal demo
│   ├── pricing.tsx               # 5-tier pricing cards
│   ├── faq.tsx                   # Accordion FAQ
│   ├── model-grid.tsx            # Supported models showcase
│   └── workspace/
│       ├── chat.tsx              # Streaming AI chat panel
│       ├── editor.tsx            # Monaco code editor
│       ├── terminal-panel.tsx    # Interactive terminal
│       ├── file-sidebar.tsx      # File tree + GitHub clone
│       └── header.tsx            # Session timer + model selector
├── lib/
│   ├── polar.ts                  # Polar.sh API client
│   ├── session.ts                # JWT session management
│   ├── models.ts                 # Model definitions + smart routing
│   └── workspace.ts              # File system operations
├── middleware.ts                 # Route protection
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

## Setup

### Prerequisites

- Node.js 20+
- A [Polar.sh](https://polar.sh) account with products created
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone and install

```bash
git clone https://github.com/3289david/hourly.git
cd hourly
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Polar.sh — get these from your Polar dashboard
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_ORGANIZATION_ID=your_org_id

# Product IDs for each tier (create these in Polar as one-time products)
POLAR_PRODUCT_1H=prod_...
POLAR_PRODUCT_6H=prod_...
POLAR_PRODUCT_24H=prod_...
POLAR_PRODUCT_7D=prod_...
POLAR_PRODUCT_30D=prod_...

# Checkout URLs (from Polar product pages)
NEXT_PUBLIC_CHECKOUT_1H=https://buy.polar.sh/...
NEXT_PUBLIC_CHECKOUT_6H=https://buy.polar.sh/...
NEXT_PUBLIC_CHECKOUT_24H=https://buy.polar.sh/...
NEXT_PUBLIC_CHECKOUT_7D=https://buy.polar.sh/...
NEXT_PUBLIC_CHECKOUT_30D=https://buy.polar.sh/...

# JWT secret — generate with: openssl rand -base64 32
JWT_SECRET=your_secret_here

# OpenRouter API key — https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-...

# Your domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Workspace storage
WORKSPACE_ROOT=/tmp/hourly-workspaces
```

### 3. Run in development

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## Polar.sh Setup

### Create products

In your Polar dashboard, create five one-time payment products:

| Product | Price | License key enabled |
|---|---|---|
| Starter — 1 Hour | $1.99 | Yes |
| Builder — 6 Hours | $3.99 | Yes |
| Day Pass — 24 Hours | $9.99 | Yes |
| Power Week — 7 Days | $22.99 | Yes |
| Monthly — 30 Days | $44.99 | Yes |

Make sure **License Keys** are enabled on each product. Polar will email the key to the buyer automatically.

### Copy product IDs

Grab the product IDs from each product's URL or API and paste them into your `.env`.

### Configure webhook (optional)

For production, add a webhook in your Polar dashboard pointing to `https://yourdomain.com/api/webhooks/polar`. Set `POLAR_WEBHOOK_SECRET` in your env to verify signatures.

---

## Deployment

### Docker Compose (recommended)

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f hourly
```

The stack runs:
- **hourly** — Next.js on port 3000 (internal)
- **nginx** — SSL termination, proxy, rate limiting on ports 80/443

### SSL with Let's Encrypt

```bash
# Install certbot on your VPS
apt install certbot

# Get a certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certs are at /etc/letsencrypt/live/yourdomain.com/
# nginx.conf is already configured to read from there
```

Update `nginx.conf` with your actual domain name, then restart:

```bash
docker compose restart nginx
```

### Manual (no Docker)

```bash
npm run build
NODE_ENV=production npm start
```

---

## How sessions work

1. User purchases a time pass on Polar.sh
2. Polar emails a license key (e.g. `HRL-XXXX-XXXX-XXXX`)
3. User visits `/activate`, enters their key
4. Server validates with Polar API, creates a signed JWT session cookie
5. Cookie contains: `tier`, `expiresAt`, `sessionId`, optional BYOK key
6. Workspace is gated by middleware — expired or missing cookie redirects to `/activate`
7. Session timer counts down in the workspace header
8. At expiry, user is redirected back to `/activate`

Workspace files are stored at `WORKSPACE_ROOT/{sessionId}/` and retained for 48 hours after session end.

---

## AI Models

| ID | Model | Best for | Price (input/1M) |
|---|---|---|---|
| `deepseek-r1` | DeepSeek R1 (May 2025) | Reasoning, algorithms, math | $0.50 |
| `gemini-flash` | Gemini 2.5 Flash | Reasoning, 1M context | $0.30 |
| `qwen3-coder` | Qwen3 Coder | Frontend, React, TypeScript, 1M ctx | $0.22 |
| `codestral` | Mistral Codestral 2508 | Code completion, backend | $0.30 |
| `deepseek-v3` | DeepSeek V3 (Mar 2025) | General coding, APIs | $0.20 |
| `kimi-k2` | Kimi K2 | Debugging, code review, analysis | $0.57 |
| `deepseek-v4-flash` | DeepSeek V4 Flash | Fast tasks, 1M ctx | $0.09 |
| `gemini-flash-lite` | Gemini 2.5 Flash Lite | Fast tasks, 1M ctx | $0.10 |
| `llama4-scout` | Llama 4 Scout | General, 10M context | $0.10 |
| `qwen3-coder-free` | Qwen3 Coder (Free) | Coding, free tier, rate-limited | $0.00 |
| `auto` | Auto | Smart routes based on prompt keywords | — |

Auto routing detects keywords in the user's message and routes to the best model — e.g. `react` → Qwen3 Coder, `debug` → Kimi K2, `algorithm` → DeepSeek R1, quick tasks → DeepSeek V4 Flash.

All models are accessed via [OpenRouter](https://openrouter.ai), which provides a unified API.

---

## BYOK (Bring Your Own Key)

Users can enter their own OpenRouter API key during activation. The key is stored in the session JWT (encrypted in-transit, httpOnly cookie) and used for all AI requests during the session. It is never written to disk and is destroyed when the session expires.

This allows you to offer a lower-priced session tier for users who supply their own inference costs.

---

## Security

- Session JWTs are signed with `HS256` and stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies
- Workspace file operations validate paths against the session's workspace root to prevent path traversal
- Terminal commands run in an isolated workspace directory with a restricted `PATH`
- A blocklist of dangerous commands is checked before execution
- Polar webhook signatures are verified with HMAC-SHA256
- Nginx enforces rate limits: 5 req/min on `/api/activate`, 30 req/min on other API routes

---

## License

MIT — see [LICENSE](LICENSE).
