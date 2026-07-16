import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatDock from "./ChatDock";

/* ============================================================
   El dock del copiloto: apertura/cierre accesible, envío con
   streaming SSE (fetch mockeado), manejo de error del Worker y
   límite de sesión en la UI.
   ============================================================ */

/** Construye un stream SSE como el que emite la API de Claude. */
function sseStream(fragmentos: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const texto of fragmentos) {
        const data = JSON.stringify({
          type: "content_block_delta",
          delta: { type: "text_delta", text: texto },
        });
        controller.enqueue(
          enc.encode(`event: content_block_delta\ndata: ${data}\n\n`),
        );
      }
      controller.enqueue(enc.encode('event: message_stop\ndata: {"type":"message_stop"}\n\n'));
      controller.close();
    },
  });
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ChatDock — apertura y cierre accesibles", () => {
  it("abre con el botón, enfoca el input, y cierra con Escape devolviendo el foco", async () => {
    const user = userEvent.setup();
    render(<ChatDock />);

    const toggle = screen.getByRole("button", { name: /Copiloto IA/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Copiloto IA" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /pregunta/i })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it("muestra sugerencias cuando la conversación está vacía", async () => {
    const user = userEvent.setup();
    render(<ChatDock />);
    await user.click(screen.getByRole("button", { name: /Copiloto IA/ }));
    expect(screen.getByRole("button", { name: "¿Qué es Nautylab?" })).toBeInTheDocument();
  });
});

describe("ChatDock — envío con streaming", () => {
  it("muestra el mensaje del usuario y la respuesta streameada completa", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(sseStream(["Nautylab es ", "un proyecto ", "real."]), {
          status: 200,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<ChatDock />);

    await user.click(screen.getByRole("button", { name: /Copiloto IA/ }));
    await user.type(
      screen.getByRole("textbox", { name: /pregunta/i }),
      "¿Qué es Nautylab?",
    );
    await user.click(screen.getByRole("button", { name: "enviar" }));

    expect(screen.getByText("¿Qué es Nautylab?")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Nautylab es un proyecto real.")).toBeInTheDocument(),
    );
    /* El contador refleja 1 mensaje usado */
    expect(screen.getByText("1/15")).toBeInTheDocument();
    /* El payload al Worker es el esperado */
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/chat");
    expect(JSON.parse(init.body as string)).toEqual({
      messages: [{ role: "user", content: "¿Qué es Nautylab?" }],
    });
  });

  it("si el Worker responde error, lo muestra sin romper el chat", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "El copiloto no está configurado todavía (falta el secret ANTHROPIC_API_KEY)." }), {
          status: 503,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<ChatDock />);

    await user.click(screen.getByRole("button", { name: /Copiloto IA/ }));
    await user.click(screen.getByRole("button", { name: "¿Qué es Nautylab?" }));

    await waitFor(() =>
      expect(
        screen.getByText(/El copiloto no pudo responder .*falta el secret/),
      ).toBeInTheDocument(),
    );
    /* El input sigue disponible para reintentar */
    expect(screen.getByRole("textbox", { name: /pregunta/i })).toBeEnabled();
  });
});

describe("ChatDock — límite de sesión", () => {
  it("con 15 mensajes usados, la entrada se reemplaza por el aviso de límite", async () => {
    const conversacion = Array.from({ length: 15 }, (_, i) => ({
      role: "user",
      content: `pregunta ${i}`,
    }));
    sessionStorage.setItem("copiloto-conversacion", JSON.stringify(conversacion));

    const user = userEvent.setup();
    render(<ChatDock />);
    await user.click(screen.getByRole("button", { name: /Copiloto IA/ }));

    expect(screen.getByText(/Límite de la sesión alcanzado/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("15/15")).toBeInTheDocument();
  });

  it("la conversación persiste en sessionStorage entre montajes", async () => {
    sessionStorage.setItem(
      "copiloto-conversacion",
      JSON.stringify([
        { role: "user", content: "hola" },
        { role: "assistant", content: "Hola, pregúntame por Dominick." },
      ]),
    );
    const user = userEvent.setup();
    render(<ChatDock />);
    await user.click(screen.getByRole("button", { name: /Copiloto IA/ }));
    expect(
      screen.getByText("Hola, pregúntame por Dominick."),
    ).toBeInTheDocument();
  });
});
