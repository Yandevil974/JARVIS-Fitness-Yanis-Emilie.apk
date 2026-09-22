import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  plugins: [react()],
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
