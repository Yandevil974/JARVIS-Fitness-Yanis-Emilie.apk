import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
function privateGuard() {
  const blocked = (url) => {
    try {
      const u = decodeURIComponent(url || "");
      return (
        /^\/(\.private|android|uploads|livraison-jarvis)(\/|$)/.test(u) ||
        /\/(@fs\/\.\.\/|@fs\/home).*\/(\.private|android|uploads)(\/|$)/.test(u) ||
        u.includes("/.private/") ||
        u.includes("/.private")
      );
    } catch (e) {
      return true;
    }
  };
  const middleware = (req, res, next) => {
    const url = (req.url || "").split("?")[0];
    if (blocked(url)) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "text/plain");
      res.end("Restricted");
      return;
    }
    next();
  };
  return {
    name: "yfe-private-guard",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
export default defineConfig({
  plugins: [react(), privateGuard()],
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
