/**
 * vite.config.ts — Vite build configuration for the Malik Ltd frontend.
 * Uses React plugin and Tailwind CSS v4 plugin. Dev server runs on port 359
 * with HMR overlay disabled and workspace/data files excluded from watch.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import pkg from './package.json';

/**
 * Plugin: Block full page reloads from Vite HMR.
 *
 * When Vite can't hot-replace a module, it sends a "full-reload" event via
 * the HMR WebSocket which triggers location.reload(). This destroys the entire
 * page — including embedded iframes (OpenCode, VS Code).
 *
 * This plugin intercepts "full-reload" payloads and silently drops them.
 * HMR (hot module replacement) still works for React components and CSS.
 * Only the destructive full-reload is blocked. If a change truly needs a
 * full reload (rare), the user can refresh manually.
 */
function blockFullReload() {
  return {
    name: 'block-full-reload',
    configureServer(server: any) {
      const originalSend = server.hot?.send?.bind(server.hot);
      if (!originalSend) return;
      server.hot.send = (payload: any) => {
        if (payload?.type === 'full-reload') {
          // Silently block — HMR will handle most changes; manual refresh for the rest
          return;
        }
        return originalSend(payload);
      };
    },
  };
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react(), tailwindcss(), blockFullReload()],
  // Pre-bundle common deps so Vite doesn't transform them on every page load
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
    ],
  },
  build: {
    // Code splitting: split vendor code from app code for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    port: 359,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
    // Warm up known entry modules so first page load is faster
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx', './src/index.css'],
    },
    watch: {
      ignored: [
        '**/workspace/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        // Backend files — Vite can't HMR server code, so watching them
        // triggers full page reloads on every save. Backend uses tsx watch instead.
        '**/src/server/**',
        '**/server.ts',
        '**/.cache/opencode/**',
        '**/.opencode/**',
        // Config/data files that change at runtime
        '**/.custom-providers.json',
        '**/.learnings.json',
        '**/.conversations.json',
        '**/.env*',
        '**/2fa-secret.txt',
        '**/config/**',
      ],
    },
    hmr: {
      overlay: false,
    },
  },
});
