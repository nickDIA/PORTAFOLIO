/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    /* En dev, el copiloto corre en wrangler dev (npm run worker:dev) */
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
    /* e2e/ son specs de Playwright, no de Vitest — excluir explícitamente
       para que Vitest no intente recolectarlos como tests propios. */
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
