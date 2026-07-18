import { defineConfig, devices } from "@playwright/test";

/* ============================================================
   Playwright — pruebas end-to-end en navegador real.
   Complementa (no reemplaza) la suite de Vitest: jsdom no
   renderiza de verdad (ver TESTING.md), así que animaciones,
   layout, contraste real y el flujo completo del copiloto vía
   red solo se pueden verificar aquí.
   ============================================================ */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
