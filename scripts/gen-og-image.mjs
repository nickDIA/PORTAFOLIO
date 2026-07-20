/* ============================================================
   Genera public/og-image.png (1200×630) — la imagen de
   previsualización social de marca, en el sistema de diseño del
   sitio (fondo #0B0D12, Space Grotesk, colores de señal por rol).

   Es un asset ESTÁTICO: se corre a mano cuando cambia el diseño
   (`node scripts/gen-og-image.mjs`) y el PNG resultante se commitea
   en /public. NO forma parte del build de producción — reutiliza el
   Chromium que Playwright ya instala para los E2E.
   ============================================================ */

import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "og-image.png");

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --ink: #0B0D12; --surface: #12151C; --text: #E7E9F0; --muted: #7A8099;
    --web: #5B8DEF; --it: #E8A23D; --ai: #4FD1C5;
  }
  html, body { width: 1200px; height: 630px; }
  body {
    background: radial-gradient(120% 140% at 78% 18%, #171b25 0%, var(--ink) 60%);
    color: var(--text);
    font-family: "Space Grotesk", system-ui, sans-serif;
    padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .eyebrow {
    font-family: "IBM Plex Mono", monospace; font-size: 22px; font-weight: 500;
    letter-spacing: 0.42em; text-transform: uppercase; color: var(--muted);
  }
  h1 { font-size: 92px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.02; }
  .title { margin-top: 20px; font-size: 34px; font-weight: 500; color: var(--muted); }
  .tagline {
    margin-top: 28px; max-width: 720px; font-size: 27px; line-height: 1.4;
    color: var(--text); font-weight: 500;
  }
  .roles { display: flex; gap: 18px; }
  .chip {
    font-family: "IBM Plex Mono", monospace; font-size: 21px; font-weight: 500;
    padding: 12px 20px; border-radius: 10px; border: 1.5px solid;
    background: var(--surface);
  }
  .web { color: var(--web); border-color: color-mix(in srgb, var(--web) 55%, transparent); }
  .it  { color: var(--it);  border-color: color-mix(in srgb, var(--it) 55%, transparent); }
  .ai  { color: var(--ai);  border-color: color-mix(in srgb, var(--ai) 55%, transparent); }
  /* Trazas de señal decorativas, eco del hero del sitio */
  svg.trace { position: absolute; inset: 0; width: 1200px; height: 630px; opacity: 0.5; }
</style>
</head>
<body>
  <svg class="trace" viewBox="0 0 1200 630" fill="none">
    <path d="M1200 120 Q 980 120 900 230 T 720 300" stroke="#5B8DEF" stroke-width="2.5" opacity="0.6"/>
    <path d="M1200 300 Q 1000 300 940 330 T 760 360" stroke="#E8A23D" stroke-width="2.5" opacity="0.6"/>
    <path d="M1200 500 Q 980 500 900 420 T 720 380" stroke="#4FD1C5" stroke-width="2.5" opacity="0.6"/>
  </svg>

  <header>
    <p class="eyebrow">Portafolio</p>
  </header>

  <main>
    <h1>Dominick<br />Ibarra Acedo</h1>
    <p class="title">Ingeniero en Sistemas</p>
    <p class="tagline">Interfaces accesibles, infraestructura que no se cae e IA integrada en productos reales.</p>
  </main>

  <footer class="roles">
    <span class="chip web">Desarrollo Web</span>
    <span class="chip it">Servicios IT</span>
    <span class="chip ai">IA &amp; Automatización</span>
  </footer>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`✓ og-image → ${out}`);
