import { test, expect } from "@playwright/test";

/* ============================================================
   Demo de Núcleo — transacción atómica, en navegador real.
   Vitest ya prueba la lógica de la simulación (con timers reales);
   esto confirma que el mismo flujo se ve y se comporta bien
   renderizado de verdad — el mismo camino que se verificó a mano
   con el navegador durante el desarrollo. Cubre español completo
   y una pasada en inglés para confirmar que el idioma no rompe
   el flujo real en el navegador.
   ============================================================ */

test.describe("español (/servicios-it)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/servicios-it");
  });

  test("transacción exitosa: COMMIT actualiza el estado y confirma la auditoría", async ({
    page,
  }) => {
    const activos = page.getByRole("list", { name: "Activos gestionados" });
    const fila = activos.getByRole("listitem").filter({ hasText: "ACT-014" });

    await fila.getByRole("button", { name: /En mantenimiento/ }).click();

    const consola = page.getByRole("log", { name: "Consola de transacción" });
    await expect(consola).toContainText("BEGIN TRANSACTION");
    await expect(consola).toContainText("COMMIT", { timeout: 5000 });

    await expect(fila).toContainText("En mantenimiento");
    await expect(page.getByText(/sin confirmar/)).toHaveCount(0);
  });

  test("rollback: forzar error revierte el estado y la auditoría juntos", async ({
    page,
  }) => {
    const activos = page.getByRole("list", { name: "Activos gestionados" });
    const fila = activos.getByRole("listitem").filter({ hasText: "ACT-014" });
    const toggle = page.getByRole("button", { name: /forzar error/i });

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await fila.getByRole("button", { name: /En mantenimiento/ }).click();

    const consola = page.getByRole("log", { name: "Consola de transacción" });
    await expect(consola).toContainText("ERROR simulado", { timeout: 5000 });
    await expect(consola).toContainText("sin cambios parciales", {
      timeout: 5000,
    });

    /* Atomicidad: el activo vuelve exacto a su estado original */
    await expect(fila).toContainText("Operativo");
    await expect(page.getByText(/revertida por rollback/)).toHaveCount(0);
    /* El toggle de error se desarma solo */
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });
});

test.describe("inglés (/en/servicios-it)", () => {
  test("transacción exitosa con la UI en inglés: COMMIT actualiza estado y auditoría", async ({
    page,
  }) => {
    await page.goto("/en/servicios-it");

    const activos = page.getByRole("list", { name: "Managed assets" });
    const fila = activos.getByRole("listitem").filter({ hasText: "ACT-014" });

    await fila.getByRole("button", { name: /Under maintenance/ }).click();

    const consola = page.getByRole("log", { name: "Transaction console" });
    /* Los fragmentos con forma de SQL se dejan idénticos a propósito */
    await expect(consola).toContainText("BEGIN TRANSACTION");
    await expect(consola).toContainText("COMMIT", { timeout: 5000 });

    await expect(fila).toContainText("Under maintenance");
    await expect(page.getByText(/unconfirmed/)).toHaveCount(0);
  });
});
