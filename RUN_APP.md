# RUN_APP.md — How to Start the Malik Ltd AI Developer Platform

## Quick Start (30 seconds)

```bash
cd "D:\Vibe Coder"
npm install
npm run dev
```

Server starts on **http://localhost:359**. Open in your browser.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ (portable: `tools/node/`) | `node --version` |
| npm | 9+ | `npm --version` |
| Git | any | `git --version` |

If Node isn't installed, run `scripts\setup.bat` to download portable Node, Git, and Python to `tools/`.

---

## First-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env from template (fill in at least one API key)
copy .env.example .env
# Edit .env — add your Gemini/Groq/SambaNova/OpenRouter keys

# 3. (Optional) Download VS Code binary for /coder page
npm run setup-vscode

# 4. Start the server
npm run dev
```

---

## Start Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Full start: pre-boot cleanup + Express + Vite on port 359 |
| `npm start` | Same as `dev` (alias) |
| `npm run dev:client` | Vite dev server only (no backend — won't work standalone) |
| `scripts\setup.bat` | Download Node.js, Git, Python to `tools/` |
| `scripts\start-server.bat` | Start server in background (logs to `server-bg.log`) |

---

## What Starts

Once `npm run dev` runs, you get:

```
  ╔══════════════════════════════════════════════════════╗
  ║          MALIK LTD AI DEVELOPER PLATFORM            ║
  ╚══════════════════════════════════════════════════════╝

  ── App ──────────────────────────────────────────────
  ➜  Local:     http://localhost:359/

  ── Services (start from the AI Agents page) ─────────
     VS Code    http://localhost:359/vscode/     (port 3501)
     OpenCode   http://localhost:4100/           (direct iframe)

  ── Status ───────────────────────────────────────────
     VS Code    stopped  (start from /coder page)
     OpenCode   stopped  (start from /bota — AI Agents page)
```

### Services Are NOT Auto-Started

The server detects if VS Code / OpenCode are already running and adopts them, but does **not** auto-start them. You start/stop them from the UI:

| Service | Start from | Port |
|---------|-----------|------|
| **VS Code** | `/coder` page → "Start VS Code" button | 3501 |
| **OpenCode** | `/bota` (AI Agents) page → "Start OpenCode" button | 4100 |

Services persist across page navigation — switching tabs doesn't kill them.

---

## Pages

| URL | Page | Description |
|-----|------|-------------|
| `/dashboard` | Dashboard | Provider status, KPIs, quick links |
| `/coder` | VS Code | Embedded VS Code editor (iframe) |
| `/bota` | AI Agents (OpenCode) | AI agent chat + admin panel |
| `/board` | Board | Kanban task board |
| `/notes` | Notes | Markdown notes |
| `/skills` | Skills | Manage AI skills (23 installed) |
| `/agents` | Agents | OpenCode agent configurations |
| `/automation` | Automation | AI company orchestration |
| `/costs` | Costs | Provider usage & cost tracking |
| `/prompts` | Prompts | System prompt library |
| `/marketplace` | Marketplace | Browse skills |
| `/voice` | Voice | Voice agent controls |
| `/sessions` | Sessions | OpenCode live sessions |
| `/pipeline` | Pipeline | Agent dependency graph |
| `/settings` | Settings | App configuration |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys. Minimum viable config:

```bash
# At least one provider key:
GEMINI_API_KEY=your-key-here

# App credentials:
VALID_USERNAME=Your Name
VALID_PASSWORD=YourPassword
VITE_VALID_USERNAME=Your Name
VITE_VALID_PASSWORD=YourPassword
```

All 25 keys across 5 providers (Zenmux, Gemini, Groq, SambaNova, OpenRouter) are listed in `.env.example`. The AI auto-falls through the 24-tier chain — more keys = more uptime.

---

## Ports

| Port | Service | Access |
|------|---------|--------|
| **359** | Main app (Express + Vite) | `http://localhost:359` |
| **3501** | VS Code (internal) | Proxied via `/vscode/` |
| **4100** | OpenCode (internal) | Direct iframe, NOT proxied |

Only port **359** needs to be open. VS Code and OpenCode are accessed through the app.

---

## Troubleshooting

### "npm run dev" fails with port error
```bash
# Something is using port 359. Kill it:
netstat -ano | findstr :359
taskkill /PID <PID> /F
```

### OpenCode won't start
- Check `opencode.exe` exists: `node_modules\opencode-windows-x64\bin\opencode.exe`
- If missing: `npm install opencode-ai`

### VS Code won't start
- Check binary exists: `tools\vscode-server\bin\code-tunnel.exe`
- If missing: `npm run setup-vscode`

### "unsafe-eval" CSP errors in browser console
- This is expected in dev mode (Vite HMR requires it)
- Production build (`npm run build`) uses compiled JS — no eval needed

### Server won't start after code change
```bash
# Force kill anything on port 359:
netstat -ano | findstr :359
taskkill /PID <PID> /F

# Then restart:
npm run dev
```

---

## Build for Production

```bash
npm run build    # TypeScript check + Vite build → dist/
npm run lint     # TypeScript check only (no build)
```

Production serves from `dist/` instead of Vite dev middleware.

---

## Project Structure (Quick Reference)

```
D:\Vibe Coder\
├── server.ts              Backend entry (Express 5)
├── index.html             Vite entry point
├── vite.config.ts         Vite + Tailwind config
├── .env                   API keys (gitignored)
├── .env.example           Template for .env
├── config/                Runtime config (7 JSON files)
├── src/                   Frontend + backend (25 modules)
│   ├── App.tsx            Root component, routing
│   ├── main.tsx           Entry point
│   ├── auth/              Login + TOTP 2FA
│   ├── ai-agent/          OpenCode chat page
│   ├── coder/             VS Code launcher
│   ├── board/             Kanban board
│   ├── server/            Backend (routes, services, utils)
│   │   ├── routes/        34 route files
│   │   ├── services/      opencode.ts, vscode.ts, ai-chat.ts
│   │   └── utils/         always-on, self-improving, doc-rag, etc.
│   └── utils/             Frontend utils (api.ts, trustedDevice.ts)
├── scripts/               Dev scripts (15 files)
├── tools/                 Binaries (vscode-server, ffmpeg, yt-dlp)
├── workspace/             Runtime data + skills
├── .opencode/             OpenCode config/agents/skills
├── vscode/                VS Code data
├── hooks/                 OpenCode hook scripts
└── services/              External services (FCC, OmniRoute)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `config/tools.json` | Service names, ports, proxy paths |
| `config/malik-memory.json` | Project memory — read first every session |
| `.opencode/opencode.json` | OpenCode full config (providers, agents, blacklist) |
| `.env` | All API keys |
| `server.ts` | Backend entry — 321 lines, pure orchestration |
| `src/App.tsx` | Frontend root — routing, auth, error boundaries |
