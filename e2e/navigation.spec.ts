import { test, expect } from "@playwright/test";

/* ============================================================
   Navegación entre roles — el color de señal como sistema,
   verificado en un navegador real (no jsdom): cada rol debe
   tematizar su encabezado y el anillo de foco de teclado con
   su color exacto. Cubre ambos árboles de rutas (es sin prefijo,
   en bajo /en) y el selector de idioma que los conecta.
   ============================================================ */

const roles = [
  { path: "/desarrollo-web", heading: "Desarrollo Web", ring: "#5b8def" },
  { path: "/servicios-it", heading: "Servicios IT", ring: "#e8a23d" },
  { path: "/ia-automatizacion", heading: "IA & Automatización", ring: "#4fd1c5" },
];

const rolesEn = [
  { path: "/en/desarrollo-web", heading: "Web Development", ring: "#5b8def" },
  { path: "/en/servicios-it", heading: "IT Services", ring: "#e8a23d" },
  { path: "/en/ia-automatizacion", heading: "AI & Automation", ring: "#4fd1c5" },
];

test("la landing muestra el titular de servicios, el nombre y las tres tarjetas", async ({
  page,
}) => {
  await page.goto("/");
  /* El h1 habla al cliente; el nombre queda como firma bajo el hero */
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Tecnología que trabaja para ti",
  );
  await expect(page.getByText(/Dominick Ibarra Acedo/)).toBeVisible();
  for (const r of roles) {
    await expect(
      page.getByRole("link", { name: new RegExp(r.heading) }).first(),
    ).toBeVisible();
  }
});

test("la landing en inglés (/en) muestra el titular y las tarjetas traducidas", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Technology that works for you",
  );
  await expect(page.getByText(/Dominick Ibarra Acedo/)).toBeVisible();
  for (const r of rolesEn) {
    await expect(
      page.getByRole("link", { name: new RegExp(r.heading) }).first(),
    ).toBeVisible();
  }
});

for (const r of [...roles, ...rolesEn]) {
  test(`${r.path}: encabezado correcto y anillo de foco tematizado`, async ({
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

test.describe("página Sobre mí", () => {
  test("accesible desde el nav en cualquier página, en ambos idiomas", async ({
    page,
  }) => {
    await page.goto("/servicios-it");
    await page.getByRole("link", { name: "Sobre mí" }).click();
    await expect(page).toHaveURL(/\/sobre-mi$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sobre mí" }),
    ).toBeVisible();

    await page.goto("/en/servicios-it");
    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/en\/sobre-mi$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "About me" }),
    ).toBeVisible();
  });
});

test.describe("selector de idioma", () => {
  test("de español a inglés conserva la página actual", async ({ page }) => {
    await page.goto("/servicios-it");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/servicios-it$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "IT Services" }),
    ).toBeVisible();
  });

  test("de inglés a español conserva la página actual", async ({ page }) => {
    await page.goto("/en/servicios-it");
    await page.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/servicios-it$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Servicios IT" }),
    ).toBeVisible();
  });

  test("document.documentElement.lang sigue el idioma activo", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
