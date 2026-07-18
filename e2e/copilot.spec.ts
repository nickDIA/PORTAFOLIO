import { test, expect } from "@playwright/test";

/* ============================================================
   Copiloto IA — flujo completo en navegador real.
   La red se mockea a nivel de Playwright (no hay API key real
   en CI), pero el SSE simulado usa CRLF ("\r\n\r\n") — el formato
   real de Gemini que causó un bug de producción (ver TESTING.md).
   Esta prueba es una segunda línea de defensa contra esa regresión,
   ahora en un navegador real de extremo a extremo.
   ============================================================ */

test("abre, envía una pregunta y muestra la respuesta streameada", async ({
  page,
}) => {
  await page.route("**/api/chat", async (route) => {
    const evento = (texto: string, ultimo = false) =>
      `data: ${JSON.stringify({
        candidates: [
          {
            content: { role: "model", parts: [{ text: texto }] },
            ...(ultimo ? { finishReason: "STOP" } : {}),
          },
        ],
      })}\r\n\r\n`;
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: evento("Nautylab es ") + evento("un proyecto real.", true),
    });
  });

  await page.goto("/ia-automatizacion");
  await page.getByRole("button", { name: "Copiloto IA" }).click();

  const dialog = page.getByRole("dialog", { name: "Copiloto IA" });
  await dialog.getByRole("button", { name: "¿Qué es Nautylab?" }).click();

  await expect(dialog.getByText("¿Qué es Nautylab?")).toBeVisible();
  await expect(dialog.getByText("Nautylab es un proyecto real.")).toBeVisible();
  await expect(dialog.getByText("1/15")).toBeVisible();
});

test("si el Worker falla, el error se muestra sin romper el chat", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "El copiloto no está configurado todavía (falta el secret GEMINI_API_KEY).",
      }),
    }),
  );

  await page.goto("/ia-automatizacion");
  await page.getByRole("button", { name: "Copiloto IA" }).click();

  const dialog = page.getByRole("dialog", { name: "Copiloto IA" });
  await dialog.getByRole("button", { name: "¿Qué es Nautylab?" }).click();

  await expect(
    dialog.getByText(/no pudo responder.*falta el secret/),
  ).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: /pregunta/i })).toBeEnabled();
});

test("cierra con Escape y devuelve el foco al botón del dock", async ({
  page,
}) => {
  await page.goto("/ia-automatizacion");
  const toggle = page.getByRole("button", { name: "Copiloto IA" });
  await toggle.click();
  await expect(page.getByRole("dialog", { name: "Copiloto IA" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(toggle).toBeFocused();
});
