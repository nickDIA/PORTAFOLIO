/* ============================================================
   Validación de peticiones al copiloto — módulo puro (sin
   dependencias del runtime de Workers) para poder probarlo
   con Vitest.

   Los límites son la decisión de ingeniería de costos del brief:
   el endpoint es público, así que el tope de mensajes por sesión
   y de tokens de salida se aplican EN EL SERVIDOR — el contador
   del cliente es solo UX.
   ============================================================ */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const LIMITS = {
  /** Mensajes del visitante por conversación */
  maxUserMessages: 15,
  /** Longitud máxima de cada mensaje (caracteres) */
  maxMessageChars: 1000,
  /** Mensajes totales (user + assistant) aceptados en el historial */
  maxTotalMessages: 40,
  /** Tope de tokens de salida por respuesta */
  maxOutputTokens: 512,
} as const;

export type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; status: number; error: string };

const fail = (status: number, error: string): ValidationResult => ({
  ok: false,
  status,
  error,
});

export function validateChatRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return fail(400, "El cuerpo debe ser JSON con un campo 'messages'.");
  }

  const { messages } = body as { messages: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return fail(400, "'messages' debe ser un arreglo no vacío.");
  }
  if (messages.length > LIMITS.maxTotalMessages) {
    return fail(400, "Historial demasiado largo.");
  }

  const validated: ChatMessage[] = [];
  for (const m of messages) {
    if (
      typeof m !== "object" ||
      m === null ||
      !("role" in m) ||
      !("content" in m)
    ) {
      return fail(400, "Cada mensaje necesita 'role' y 'content'.");
    }
    const { role, content } = m as { role: unknown; content: unknown };
    if (role !== "user" && role !== "assistant") {
      return fail(400, "Rol inválido: solo 'user' o 'assistant'.");
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return fail(400, "El contenido de cada mensaje debe ser texto no vacío.");
    }
    if (content.length > LIMITS.maxMessageChars) {
      return fail(
        400,
        `Mensaje demasiado largo (máximo ${LIMITS.maxMessageChars} caracteres).`,
      );
    }
    validated.push({ role, content });
  }

  if (validated[validated.length - 1].role !== "user") {
    return fail(400, "El último mensaje debe ser del visitante.");
  }

  const userCount = validated.filter((m) => m.role === "user").length;
  if (userCount > LIMITS.maxUserMessages) {
    return fail(
      429,
      `Límite de sesión alcanzado (${LIMITS.maxUserMessages} mensajes). Escríbeme por email para continuar la conversación.`,
    );
  }

  return { ok: true, messages: validated };
}
