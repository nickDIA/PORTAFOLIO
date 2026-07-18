import { test, expect } from "@playwright/test";

/* ============================================================
   Navegación entre roles — el color de señal como sistema,
   verificado en un navegador real (no jsdom): cada rol debe
   tematizar su encabezado y el anillo de foco de teclado con
   su color exacto.
   ============================================================ */

const roles = [
  { path: "/desarrollo-web", heading: "Desarrollo Web", ring: "#5b8def" },
  { path: "/servicios-it", heading: "Servicios IT", ring: "#e8a23d" },
  { path: "/ia-automatizacion", heading: "IA & Automatización", ring: "#4fd1c5" },
];

test("la landing muestra el nombre y las tres tarjetas de rol", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dominick Ibarra Acedo",
  );
  for (const r of roles) {
    await expect(
      page.getByRole("link", { name: new RegExp(r.heading) }).first(),
    ).toBeVisible();
  }
});

for (const r of roles) {
  test(`${r.heading}: encabezado correcto y anillo de foco tematizado`, async ({
    page,
  }) => {
    await page.goto(r.path);
    await expect(
      page.getByRole("heading", { level: 1, name: r.heading }),
    ).toBeVisible();

    const ring = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--focus-ring")
        .trim()
        .toLowerCase(),
    );
    expect(ring).toBe(r.ring);
  });
}
