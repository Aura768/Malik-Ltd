// vite.config.ts
import { defineConfig } from "file:///D:/Vibe%20Coder/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Vibe%20Coder/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///D:/Vibe%20Coder/node_modules/@tailwindcss/vite/dist/index.mjs";

// package.json
var package_default = {
  name: "malik_ltd",
  displayName: "Malik_Ltd AI Developer Platform",
  description: "AI coding assistant with 24-tier multi-provider fallback (Gemini, Groq, SambaNova, OpenRouter, FreeLLMAPI, OmniRoute)",
  private: true,
  version: "1.0.44",
  type: "module",
  scripts: {
    dev: "tsx watch server.ts",
    "dev:malik-ltd-coder": "node scripts/dev-maliks-clean.cjs && tsx watch server.ts",
    "dev:client": "vite",
    "dev:prod": "ts-node server.ts",
    start: "ts-node server.ts",
    "setup-vscode": "node scripts/download-vscode.cjs",
    "start:personal-opencode": "cmd /c scripts\\start-personal-opencode.cmd",
    build: "node scripts/bump-version.cjs && tsc && vite build",
    lint: "tsc --noEmit",
    compile: "tsc -p ./",
    watch: "tsc -watch -p ./"
  },
  dependencies: {
    "@heroui/react": "^3.2.2",
    "@tailwindcss/typography": "^0.5.20",
    docx: "^9.7.1",
    dotenv: "^17.4.2",
    express: "^5.2.1",
    "lucide-react": "^0.344.0",
    "opencode-ai": "^1.17.19",
    "pdf-lib": "^1.17.1",
    qrcode: "^1.5.4",
    react: "^19.2.7",
    "react-dom": "^19.2.7",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.18.1",
    "rehype-highlight": "^7.0.2",
    "remark-gfm": "^4.0.1",
    ws: "^8.21.0"
  },
  devDependencies: {
    "@tailwindcss/vite": "^4.3.2",
    "@types/express": "^5.0.6",
    "@types/node": "^26.1.0",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/ws": "^8.18.1",
    "@vitejs/plugin-react": "^4.3.1",
    tailwindcss: "^4.3.2",
    "ts-node": "^10.9.2",
    typescript: "^5.4.5",
    vite: "^5.4.2"
  }
};

// vite.config.ts
function blockFullReload() {
  return {
    name: "block-full-reload",
    configureServer(server) {
      const originalSend = server.hot?.send?.bind(server.hot);
      if (!originalSend) return;
      server.hot.send = (payload) => {
        if (payload?.type === "full-reload") {
          return;
        }
        return originalSend(payload);
      };
    }
  };
}
var vite_config_default = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(package_default.version)
    // __BUILD_TIME__ removed: was injecting new Date() on every server restart,
    // which invalidated all referencing modules and forced a full page reload.
    // version.ts falls back to new Date().toISOString() at runtime.
  },
  plugins: [react(), tailwindcss(), blockFullReload()],
  server: {
    host: true,
    allowedHosts: true,
    port: 359,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate"
    },
    watch: {
      ignored: [
        "**/workspace/**",
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/coverage/**",
        // Backend files — Vite can't HMR server code, so watching them
        // triggers full page reloads on every save.
        "**/src/server/**",
        "**/server.ts",
        "**/.cache/opencode/**",
        "**/.opencode/**",
        // Config/data files that change at runtime
        "**/.custom-providers.json",
        "**/.learnings.json",
        "**/.conversations.json",
        "**/.env*",
        "**/2fa-secret.txt",
        "**/config/**"
      ]
    },
    hmr: {
      overlay: false
      // No custom port — must match the Express server port (359)
      // so HMR WebSocket connects through the same HTTP server.
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcVmliZSBDb2RlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVmliZSBDb2RlclxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVmliZSUyMENvZGVyL3ZpdGUuY29uZmlnLnRzXCI7LyoqXG4gKiB2aXRlLmNvbmZpZy50cyBcdTIwMTQgVml0ZSBidWlsZCBjb25maWd1cmF0aW9uIGZvciB0aGUgTWFsaWsgTHRkIGZyb250ZW5kLlxuICogVXNlcyBSZWFjdCBwbHVnaW4gYW5kIFRhaWx3aW5kIENTUyB2NCBwbHVnaW4uIERldiBzZXJ2ZXIgcnVucyBvbiBwb3J0IDM1OVxuICogd2l0aCBITVIgb3ZlcmxheSBkaXNhYmxlZCBhbmQgd29ya3NwYWNlL2RhdGEgZmlsZXMgZXhjbHVkZWQgZnJvbSB3YXRjaC5cbiAqL1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5cbi8qKlxuICogUGx1Z2luOiBCbG9jayBmdWxsIHBhZ2UgcmVsb2FkcyBmcm9tIFZpdGUgSE1SLlxuICpcbiAqIFdoZW4gVml0ZSBjYW4ndCBob3QtcmVwbGFjZSBhIG1vZHVsZSwgaXQgc2VuZHMgYSBcImZ1bGwtcmVsb2FkXCIgZXZlbnQgdmlhXG4gKiB0aGUgSE1SIFdlYlNvY2tldCB3aGljaCB0cmlnZ2VycyBsb2NhdGlvbi5yZWxvYWQoKS4gVGhpcyBkZXN0cm95cyB0aGUgZW50aXJlXG4gKiBwYWdlIFx1MjAxNCBpbmNsdWRpbmcgZW1iZWRkZWQgaWZyYW1lcyAoT3BlbkNvZGUsIFZTIENvZGUpLlxuICpcbiAqIFRoaXMgcGx1Z2luIGludGVyY2VwdHMgXCJmdWxsLXJlbG9hZFwiIHBheWxvYWRzIGFuZCBzaWxlbnRseSBkcm9wcyB0aGVtLlxuICogSE1SIChob3QgbW9kdWxlIHJlcGxhY2VtZW50KSBzdGlsbCB3b3JrcyBmb3IgUmVhY3QgY29tcG9uZW50cyBhbmQgQ1NTLlxuICogT25seSB0aGUgZGVzdHJ1Y3RpdmUgZnVsbC1yZWxvYWQgaXMgYmxvY2tlZC4gSWYgYSBjaGFuZ2UgdHJ1bHkgbmVlZHMgYVxuICogZnVsbCByZWxvYWQgKHJhcmUpLCB0aGUgdXNlciBjYW4gcmVmcmVzaCBtYW51YWxseS5cbiAqL1xuZnVuY3Rpb24gYmxvY2tGdWxsUmVsb2FkKCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdibG9jay1mdWxsLXJlbG9hZCcsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogYW55KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbFNlbmQgPSBzZXJ2ZXIuaG90Py5zZW5kPy5iaW5kKHNlcnZlci5ob3QpO1xuICAgICAgaWYgKCFvcmlnaW5hbFNlbmQpIHJldHVybjtcbiAgICAgIHNlcnZlci5ob3Quc2VuZCA9IChwYXlsb2FkOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHBheWxvYWQ/LnR5cGUgPT09ICdmdWxsLXJlbG9hZCcpIHtcbiAgICAgICAgICAvLyBTaWxlbnRseSBibG9jayBcdTIwMTQgSE1SIHdpbGwgaGFuZGxlIG1vc3QgY2hhbmdlczsgbWFudWFsIHJlZnJlc2ggZm9yIHRoZSByZXN0XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbFNlbmQocGF5bG9hZCk7XG4gICAgICB9O1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGRlZmluZToge1xuICAgIF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocGtnLnZlcnNpb24pLFxuICAgIC8vIF9fQlVJTERfVElNRV9fIHJlbW92ZWQ6IHdhcyBpbmplY3RpbmcgbmV3IERhdGUoKSBvbiBldmVyeSBzZXJ2ZXIgcmVzdGFydCxcbiAgICAvLyB3aGljaCBpbnZhbGlkYXRlZCBhbGwgcmVmZXJlbmNpbmcgbW9kdWxlcyBhbmQgZm9yY2VkIGEgZnVsbCBwYWdlIHJlbG9hZC5cbiAgICAvLyB2ZXJzaW9uLnRzIGZhbGxzIGJhY2sgdG8gbmV3IERhdGUoKS50b0lTT1N0cmluZygpIGF0IHJ1bnRpbWUuXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpLCBibG9ja0Z1bGxSZWxvYWQoKV0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IHRydWUsXG4gICAgYWxsb3dlZEhvc3RzOiB0cnVlLFxuICAgIHBvcnQ6IDM1OSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1zdG9yZSwgbm8tY2FjaGUsIG11c3QtcmV2YWxpZGF0ZScsXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgaWdub3JlZDogW1xuICAgICAgICAnKiovd29ya3NwYWNlLyoqJyxcbiAgICAgICAgJyoqL25vZGVfbW9kdWxlcy8qKicsXG4gICAgICAgICcqKi8uZ2l0LyoqJyxcbiAgICAgICAgJyoqL2Rpc3QvKionLFxuICAgICAgICAnKiovY292ZXJhZ2UvKionLFxuICAgICAgICAvLyBCYWNrZW5kIGZpbGVzIFx1MjAxNCBWaXRlIGNhbid0IEhNUiBzZXJ2ZXIgY29kZSwgc28gd2F0Y2hpbmcgdGhlbVxuICAgICAgICAvLyB0cmlnZ2VycyBmdWxsIHBhZ2UgcmVsb2FkcyBvbiBldmVyeSBzYXZlLlxuICAgICAgICAnKiovc3JjL3NlcnZlci8qKicsXG4gICAgICAgICcqKi9zZXJ2ZXIudHMnLFxuICAgICAgICAnKiovLmNhY2hlL29wZW5jb2RlLyoqJyxcbiAgICAgICAgJyoqLy5vcGVuY29kZS8qKicsXG4gICAgICAgIC8vIENvbmZpZy9kYXRhIGZpbGVzIHRoYXQgY2hhbmdlIGF0IHJ1bnRpbWVcbiAgICAgICAgJyoqLy5jdXN0b20tcHJvdmlkZXJzLmpzb24nLFxuICAgICAgICAnKiovLmxlYXJuaW5ncy5qc29uJyxcbiAgICAgICAgJyoqLy5jb252ZXJzYXRpb25zLmpzb24nLFxuICAgICAgICAnKiovLmVudionLFxuICAgICAgICAnKiovMmZhLXNlY3JldC50eHQnLFxuICAgICAgICAnKiovY29uZmlnLyoqJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgLy8gTm8gY3VzdG9tIHBvcnQgXHUyMDE0IG11c3QgbWF0Y2ggdGhlIEV4cHJlc3Mgc2VydmVyIHBvcnQgKDM1OSlcbiAgICAgIC8vIHNvIEhNUiBXZWJTb2NrZXQgY29ubmVjdHMgdGhyb3VnaCB0aGUgc2FtZSBIVFRQIHNlcnZlci5cbiAgICB9LFxuICB9LFxufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJtYWxpa19sdGRcIixcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIk1hbGlrX0x0ZCBBSSBEZXZlbG9wZXIgUGxhdGZvcm1cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkFJIGNvZGluZyBhc3Npc3RhbnQgd2l0aCAyNC10aWVyIG11bHRpLXByb3ZpZGVyIGZhbGxiYWNrIChHZW1pbmksIEdyb3EsIFNhbWJhTm92YSwgT3BlblJvdXRlciwgRnJlZUxMTUFQSSwgT21uaVJvdXRlKVwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjQ0XCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidHN4IHdhdGNoIHNlcnZlci50c1wiLFxuICAgIFwiZGV2Om1hbGlrLWx0ZC1jb2RlclwiOiBcIm5vZGUgc2NyaXB0cy9kZXYtbWFsaWtzLWNsZWFuLmNqcyAmJiB0c3ggd2F0Y2ggc2VydmVyLnRzXCIsXG4gICAgXCJkZXY6Y2xpZW50XCI6IFwidml0ZVwiLFxuICAgIFwiZGV2OnByb2RcIjogXCJ0cy1ub2RlIHNlcnZlci50c1wiLFxuICAgIFwic3RhcnRcIjogXCJ0cy1ub2RlIHNlcnZlci50c1wiLFxuICAgIFwic2V0dXAtdnNjb2RlXCI6IFwibm9kZSBzY3JpcHRzL2Rvd25sb2FkLXZzY29kZS5janNcIixcbiAgICBcInN0YXJ0OnBlcnNvbmFsLW9wZW5jb2RlXCI6IFwiY21kIC9jIHNjcmlwdHNcXFxcc3RhcnQtcGVyc29uYWwtb3BlbmNvZGUuY21kXCIsXG4gICAgXCJidWlsZFwiOiBcIm5vZGUgc2NyaXB0cy9idW1wLXZlcnNpb24uY2pzICYmIHRzYyAmJiB2aXRlIGJ1aWxkXCIsXG4gICAgXCJsaW50XCI6IFwidHNjIC0tbm9FbWl0XCIsXG4gICAgXCJjb21waWxlXCI6IFwidHNjIC1wIC4vXCIsXG4gICAgXCJ3YXRjaFwiOiBcInRzYyAtd2F0Y2ggLXAgLi9cIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAaGVyb3VpL3JlYWN0XCI6IFwiXjMuMi4yXCIsXG4gICAgXCJAdGFpbHdpbmRjc3MvdHlwb2dyYXBoeVwiOiBcIl4wLjUuMjBcIixcbiAgICBcImRvY3hcIjogXCJeOS43LjFcIixcbiAgICBcImRvdGVudlwiOiBcIl4xNy40LjJcIixcbiAgICBcImV4cHJlc3NcIjogXCJeNS4yLjFcIixcbiAgICBcImx1Y2lkZS1yZWFjdFwiOiBcIl4wLjM0NC4wXCIsXG4gICAgXCJvcGVuY29kZS1haVwiOiBcIl4xLjE3LjE5XCIsXG4gICAgXCJwZGYtbGliXCI6IFwiXjEuMTcuMVwiLFxuICAgIFwicXJjb2RlXCI6IFwiXjEuNS40XCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOS4yLjdcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOS4yLjdcIixcbiAgICBcInJlYWN0LW1hcmtkb3duXCI6IFwiXjEwLjEuMFwiLFxuICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiOiBcIl43LjE4LjFcIixcbiAgICBcInJlaHlwZS1oaWdobGlnaHRcIjogXCJeNy4wLjJcIixcbiAgICBcInJlbWFyay1nZm1cIjogXCJeNC4wLjFcIixcbiAgICBcIndzXCI6IFwiXjguMjEuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkB0YWlsd2luZGNzcy92aXRlXCI6IFwiXjQuMy4yXCIsXG4gICAgXCJAdHlwZXMvZXhwcmVzc1wiOiBcIl41LjAuNlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjYuMS4wXCIsXG4gICAgXCJAdHlwZXMvcXJjb2RlXCI6IFwiXjEuNS42XCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMy4zXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjMuMFwiLFxuICAgIFwiQHR5cGVzL3dzXCI6IFwiXjguMTguMVwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjFcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjQuMy4yXCIsXG4gICAgXCJ0cy1ub2RlXCI6IFwiXjEwLjkuMlwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjQuNVwiLFxuICAgIFwidml0ZVwiOiBcIl41LjQuMlwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFNQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7OztBQ1J4QjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsdUJBQXVCO0FBQUEsSUFDdkIsY0FBYztBQUFBLElBQ2QsWUFBWTtBQUFBLElBQ1osT0FBUztBQUFBLElBQ1QsZ0JBQWdCO0FBQUEsSUFDaEIsMkJBQTJCO0FBQUEsSUFDM0IsT0FBUztBQUFBLElBQ1QsTUFBUTtBQUFBLElBQ1IsU0FBVztBQUFBLElBQ1gsT0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxpQkFBaUI7QUFBQSxJQUNqQiwyQkFBMkI7QUFBQSxJQUMzQixNQUFRO0FBQUEsSUFDUixRQUFVO0FBQUEsSUFDVixTQUFXO0FBQUEsSUFDWCxnQkFBZ0I7QUFBQSxJQUNoQixlQUFlO0FBQUEsSUFDZixXQUFXO0FBQUEsSUFDWCxRQUFVO0FBQUEsSUFDVixPQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixrQkFBa0I7QUFBQSxJQUNsQixvQkFBb0I7QUFBQSxJQUNwQixvQkFBb0I7QUFBQSxJQUNwQixjQUFjO0FBQUEsSUFDZCxJQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIscUJBQXFCO0FBQUEsSUFDckIsa0JBQWtCO0FBQUEsSUFDbEIsZUFBZTtBQUFBLElBQ2YsaUJBQWlCO0FBQUEsSUFDakIsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsYUFBYTtBQUFBLElBQ2Isd0JBQXdCO0FBQUEsSUFDeEIsYUFBZTtBQUFBLElBQ2YsV0FBVztBQUFBLElBQ1gsWUFBYztBQUFBLElBQ2QsTUFBUTtBQUFBLEVBQ1Y7QUFDRjs7O0FEN0JBLFNBQVMsa0JBQWtCO0FBQ3pCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFhO0FBQzNCLFlBQU0sZUFBZSxPQUFPLEtBQUssTUFBTSxLQUFLLE9BQU8sR0FBRztBQUN0RCxVQUFJLENBQUMsYUFBYztBQUNuQixhQUFPLElBQUksT0FBTyxDQUFDLFlBQWlCO0FBQ2xDLFlBQUksU0FBUyxTQUFTLGVBQWU7QUFFbkM7QUFBQSxRQUNGO0FBQ0EsZUFBTyxhQUFhLE9BQU87QUFBQSxNQUM3QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixpQkFBaUIsS0FBSyxVQUFVLGdCQUFJLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUk3QztBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsZ0JBQWdCLENBQUM7QUFBQSxFQUNuRCxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxJQUNuQjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQTtBQUFBLFFBR0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBRUE7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUE7QUFBQTtBQUFBLElBR1g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
