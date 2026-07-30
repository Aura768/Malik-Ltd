/**
 * server.ts — Main backend entry point for the Malik Ltd AI Developer Platform.
 * Express 5 server with WebSocket support, Vite dev server integration, and
 * comprehensive API routes. Manages: AI chat with provider fallback,
 * OpenCode server lifecycle, VS Code code-tunnel management,
 * file system operations, notes persistence, system prompt selection, and
 * real-time WebSocket communication. Runs on port 359.
 */

import express from 'express';
import compression from 'compression';
import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { exec, execSync } from 'child_process';
import dotenv from 'dotenv';

// ── Service Managers ──
import { OpenCodeManager } from './src/server/services/opencode.ts';
import { VscodeManager } from './src/server/services/vscode.ts';

// ── Route Modules ──
import authRoutes from './src/server/routes/auth.ts';
import aiRoutes from './src/server/routes/ai.ts';
import permissionRoutes from './src/server/routes/permissions.ts';
import fileRoutes from './src/server/routes/files.ts';
import providerRoutes from './src/server/routes/providers.ts';
import notesRoutes from './src/server/routes/notes.ts';
import malikMemoryRoutes from './src/server/routes/malik-memory.ts';
import skillsRoutes from './src/server/routes/skills.ts';
import mcpRoutes from './src/server/routes/mcp.ts';
import enhanceRoutes from './src/server/routes/enhance.ts';
import terminalRoutes from './src/server/routes/terminal.ts';
import gitRoutes from './src/server/routes/git.ts';
import conversationRoutes from './src/server/routes/conversations.ts';
import anthropicProxyRoutes from './src/server/routes/anthropic-proxy.ts';
import opencodeRoutes from './src/server/routes/opencode.ts';
import type { OpencodeState } from './src/server/routes/opencode.ts';
import vscodeRoutes from './src/server/routes/vscode.ts';
import type { VscodeState } from './src/server/routes/vscode.ts';
import workspaceRoutes from './src/server/routes/workspace.ts';
import type { WorkspaceState } from './src/server/routes/workspace.ts';
import automationRoutes from './src/server/routes/automation.ts';
import webSearchRoutes from './src/server/routes/web-search.ts';
import shutdownRoutes, { cancelPendingShutdown } from './src/server/routes/shutdown.ts';
import promptMasterRoutes from './src/server/routes/prompt-master.ts';
import memoryBlockRoutes from './src/server/utils/memory-block.ts';
import hooksRoutes from './src/server/routes/hooks-route.ts';
import instinctsRoutes from './src/server/routes/instincts-route.ts';
import advancedFeaturesRoutes from './src/server/routes/advanced-features.ts';
import activityRoutes, { requestLoggerMiddleware } from './src/server/routes/request-logger.ts';
import dashboardRoutes from './src/server/routes/dashboard.ts';
import costTrackerRoutes from './src/server/routes/cost-tracker.ts';
import promptsLibraryRoutes from './src/server/routes/prompts-library-route.ts';
import skillsMarketplaceRoutes from './src/server/routes/skills-marketplace.ts';
import sessionViewerRoutes from './src/server/routes/session-viewer.ts';
import voiceUiRoutes from './src/server/routes/voice-ui.ts';
import publicApisRoutes from './src/server/routes/public-apis-route.ts';
import boardRoutes from './src/server/routes/board.ts';

// ── Shared State & Utilities ──
import {
  loadToolsConfig, saveServiceState,
} from './src/server/context.ts';

// ── Setup Helpers ──
import {
  printBootBanner,
  createViteMiddleware,
  cacheControlMiddleware,
  mountProxies,
  setupWebSocketUpgrade,
  setupTerminalBridge,
  createShutdownHandler,
  installGlobalErrorHandlers,
} from './src/server/setup.ts';

// Belt-and-suspenders: prevent `open` npm package from launching browser windows.
process.env.BROWSER = 'none';

// ── Tools Config ──
const toolsConfig = loadToolsConfig();

// ── Express App ──
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });
const PORT = 359;
const app = express();
app.use(express.json({ limit: '50mb' }));
// ── Compression: gzip all responses for faster page loads ──
// With compression, our 1MB JS bundle shrinks to ~250KB.
app.use(compression({ level: 6, threshold: 1024 }));
app.use((req, res, next) => {
  // Granular CSP: split directives instead of broad default-src with unsafe-inline/eval.
  // - script-src: 'unsafe-eval' needed for React/Vite dev mode (HMR). Safe in production builds.
  // - style-src:  'unsafe-inline' needed for Tailwind CSS <style> injection.
  // - connect-src: http/https for API calls to LLM providers; ws/wss for Vite HMR + terminal bridge.
  // - frame-src: localhost only for OpenCode/VS Code iframes.
  // - img-src: broad http/https for external images (QR codes, provider avatars).
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "connect-src 'self' http: https: ws: wss:",
    "img-src 'self' data: blob: http: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "frame-src http://localhost:* http://127.0.0.1:*",
    "child-src 'self' ws: wss: blob:",
    "worker-src 'self' blob:",
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// ── Activity Logger (shows page navigation + API calls in terminal) ──
app.use(requestLoggerMiddleware);

// ── Shutdown Debounce: any new request cancels pending auto-shutdown ──
// This prevents page refresh from accidentally killing services.
app.use((_req: any, _res: any, next: any) => {
  cancelPendingShutdown();
  next();
});

// ── Start Server ──
async function start() {
  const apiRouter = express.Router();

  // ── Mount Route Modules ──
  authRoutes(apiRouter);
  aiRoutes(apiRouter);
  permissionRoutes(apiRouter);
  fileRoutes(apiRouter);
  providerRoutes(apiRouter);
  notesRoutes(apiRouter);
  malikMemoryRoutes(apiRouter);
  skillsRoutes(apiRouter);
  webSearchRoutes(apiRouter);
  mcpRoutes(apiRouter);
  enhanceRoutes(apiRouter);
  terminalRoutes(apiRouter);
  gitRoutes(apiRouter);
  conversationRoutes(apiRouter);

  // ── Prompt Engineering Routes (Audit, Templates, Memory Blocks, Tool Routing) ──
  promptMasterRoutes(apiRouter);
  memoryBlockRoutes(apiRouter);

  // ── Hook System + Continuous Learning (Instincts) ──
  hooksRoutes(apiRouter);
  instinctsRoutes(apiRouter);

  // ── Advanced Features (Self-Improving, Token Optimizer, Scope Creep, Always-On, CRAG) ──
  advancedFeaturesRoutes(apiRouter);

  // ── Dashboard Stats (aggregated KPIs) ──
  dashboardRoutes(apiRouter);

  // ── Cost Tracking & Provider Health ──
  costTrackerRoutes(apiRouter);

  // ── Prompts Library ──
  promptsLibraryRoutes(apiRouter);

  // ── Skills Marketplace ──
  skillsMarketplaceRoutes(apiRouter);

  // ── Session Viewer (OpenCode live sessions) ──
  sessionViewerRoutes(apiRouter, () => openCodeManager.activePort);

  // ── Voice Agent UI ──
  voiceUiRoutes(apiRouter);

  // ── Public APIs (currency, packages, security, charts, diagrams, translate, email, news, httpbin, shortener) ──
  publicApisRoutes(apiRouter);

  // ── Board Persistence (kanban board state) ──
  boardRoutes(apiRouter);

  // ── Health Check ──
  apiRouter.get('/health', (_req, res) => {
    res.json({ ok: true, t: Date.now(), uptime: process.uptime() });
  });

  const OPENCODE_AUTH_TOKEN = crypto.randomBytes(32).toString('hex');
  let WORKSPACE_DIR = path.join(process.cwd(), 'workspace');
  if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  app.use('/api', apiRouter);

  // ── Activity Logger Routes (page navigation + SSE stream) ──
  apiRouter.use(activityRoutes);

  const workspaceState: WorkspaceState = {
    getWorkspaceDir: () => WORKSPACE_DIR,
    setWorkspaceDir: (d) => { WORKSPACE_DIR = d; },
  };
  workspaceRoutes(apiRouter, workspaceState);

  // ── Service Managers ──
  const openCodeManager = new OpenCodeManager(toolsConfig, PORT);
  const vscodeManager = new VscodeManager(toolsConfig);

  // ── Wire Service Routes with State Injection ──

  opencodeRoutes(apiRouter, {
    getOpencodeStatus: () => openCodeManager.status,
    setOpencodeStatus: (s) => { openCodeManager.status = s as any; },
    getOpencodeProcess: () => openCodeManager.process,
    setOpencodeProcess: (p) => { openCodeManager.process = p; },
    startOpenCodeServer: () => openCodeManager.start(),
    getToken: () => OPENCODE_AUTH_TOKEN,
    getPort: () => openCodeManager.port,
    getActivePort: () => openCodeManager.activePort,
    getIsPersonalInstance: () => openCodeManager.isPersonalInstance,
    getToolsConfig: () => toolsConfig,
  } satisfies OpencodeState);

  vscodeRoutes(apiRouter, {
    getVscodeManager: () => vscodeManager,
    getToolsConfig: () => toolsConfig,
  } satisfies VscodeState);


  shutdownRoutes(apiRouter, {
    openCodeManager,
    vscodeManager,
  });

  // ── Automation Routes (AI Company Orchestration) ──
  automationRoutes(apiRouter, {
    getOpencodeStatus: () => openCodeManager.status,
    setOpencodeStatus: (s) => { openCodeManager.status = s as any; },
    getOpencodeProcess: () => openCodeManager.process,
    setOpencodeProcess: (p) => { openCodeManager.process = p; },
    startOpenCodeServer: () => openCodeManager.start(),
    getToken: () => OPENCODE_AUTH_TOKEN,
    getPort: () => openCodeManager.port,
    getActivePort: () => openCodeManager.activePort,
    getIsPersonalInstance: () => openCodeManager.isPersonalInstance,
    getToolsConfig: () => toolsConfig,
  } satisfies OpencodeState);

  // ── Boot Detection ──
  await openCodeManager.detect();
  await vscodeManager.detect();
  printBootBanner(PORT, toolsConfig);


  // ── Auto-check OpenCode updates on startup (background, non-blocking) ──
  exec('npm view opencode-ai version', { encoding: 'utf-8', timeout: 10000, windowsHide: true }, (err, stdout) => {
    if (err) return;
    const latest = stdout.trim();
    const bin = path.join(process.cwd(), 'node_modules', 'opencode-windows-x64', 'bin', 'opencode.exe');
    if (!fs.existsSync(bin)) return;
    try {
      const current = execSync(`"${bin}" --version`, { encoding: 'utf-8', timeout: 5000, windowsHide: true }).trim();
      if (current && latest && current !== latest) {
        console.log(`  🔄  OpenCode update: ${current} → ${latest}  (POST /api/opencode/update)`);
      }
    } catch {}
  });

  // ── Reverse Proxies + WebSocket Upgrade ──
  // IMPORTANT: proxy mounts must NOT be prefixed with /opencode/* AND must not conflict with iframe direct access
  // (our SPA uses /vscode/* and /opencode/* only for websocket/service routing)
  mountProxies(app, () => vscodeManager.activePort, () => openCodeManager.activePort);

  // ── OpenCode Assets Proxy (FALLBACK ONLY) ──
  // The OpenCode SPA (loaded at /opencode/) references /assets/* as absolute paths
  // (fonts, images in JS bundles). These bypass the <base> tag and the fetch interceptor.
  // Proxy them to OpenCode so fonts/images load correctly.
  // IMPORTANT: In production mode, frontend built assets are served by express.static
  // BEFORE this middleware. This proxy only handles assets NOT found in dist/ (i.e. OpenCode assets).
  app.use('/assets', (req, res, next) => {
    // If dist/ exists and the file is in dist/assets/ — already handled by express.static above
    if (useProd) return next();

    const port = openCodeManager.activePort;
    if (!port) return next();
    const targetUrl = `http://127.0.0.1:${port}/assets${req.url}`;
    const proxyReq = http.request(targetUrl, { method: req.method, headers: { ...req.headers, host: `127.0.0.1:${port}` } }, (proxyRes) => {
      const headers = { ...proxyRes.headers };
      delete headers['x-frame-options'];
      delete headers['content-security-policy'];
      res.writeHead(proxyRes.statusCode || 502, headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', () => { if (!res.headersSent) res.status(502).json({ error: 'assets proxy unavailable' }); });
    req.pipe(proxyReq);
  });

  // ── Anthropic Proxy (routes to providers directly) ──
  anthropicProxyRoutes(app);

  // ── Dev vs Production Mode ──
  // Default: Vite HMR dev mode (instant code updates, no hard refresh needed).
  // Set USE_PROD=1 to serve pre-built dist/ (faster page loads, needs rebuild on changes).
  const distDir = path.join(process.cwd(), 'dist');
  const useProd = process.env.USE_PROD !== '0' && fs.existsSync(distDir);
  let vite: Awaited<ReturnType<typeof createViteMiddleware>> | undefined;

  if (useProd) {
    // Production: serve hashed assets with 1-year immutable cache, skip Vite entirely
    app.use('/assets', express.static(path.join(distDir, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(distDir));
    console.log('  📦 Serving production build (dist/) — no HMR');
  } else {
    // Dev mode: Vite middleware (live compilation, HMR for instant code updates)
    vite = await createViteMiddleware();
    app.use(vite.middlewares);
    if (fs.existsSync(distDir)) {
      // Fallback: serve built assets if Vite can't handle them (shouldn't happen normally)
      app.use(express.static(distDir));
    }
  }
  // Cache control: only HTML must be fresh; hashed assets use their own Cache-Control
  app.use(cacheControlMiddleware);

  const httpServer = app.listen(PORT, '0.0.0.0');

  httpServer.on('listening', () => {
    console.log(`  \x1b[32m✔\x1b[0m Ready on port ${PORT}`);
  });

  // Pass vite.ws for HMR WebSocket upgrades (only in dev mode)
  // Terminal WSS uses noServer:true — we dispatch /terminal upgrades to it manually
  // to prevent the ws library's auto-attach from killing Vite HMR sockets.
  const terminalWss = setupTerminalBridge();
  const viteWs = useProd ? undefined : vite?.ws;
  setupWebSocketUpgrade(httpServer, () => vscodeManager.activePort, () => openCodeManager.activePort, viteWs, terminalWss);

  // Hard routes (prevents 426 Upgrade Required from intercepting plain HTTP requests)
  app.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(useProd ? path.join(distDir, 'index.html') : path.join(process.cwd(), 'index.html'));
  });
  app.get('/favicon.ico', (_req, res) => {
    res.sendFile(useProd ? path.join(distDir, 'favicon.ico') : path.join(process.cwd(), 'public', 'favicon.ico'));
  });
  // Express 5 uses path-to-regexp and the '/assets/*' pattern can throw:
  // "Missing parameter name at index ...".
  // Just skip this handler entirely; Vite middleware will serve assets.


  // SPA fallback (only for non-API / non-static / dot-free paths)
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/vscode') || req.path.startsWith('/opencode') || req.path.startsWith('/terminal')) return next();
    if (req.path.startsWith('/favicon.ico')) return next();
    if (req.path.includes('.')) return next();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(useProd ? path.join(distDir, 'index.html') : path.join(process.cwd(), 'index.html'));
  });


  // ── WebSocket Terminal Bridge ──
  // (terminalWss created above and wired into setupWebSocketUpgrade)

  // ── Record Boot ──
  saveServiceState({ lastBoot: new Date().toISOString() });

  // ── Graceful Shutdown ──
  createShutdownHandler(httpServer, {
    openCodeManager,
    vscodeManager: { process: vscodeManager.process },
  });
}

start().catch((err) => {
  console.error('  ✗ Server failed to start:', err);
  process.exit(1);
});

installGlobalErrorHandlers();
