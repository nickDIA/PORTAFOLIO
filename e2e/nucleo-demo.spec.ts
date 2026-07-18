import { test, expect } from "@playwright/test";

/* ============================================================
   Demo de Núcleo — transacción atómica, en navegador real.
   Vitest ya prueba la lógica de la simulación (con timers reales);
   esto confirma que el mismo flujo se ve y se comporta bien
   renderizado de verdad — el mismo camino que se verificó a mano
   con el navegador durante el desarrollo.
   ============================================================ */

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
