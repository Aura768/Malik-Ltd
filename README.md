<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Malik Ltd AI Developer Platform

A full-stack AI coding assistant with a **24-tier multi-provider fallback system** (Zenmux ×2 → Gemini → Groq ×5 → SambaNova ×3 → OpenRouter ×10 → FreeLLMAPI → OmniRoute), chat interface, file system operations, PDF/document tools, notes, AI agent management, and embedded VS Code.

**Chief Architect:** Malik Hanzala

## Project Structure

```
├── config/                  Runtime configuration
│   ├── auth-config.json     TOTP 2FA config
│   ├── metadata.json        Project metadata
│   ├── service-state.json   Persisted service states (survives restarts)
│   └── tools.json           Service names, ports, proxy paths (renamable)
├── docs/                    Project documentation
├── extension/               VS Code extension (separate from web app)
│   ├── extension.ts         Extension entry point (activate/deactivate)
│   └── webview.ts           Sidebar webview HTML generator
├── scripts/                 Utility scripts (dev-clean, vscode download)
├── services/                Third-party services
│   ├── OmniRoute/           OmniRoute AI Gateway (docker config)
│   └── free-claude-code/    FCC Python server (AI agent proxy)
├── src/                     Frontend web app (feature-first architecture)
│   ├── auth/                Login + TOTP 2FA (AuthScreen)
│   ├── layout/              Navigation sidebar (Sidebar)
│   ├── dashboard/           Provider status, settings, account
│   ├── coder/               Workspace browser + VS Code launcher
│   ├── ai-agent/            Free Claude Code control (FCCAgentPage + ChatPanel)
│   ├── notes/               Markdown notes editor
│   ├── pdf/                 PDF/DOCX/PPTX toolkit (8 files)
│   │   ├── PDFWorkshop      Tab router
│   │   ├── MergeTool        Document merger
│   │   ├── CompressTool     File compression
│   │   ├── Img2PdfTool      Image-to-PDF converter
│   │   ├── DocBuilder       Markdown document builder
│   │   ├── OCRConverter     Tesseract OCR + format conversion
│   │   ├── types.ts         Shared interfaces
│   │   └── utils.ts         Download utility
│   ├── prompts/             System prompt registry
│   ├── providers/           AI provider tier chain (24 tiers)
│   ├── utils/               Shared utilities (trusted device, folder picker)
│   ├── App.tsx              Root component, routing, error boundary
│   ├── main.tsx             Entry point
│   ├── index.css            Global styles, animations
│   └── types.ts             Shared TypeScript types
├── tools/                   External tools
│   ├── vscode-server/       VS Code binary (code-tunnel)
│   └── node-v26.1.0.zip     Portable Node.js installer
├── workspace/               Runtime data (.notes.json)
└── assets/                  Extension icons
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file with your API keys (see `.env.example` for all variables):

```bash
GEMINI_API_KEY="your-gemini-api-key"
GROQ_KEY_QWEN_CODE="gsk_..."
SAMBANOVA_DEEPSEEK_V3_1="..."
# ... see .env.example for full list
```

## Run Locally

```bash
npm run dev
```

Starts Express backend + Vite dev server on **port 359**.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:malik-ltd-coder` | Full boot: cleanup → smart service start → boot banner with URLs, APIs, status + PIDs |
| `npm run dev` | Same as above (alias) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | TypeScript type checking only |

## Architecture

```
24-TIER FALLBACK CHAIN:
  Tier 1:   Zenmux GLM 4.7 Flash (key 1, free)
  Tier 2:   Zenmux GLM 4.7 Flash (key 2, separate rate limits)
  Tier 3:   Gemini 2.5 Flash (free daily quota)
  Tiers 4-8:   Groq ×5 (5 independent keys = separate rate-limit pools)
  Tiers 9-11:  SambaNova ×3 (DeepSeek V3.1/V3.2, Llama 3.3)
  Tiers 12-21: OpenRouter ×10 (free models)
  Tier 22:  FreeLLMAPI (18 providers, ~1.7B tokens/month)
  Tier 23:  OmniRoute AI Gateway (237+ providers)
  Tier 24:  (reserved)
```

The AI presents as a single entity — **Malik Ltd** — regardless of which provider is active.

## Ports

| Port | Service | Notes |
|------|---------|-------|
| 359 | Main app (Express + Vite) | Client-facing. Proxies VS Code and FCC |
| 350 | VS Code (code-tunnel) | Internal — proxied via `/vscode/*` |
| 257 | FCC (Free Claude Code) | Internal — proxied via `/fcc/*` |
| 4100 | App-managed OpenCode | **Loaded directly via iframe** — NOT proxied. Uses `workspace/opencode-app/` data. |
| 32037 | Personal OpenCode | User-managed instance. Keeps data in `workspace/personal-opencode-app/` and stays separate from the app. |

The client talks to **port 359** for VS Code and FCC. OpenCode is loaded **directly on port 4100** in an iframe (same as FCC admin at `http://localhost:257/admin`). This avoids proxy corruption of OpenCode's API calls.

Ports are configurable in `config/tools.json`.

## Process Isolation

The app's VS Code, FCC, and OpenCode are **completely separate** from any personal tools running on the machine. Three layers of isolation:

| Layer | How it works |
|-------|-------------|
| **Port isolation** | App uses 350/257/4100. Personal tools use their own ports — never conflict |
| **PID isolation** | `trackedPids` Set records every child process the app spawns. Cleanup kills **only** these PIDs by number — never searches by process name |
| **Adopted PIDs** | External processes found on boot are added to `adoptedPids` Set — NEVER killed by the app, even on shutdown |
| **Data isolation** | Our OpenCode uses its own data directory at `workspace/opencode-app/` — never shares sessions/config with personal OpenCode |

**Services persist across navigation** — FCC and OpenCode keep running when you switch pages or tabs. They ONLY die on: manual Stop All button, or server shutdown (Ctrl+C → SIGINT handler kills tracked PIDs).

**On Ctrl+C:** Only `fccProcess`, `opencodeProcess`, and `vscodeProcess` are killed — by tracked PID. Personal tools and adopted processes are untouched.

**Stop endpoints** accept `{ pid }` in body — server verifies PID matches tracked process before killing. Frontend displays PIDs in status badges.

## Renaming Tools

Edit `config/tools.json` to rename services, change ports, or change proxy paths:

```json
{
  "vscode":  { "name": "Code Editor",  "port": 350, "proxyPath": "/vscode/" },
  "fcc":     { "name": "Claude Agent", "port": 257, "proxyPath": "/fcc/" }
}
```

All log messages, the boot banner, API endpoint descriptions, and status lines use these names. Change the JSON → restart → everything updates.

## Boot Sequence

Run `npm run dev:malik-ltd-coder` for the full experience:

```
  ╔══════════════════════════════════════════════════════╗
  ║       MALIK LTD — PRE-BOOT CLEANUP                   ║
  ╚══════════════════════════════════════════════════════╝
  [1/5] Vite cache
  [2/5] Build artifacts
  [3/5] Server logs & temp files
  [4/5] Corrupted state files
  [5/5] Stale lock files
  ── Cleared 2 item(s), freed 2.1 MB ──

  ╔══════════════════════════════════════════════════════╗
  ║          MALIK LTD AI DEVELOPER PLATFORM            ║
  ╚══════════════════════════════════════════════════════╝

  ── App ──────────────────────────────────────────────
  ➜  Local:     http://localhost:359/

  ── Services (via proxy) ──────────────────────────────
     VS Code    http://localhost:359/vscode/          (internal :350)
     FCC        http://localhost:359/fcc/              (internal :257)
     OpenCode   http://localhost:4100/                 (direct iframe)

  ── API Endpoints ────────────────────────────────────
     POST  /api/ai/chat              AI chat (24-tier fallback)
     POST  /api/ai/chat/stream       AI chat (SSE streaming)
     GET   /api/vscode/status        VS Code status
     POST  /api/vscode/start         Start VS Code
     ...

  ── Status ───────────────────────────────────────────
     VS Code    running    port :350  pid:12840
     FCC        running    port :257  pid:9512

  ── PIDs are unique per session. Only these are killed on Ctrl+C. ──
```

Services are **smart-started**: the server checks if each is already running on its port before starting it. If it survived from a previous session, it's adopted instantly.

## Cleanup & Restructuring Log (July 2026)

### Process Isolation & Security
| Change | Details |
|--------|---------|
| Removed `killProcessOnPort()` | Used `Get-NetTCPConnection` to kill ANY process on a port — dangerous. Replaced with PID-only tracking |
| Added PID tracking | `trackedPids` Set records every child process spawned. Cleanup kills only these PIDs |
| Double isolation | Port (350/257), PID (tracked set) |

### Smart Boot
| Change | Details |
|--------|---------|
| Pre-boot cleanup | `scripts/dev-maliks-clean.cjs` — clears Vite cache, build artifacts, temp files, logs |
| Port detection | Before starting each service, checks if it's already alive on its port — adopts if so |
| Boot banner | Shows app URLs, proxy paths, API endpoints, service status + PIDs |
| Service state persistence | `config/service-state.json` — tracks last known states across restarts |
| Custom tool names | `config/tools.json` — rename services, change ports, change proxy paths |

### Dead Code Removal
| Change | Details |
|--------|---------|
| Deleted dead components | `AgentWorkspace.tsx`, `MalikChat.tsx`, `FileExplorer.tsx`, `MarkdownRenderer.tsx`, `CodeBlock.tsx` |
| Deleted dead source files | `prompts/chat-system.ts`, `providers/omniroute.ts` |
| Removed unused npm packages | `@monaco-editor/react`, `highlight.js`, `remark-gfm`, `xterm`, `xterm-addon-fit`, `concurrently` |
| Deleted dead files | `scripts/test-keys.cjs`, all `server-*.log` files |
| Removed empty directories | `.malik-code-data/`, `.malik-code-extensions/`, `.malik-data/` |
| Cleaned dead code | Unused imports, unreachable blocks, debug console statements, dead sidebar tabs, dead ChatPanel props |

### Structure Reorganization
| Change | Details |
|--------|---------|
| Deleted `bota/` folder (old project copy) | 25 MB of dead duplicates. Only kept root `vscode-server/` path |
| Moved VS Code extension | `src/extension.ts` + `src/ui/webview.ts` → `extension/` folder (separate from web app) |
| Split PDFWorkshop | 1,003-line monolith → 8 focused files in `src/pdf/` (MergeTool, CompressTool, Img2PdfTool, DocBuilder, OCRConverter, types, utils) |
| Feature-first architecture | Removed `src/components/` entirely. Each feature lives directly under `src/`: `auth/`, `layout/`, `dashboard/`, `coder/`, `ai-agent/`, `notes/`, `pdf/` |
| Updated all imports | Fixed all import paths for new flat feature structure |
| Formatted all code | Prettier: 2-space indent, single quotes, trailing commas |
| Added file-header comments | JSDoc-style header on all source files |

### Verification
| Check | Result |
|-------|--------|
| TypeScript `tsc --noEmit` | Zero errors |
| Vite `vite build` | Success — 2101 modules, 14s |

## Service Lifecycle Changes (July 14, 2026)

### Direct Iframe (Anti-Corruption)
| Change | Details |
|--------|---------|
| OpenCode loaded directly | `iframe src="http://localhost:4100/"` instead of `/opencode/` proxy. The proxy rewrites HTML/JS which corrupts OpenCode's API calls. Loading directly (like FCC admin) eliminates the issue. |
| CORS flag added | OpenCode spawned with `--cors http://localhost:359` to allow cross-origin iframe requests |
| Version upgrade | opencode-ai upgraded from 1.17.18 to 1.17.19 to match personal installation |
| Isolated data directory | Our OpenCode uses `workspace/opencode-app/.opencode/` — never shares sessions with personal OpenCode at `D:\Vibe Coder\.opencode/` |

### Persistent Services
| Change | Details |
|--------|---------|
| Removed unmount cleanup | navigator.sendBeacon stop on navigate-away REMOVED — services now persist across page navigation |
| Removed tab-switch auto-stop | Switching between Chat/Admin tabs no longer stops/starts OpenCode |
| Services only die on | Manual Stop All button OR server shutdown (Ctrl+C) |
| Proxy error handling | HTML rewriting only applies to 2xx responses — error pages pass through untouched |

## License

© 2026 Malik Ltd — Chief Architect: Malik Hanzala
