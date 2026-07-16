import { useEffect, useRef, useState } from "react";

/* ============================================================
   Copiloto IA — dock persistente (no modal).
   Vive en el Layout: acompaña todas las rutas sin bloquear la
   página. Habla con el Cloudflare Worker (/api/chat), que hace
   proxy a la API de Claude con el system prompt generado desde
   content.ts.

   El límite real de mensajes lo aplica el Worker; el contador
   local es UX para que el visitante sepa dónde está parado.
   ============================================================ */

const ENDPOINT = import.meta.env.VITE_COPILOT_URL ?? "/api/chat";
const MAX_USER_MESSAGES = 15;
const STORAGE_KEY = "copiloto-conversacion";

interface Msg {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGERENCIAS = [
  "¿Qué es Nautylab?",
  "¿Qué experiencia tiene en IT?",
  "¿Cómo ha integrado IA en sus proyectos?",
];

function cargarConversacion(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Msg[]) : [];
  } catch {
    return [];
  }
}

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(cargarConversacion);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const userCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userCount >= MAX_USER_MESSAGES;

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    const log = logRef.current;
    if (log && typeof log.scrollTo === "function") {
      log.scrollTo(0, log.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function cerrar() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  /** Añade texto al último mensaje (el del asistente en curso). */
  const appendToLast = (texto: string) =>
    setMessages((h) => {
      const copia = [...h];
      const ultimo = copia[copia.length - 1];
      copia[copia.length - 1] = { ...ultimo, content: ultimo.content + texto };
      return copia;
    });

  async function enviar(texto: string) {
    const contenido = texto.trim();
    if (!contenido || streaming || limitReached) return;

    /* El historial hacia el Worker excluye mensajes de error locales */
    const historial = [
      ...messages.filter((m) => !m.error),
      { role: "user" as const, content: contenido },
    ];
    setMessages((h) => [
      ...h,
      { role: "user", content: contenido },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: historial.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const detalle = await res
          .json()
          .then((d: { error?: string }) => d.error)
          .catch(() => undefined);
        throw new Error(detalle ?? `HTTP ${res.status}`);
      }

      /* Parseo del stream SSE de la API de Claude */
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const eventos = buffer.split("\n\n");
        buffer = eventos.pop() ?? "";
        for (const evento of eventos) {
          for (const lineaRaw of evento.split("\n")) {
            if (!lineaRaw.startsWith("data:")) continue;
            try {
              const data = JSON.parse(lineaRaw.slice(5).trim()) as {
                type?: string;
                delta?: { type?: string; text?: string };
              };
              if (
                data.type === "content_block_delta" &&
                data.delta?.type === "text_delta" &&
                data.delta.text
              ) {
                appendToLast(data.delta.text);
              }
            } catch {
              /* líneas no-JSON (pings, event:) se ignoran */
            }
          }
        }
      }
    } catch (err) {
      const detalle =
        err instanceof Error && err.message ? err.message : "error de red";
      setMessages((h) => {
        const copia = [...h];
        copia[copia.length - 1] = {
          role: "assistant",
          content: `El copiloto no pudo responder (${detalle}).`,
          error: true,
        };
        return copia;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          id="copiloto-panel"
          role="dialog"
          aria-label="Copiloto IA"
          onKeyDown={(e) => {
            if (e.key === "Escape") cerrar();
          }}
          className="flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-signal-ai/30 bg-surface shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-signal-ai/20 px-4 py-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-signal-ai">
                Copiloto IA
              </h2>
              <p className="font-mono text-[11px] text-text-muted">
                respuestas ancladas a los datos de este sitio
              </p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar copiloto"
              className="rounded px-2 py-1 font-mono text-sm text-text-muted transition-colors hover:text-text"
            >
              ✕
            </button>
          </header>

          {/* Mensajes */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Conversación con el copiloto"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-text-muted">
                  Pregúntame por la experiencia y los proyectos de Dominick —
                  respondo solo con datos reales del portafolio.
                </p>
                <ul className="space-y-2">
                  {SUGERENCIAS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => enviar(s)}
                        className="w-full rounded border border-signal-ai/30 px-3 py-2 text-left font-mono text-xs text-signal-ai transition-colors hover:bg-signal-ai/10"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-signal-ai/15 text-text"
                      : m.error
                        ? "border border-danger/40 text-danger"
                        : "bg-ink text-text"
                  }`}
                >
                  {m.content ||
                    (streaming && i === messages.length - 1 ? "…" : "")}
                </p>
              ))
            )}
          </div>

          {/* Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enviar(input);
            }}
            className="border-t border-signal-ai/20 p-3"
          >
            {limitReached ? (
              <p className="px-1 py-2 font-mono text-xs text-text-muted">
                Límite de la sesión alcanzado ({MAX_USER_MESSAGES} mensajes) —
                escríbeme por email para continuar.
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={streaming}
                  maxLength={1000}
                  aria-label="Escribe tu pregunta"
                  placeholder={streaming ? "respondiendo…" : "Escribe tu pregunta"}
                  className="min-w-0 flex-1 rounded border border-text/15 bg-ink px-3 py-2 text-sm placeholder:text-text-muted disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={streaming || input.trim().length === 0}
                  className="rounded border border-signal-ai/40 px-3 py-2 font-mono text-xs text-signal-ai transition-colors hover:bg-signal-ai/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  enviar
                </button>
              </div>
            )}
            <p className="mt-2 px-1 text-right font-mono text-[11px] text-text-muted">
              {userCount}/{MAX_USER_MESSAGES}
            </p>
          </form>
        </section>
      )}

      {/* Botón del dock */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => (open ? cerrar() : setOpen(true))}
        aria-expanded={open}
        aria-controls="copiloto-panel"
        className="flex items-center gap-2 rounded-full border border-signal-ai/40 bg-surface px-4 py-2.5 font-mono text-sm text-signal-ai shadow-lg transition-colors hover:bg-signal-ai/10"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 rounded-full bg-signal-ai"
        />
        Copiloto IA
      </button>
    </div>
  );
}
