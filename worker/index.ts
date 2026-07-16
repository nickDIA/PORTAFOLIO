import { SYSTEM_PROMPT } from "../src/data/systemPrompt";
import { LIMITS, validateChatRequest } from "./validate";

/* ============================================================
   Copiloto IA — Cloudflare Worker como proxy a la API de Claude.

   - La API key vive como secret del Worker (wrangler secret put
     ANTHROPIC_API_KEY) — nunca toca el cliente.
   - El system prompt se genera en build desde src/data/content.ts.
   - Límites de sesión y de tokens de salida aplicados aquí
     (ver worker/validate.ts) — el endpoint es público.
   - La respuesta de Anthropic se transmite tal cual (SSE):
     el Worker no re-parsea el stream, solo lo canaliza.
   ============================================================ */

interface Env {
  ANTHROPIC_API_KEY: string;
  /** Origen permitido para CORS; en producción, el dominio del sitio */
  ALLOWED_ORIGIN?: string;
  /** Override opcional del modelo */
  MODEL?: string;
}

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const corsHeaders = (env: Env): Record<string, string> => ({
  "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
});

const jsonResponse = (
  env: Env,
  status: number,
  payload: Record<string, unknown>,
): Response =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(env) },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat" || request.method !== "POST") {
      return jsonResponse(env, 404, { error: "Ruta no encontrada." });
    }

    const body = await request.json().catch(() => null);
    const validation = validateChatRequest(body);
    if (!validation.ok) {
      return jsonResponse(env, validation.status, { error: validation.error });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse(env, 503, {
        error:
          "El copiloto no está configurado todavía (falta el secret ANTHROPIC_API_KEY).",
      });
    }

    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.MODEL ?? DEFAULT_MODEL,
        max_tokens: LIMITS.maxOutputTokens,
        system: SYSTEM_PROMPT,
        messages: validation.messages,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      /* No filtrar detalles del upstream al cliente; sí al log del Worker */
      console.error(
        "Error de la API de Anthropic:",
        upstream.status,
        await upstream.text().catch(() => "(sin cuerpo)"),
      );
      const status = upstream.status === 429 ? 429 : 502;
      return jsonResponse(env, status, {
        error:
          status === 429
            ? "El copiloto está recibiendo muchas preguntas ahora mismo — intenta en un minuto."
            : "El copiloto no está disponible en este momento.",
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        ...corsHeaders(env),
      },
    });
  },
};
