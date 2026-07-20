import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";

/* ============================================================
   Accesibilidad en navegador REAL — lo que jsdom no puede ver.
   ------------------------------------------------------------
   La suite de Vitest corre axe con la regla color-contrast
   DESACTIVADA (jsdom no renderiza colores). Aquí, en Chromium,
   sí se computa el contraste real: esto atrapó que --text-muted
   fallaba AA sobre los paneles tenues de señal (bgSoft), algo
   invisible al verificar el token solo contra ink/surface.

   Además fija que el inglés — con textos más largos — no
   desborde horizontalmente en móvil ni escritorio (regresión
   de layout sin diffs de píxeles, estable entre SO/CI).
   ============================================================ */

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve("axe-core");

const ROUTES = [
  "/",
  "/desarrollo-web",
  "/servicios-it",
  "/ia-automatizacion",
  "/en",
  "/en/desarrollo-web",
  "/en/servicios-it",
  "/en/ia-automatizacion",
];

const WIDTHS = [
  { name: "móvil", width: 375, height: 812 },
  { name: "escritorio", width: 1280, height: 800 },
];

for (const route of ROUTES) {
  test.describe(`a11y real ${route}`, () => {
    test("contraste WCAG AA sin violaciones (navegador real)", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.addScriptTag({ path: AXE_PATH });
      const results = await page.evaluate(
        async () =>
          await (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: { nodes: { target: unknown; failureSummary?: string }[] }[] }> } }).axe.run(
            document,
            { runOnly: ["color-contrast"] },
          ),
      );
      const summary = results.violations.flatMap((v) =>
        v.nodes.map((n) => `${n.target} — ${n.failureSummary}`),
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });

    for (const vp of WIDTHS) {
      test(`sin desbordamiento horizontal en ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return { scrollW: de.scrollWidth, clientW: de.clientWidth };
        });
        expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW + 1);
      });
    }
  });
}
