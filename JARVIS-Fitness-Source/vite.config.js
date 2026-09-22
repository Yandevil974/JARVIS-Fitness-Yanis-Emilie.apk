import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  plugins: [react(), {
    name: "deny-private-preview-paths",
    configureServer(server) {
      // Reject private paths even when the file is absent (before SPA fallback).
      server.middlewares.use((req, res, next) => {
        let path;
        try { path = decodeURIComponent((req.url || "").split("?")[0]); }
        catch { res.statusCode = 400; res.end(); return; }
        if (/(^|\/)(\.private|android|uploads|livraison-jarvis)(\/|$)/.test(path) ||
            /\.(keystore|jks|p12|pem|key)$/i.test(path)) {
          res.statusCode = 403;
          res.end("Accès interdit");
          return;
        }
        next();
      });
    },
  }],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      allow: [root],
      deny: [
        ".env", ".env.*", "**/*.{crt,pem,key,keystore,jks}", "**/.git/**",
        "**/.private/**", "**/android/**", "**/uploads/**", "**/livraison-jarvis/**",
        "**/tests/**", "**/audit/**"
      ]
    },
    watch: {
      ignored: ["**/android/**", "**/release/**", "**/.private/**", "**/tests/**", "**/audit/**"]
    }
  },
  build: {
    outDir: "release",
    assetsInlineLimit: 10000,
    chunkSizeWarningLimit: 1600
  },
  base: "./"
});
