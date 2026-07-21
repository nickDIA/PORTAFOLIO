import { test, expect } from "@playwright/test";

/* ============================================================
   Galería de evidencia de la landing — navegador real.
   ------------------------------------------------------------
   La galería usa rutas de foto REALES que pueden no existir aún
   en /public (el usuario las va soltando sin tocar código). El
   dev server y Cloudflare Pages responden a una imagen faltante
   con el fallback SPA (200 + text/html), no con 404 — el <img>
   falla al decodificar, dispara onError y ScreenshotFrame cae al
   marco pendiente. La garantía que fija este spec es disk-agnostic:
   CERO imágenes rotas — cada figura termina en una imagen cargada
   de verdad o en el marco pendiente, sin importar qué archivos
   existan el día que corra.
   ============================================================ */

test("la galería de evidencia nunca muestra imágenes rotas", async ({ page }) => {
  await page.goto("/");
  const gallery = page.locator('section[aria-labelledby="evidencia"]');
  await gallery.scrollIntoViewIfNeeded();

  const figures = gallery.locator("figure");
  expect(await figures.count()).toBeGreaterThan(0);

  /* Esperar a que cada figura se estabilice: imagen decodificada o
     marco pendiente (sin <img>) — nunca un <img> roto. */
  await expect(async () => {
    const states = await figures.evaluateAll((els) =>
      els.map((f) => {
        const img = f.querySelector("img");
        if (!img) return "pending";
        return img.complete && img.naturalWidth > 0 ? "loaded" : "unsettled";
      }),
    );
    expect(states).not.toContain("unsettled");
  }).toPass();

  const states = await figures.evaluateAll((els) =>
    els.map((f) => {
      const img = f.querySelector("img");
      if (!img) return "pending";
      return img.complete && img.naturalWidth > 0 ? "loaded" : "unsettled";
    }),
  );
  /* Al menos una foto real ya existe (Nautylab) — si esto falla, la
     galería entera está en pendiente y algo se rompió en las rutas. */
  expect(states).toContain("loaded");
});
