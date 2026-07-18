import { test, expect } from "@playwright/test";

/* ============================================================
   Navegación entre facetas — el color de señal como sistema,
   verificado en un navegador real (no jsdom): cada faceta debe
   tematizar su encabezado y el anillo de foco de teclado con
   su color exacto.
   ============================================================ */

const facets = [
  { path: "/desarrollo-web", heading: "Desarrollo Web", ring: "#5b8def" },
  { path: "/servicios-it", heading: "Servicios IT", ring: "#e8a23d" },
  { path: "/ia-automatizacion", heading: "IA & Automatización", ring: "#4fd1c5" },
];

test("la landing muestra el nombre y las tres tarjetas de faceta", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dominick Ibarra Acedo",
  );
  for (const f of facets) {
    await expect(
      page.getByRole("link", { name: new RegExp(f.heading) }).first(),
    ).toBeVisible();
  }
});

for (const f of facets) {
  test(`${f.heading}: encabezado correcto y anillo de foco tematizado`, async ({
    page,
  }) => {
    await page.goto(f.path);
    await expect(
      page.getByRole("heading", { level: 1, name: f.heading }),
    ).toBeVisible();

    const ring = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--focus-ring")
        .trim()
        .toLowerCase(),
    );
    expect(ring).toBe(f.ring);
  });
}
