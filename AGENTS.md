# Malik Ltd Code — Agent Instructions

You are running inside **Malik Ltd Code**, the Malik Ltd AI Developer Platform code editor.

## CRITICAL: Read Malik Memory First

Before any task, read `config/malik-memory.json`. This is the **single source of truth** for all project memory — architecture decisions, coding rules, stack details, service ports, and current state. No other memory files exist.

**You MUST:**
1. Read `config/malik-memory.json` at the start of every session
2. Follow all entries tagged `rules` — these are non-negotiable
3. Respect architecture decisions tagged `architecture`
4. **Always update this file** when architecture, ports, rules, or decisions change — it must stay current

## Memory API

```
GET    /api/malik-memory          List all memory entries
GET    /api/malik-memory/:id      Get single entry
POST   /api/malik-memory          Create entry (title, content, category, tags)
PUT    /api/malik-memory/:id      Update entry
DELETE /api/malik-memory/:id      Delete entry
```

Categories: `architecture`, `stack`, `rules`, `decisions`, `bugs`, `notes`, `general`

## Core Rules

- Triple-check before every removal
- Never change working logic, UI, or DB structure
- Never kill processes by name — only by tracked PID
- `config/tools.json` is the single source of truth for service names, ports, proxy paths
- `.opencode/` stays at root (tool convention like `.git/`)
- The project uses React 18 + TypeScript + Vite + Tailwind CSS 4 (frontend), Express 5 + TypeScript (backend)

## Dual Setup — Malik Ltd vs Personal (CRITICAL)

There are **4 tools** split across **2 machines**:

### D:\Vibe Coder\ (Malik Ltd Platform)
| Tool | Port | Manager | Binary |
|------|------|---------|--------|
| **VS Code (Coder Page)** | 3501 | `VscodeManager` in `src/server/services/vscode.ts` | `tools/vscode-server/bin/code-tunnel.exe` |
| **OpenCode (AI Agents Page)** | 4100 | `OpenCodeManager` in `src/server/services/opencode.ts` | `node_modules/.opencode-windows-x64-*/bin/opencode.exe` |

**Data isolation for D: drive OpenCode** (forced via env vars in opencode.ts):
- `OPENCODE_CONFIG_DIR` → `D:\Vibe Coder\.opencode`
- `OPENCODE_DATA_DIR` → `D:\Vibe Coder\.opencode\data`
- `OPENCODE_STATE_DIR` → `D:\Vibe Coder\.opencode\sessions`
- `OPENCODE_HOME` → `D:\Vibe Coder\.opencode`
- `HOME` / `USERPROFILE` → `D:\Vibe Coder`
- `APPDATA` / `LOCALAPPDATA` → `D:\Vibe Coder\vscode\data`

### C:\Users\Malik Hanzala\ (Personal)
| Tool | Location | Notes |
|------|----------|-------|
| **VS Code (Personal)** | Standard install | Extensions at `C:\Users\Malik Hanzala\.vscode\extensions\` |
| **OpenCode (VS Code Extension)** | `sst-dev.opencode-0.0.13` | Runs `opencode --port <random>` in terminal |

**C: drive OpenCode uses XDG defaults** (never touches D: drive):
- Config → `C:\Users\Malik Hanzala\.config\opencode\`
- Data → `C:\Users\Malik Hanzala\.local\share\opencode\`
- State → `C:\Users\Malik Hanzala\.local\state\opencode\`
- Cache → `C:\Users\Malik Hanzala\.cache\opencode\`

### Why They Don't Interfere
1. **D: drive OpenCode** has env vars that FORCE all paths to D: — it literally cannot access C: drive data
2. **C: drive OpenCode** uses default XDG paths on C: — it never looks at D: drive
3. **Different binaries**: D: uses local `node_modules` binary, C: uses global npm install (`C:\Users\Malik Hanzala\AppData\Roaming\npm\opencode.cmd`)
4. **Different configs**: D: has full provider/model/agent config in `.opencode/opencode.json`, C: has minimal config in `.config/opencode/opencode.jsonc`
5. **Different databases**: D: `D:\Vibe Coder\.local\share\opencode\opencode.db`, C: `C:\Users\Malik Hanzala\.local\share\opencode\opencode.db`

## Service Lifecycle (IMPORTANT)

- **OpenCode** is Chat-tab ONLY — started/stopped from the AI Agent page
- **Start All** starts OpenCode with auth token
- **Stop All** stops OpenCode
- **Services PERSIST** across page navigation and tab switches — no auto-stop
- **Services ONLY die on:** manual Stop All button OR server shutdown (Ctrl+C)
- **Boot**: Services are detected but NOT auto-started (detect-only mode)
- **OpenCode auth**: Server generates boot-time token. Only the Chat tab can start/stop OpenCode (`x-oc-token` header or `token` body field)
- **PID verification**: Stop endpoints verify the PID matches what the server is tracking before killing
- **Adopted processes**: External processes found on boot are adopted but NEVER killed by the app
- **OpenCode iframe**: Loaded DIRECTLY via `http://localhost:4100/` — NOT through the /opencode/ proxy (proxy corrupts OpenCode's API calls).
- **Data isolation**: Our OpenCode uses root `.opencode/` — same directory where I (opencode) live

## Project Structure

```
D:\Vibe Coder\
├── server.ts              Backend entry (169 lines — pure orchestration)
├── config/                Configuration files
│   ├── tools.json         Service names, ports, proxy paths
│   ├── malik-memory.json   Persistent memory store (READ THIS)
│   ├── service-state.json Service states across restarts
│   └── auth-config.json   TOTP 2FA config
├── src/                   Frontend (feature-first)
│   ├── auth/              Login + TOTP 2FA
│   ├── layout/            Sidebar navigation
│   ├── dashboard/         Provider status, settings
│   ├── coder/             VS Code launcher (port 3501)
│   ├── ai-agent/          OpenCode (port 4100)
│   ├── notes/             Markdown notes
│   ├── malik-memory/       Memory management UI
│   ├── skills/            Skills manager UI
│   └── board/             Kanban board
├── src/server/            Backend modules (extracted from server.ts)
│   ├── context.ts         Shared state (28 exports)
│   ├── setup.ts           Vite, WS terminal, proxies, shutdown, banner
│   ├── middleware/
│   │   └── proxy.ts       createProxy, createWsProxy
│   ├── services/
│   │   ├── opencode.ts    OpenCodeManager class (166 lines)
│   │   ├── vscode.ts      VscodeManager class (144 lines)
│   │   └── ai-chat.ts     AI chat business logic (302 lines)
│   └── routes/            19 route files
│       ├── ai.ts, anthropic-proxy.ts, auth.ts, malik-memory.ts
│       ├── conversations.ts, enhance.ts, files.ts
│       ├── git.ts, mcp.ts, notes.ts
│       ├── opencode.ts, permissions.ts, providers.ts
│       ├── skills.ts, terminal.ts, vscode.ts, workspace.ts
├── src/providers/         LLM provider fallback chain (24 tiers)
├── tools/                 Service binaries
│   └── vscode-server/     code-tunnel.exe
├── services/              External services
├── workspace/             Working directory for services
│   ├── skills/            Installed skill .md files (23 skills)
│   └── opencode-app/      Legacy OpenCode data (deprecated — now at root .opencode/)
├── .opencode/             OpenCode data directory (root-level)
│   ├── opencode.json      Full OpenCode config (providers, agents, blacklist)
│   ├── agent/             Deployed agent .md files (33 agents)
│   ├── skills/            Synced skills for OpenCode
│   └── data/              Auth keys, session data
└── scripts/               Dev scripts, cleanup
```

## Key API Endpoints

```
GET    /api/opencode/status     OpenCode status (running, port, pid)
GET    /api/opencode/token      Get auth token (Chat tab only)
POST   /api/opencode/start      Start OpenCode (requires x-oc-token header)
POST   /api/opencode/stop       Stop OpenCode (requires token in header OR body)

GET    /api/vscode/status       VS Code status
```
