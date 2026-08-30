import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    // Lets the dev server answer to a tunnel's public hostname (ngrok/cloudflared/loca.lt),
    // which Vite otherwise rejects as an unrecognized Host header.
    allowedHosts: true,
    proxy: {
      // Routes API calls through the same origin the page was loaded from, server-to-server —
      // keeps the browser's fetches same-origin no matter whether the page is opened via
      // localhost, a LAN IP, or a public tunnel URL, so auth cookies (SameSite=Lax) always apply.
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
