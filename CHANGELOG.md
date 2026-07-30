# Changelog

## 1.0.44 (2026-07-29)

### Performance
- Express gzip compression (level 6, min 1KB)
- Route-level code splitting via React.lazy() — 25x smaller initial bundle (~40KB gzipped)
- Vite manualChunks for vendor/ui separation
- tsx watch --exclude to prevent infinite restart loop

### Fixed
- Proxy interceptor broke WebSocket.CONNECTING/OPEN/CLOSING/CLOSED constants
- Anthropic proxy env key names mismatched .env values
- DEV.md → DESIGN.md rename (brand consistency)

### Added
- Compression middleware for all responses
- Route-level code splitting (all 17 pages)
- Vite warmup + optimizeDeps config

## 1.0.43 (2026-07-29)

### Fixed
- Auto-shutdown with 8s debounce that survives page refresh
- Proxy `<base>` tag double-prefix — broke font loading + all UI interactions
- All zombie sweep/port-kill bandaids removed — shutdown handler is sufficient
- Proxy now uses activePort consistently (both mountProxies and setupWebSocketUpgrade)

### Changed
- Default dev mode: Vite HMR (no hard refresh needed)
- Pagehide → sendBeacon('/api/shutdown') for tab close auto-kill

## 1.0.42 (2026-07-28)

### Fixed
- OpenCode ConfigInvalidError — hex colors in agent definitions changed to semantic keys
- Proxy forwarded to wrong port (used 4100 instead of activePort)
- Zombie socket on port 4100 blocks OpenCode startup

## 1.0.41 (2026-07-22)

### Fixed
- OpenCode iframe port fallback — zombie socket broke UI
- OpenCode data isolation env vars — D: drive vs C: drive separation

### Changed
- Removed cloudflared tunnel and localtunnel entirely
- Server binds to 0.0.0.0:359 (direct LAN access)

## 1.0.40 (2026-07-20)

### Added
- Full visual overhaul — black & white monochrome design system
- 17 frontend pages redesigned with consistent color palette
- Full codebase audit — 26 fixes applied across security/bugs/perf/quality

### Fixed
- Route-level ErrorBoundary for CoderPage/MalikPage
- Vite allowedHosts restricted (was set to `true` — DNS rebinding risk)
- 2FASessions memory leak (TTL cleanup every 5 min)
- CSP tightened for Google Fonts
- Hardcoded TOTP secret with QR code display
- 2FA reset with password gate

### Security
- Auth gate rate limiting (5/min)
- Path traversal protection in /workspace/browse
- CSP improved (script-src, style-src, connect-src, frame-src split)

## 1.0.30 (2026-07-17)

### Added
- Feature sets 1-6: ECC patterns, Awesome-LLM-Apps, KittenTTS, Headroom, Prompt Master, Public APIs
- Documentation Agent (Quill) with legal compliance + technical specs
- All wired into /api/advanced, skills synced to OpenCode

## 1.0.20 (2026-07-15)

### Added
- Skills system — 23 skill .md files in workspace/skills/
- OpenCode agent discovery — 34 agent .md files
- OpenCode data isolation with env vars

### Changed
- /fcc route renamed to /bota (AI Agents page)

## 1.0.10 (2026-07-13)

### Added
- Initial project scaffolding
- React 18 + TypeScript + Vite + Tailwind CSS 4
- Express 5 + TypeScript backend
- 2FA authentication with TOTP
- VS Code + OpenCode service managers
- Sidebar navigation with 15+ routes
- Terminal activity logger (quiet mode)

## 1.0.0 (2026-07-10)

### Added
- Initial commit
- Project structure and core architecture
