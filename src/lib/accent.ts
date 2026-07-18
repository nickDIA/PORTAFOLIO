import type { RoleId } from "../data/content";

/* ============================================================
   Acentos por rol: el color de señal como sistema.
   Clases Tailwind completas (el compilador necesita verlas
   literales), una sola definición para las tres páginas.
   ============================================================ */

export interface Accent {
  /** texto en color de señal */
  text: string;
  /** fondo tenue del color de señal */
  bgSoft: string;
  /** borde tenue */
  borderSoft: string;
  /** borde pleno */
  border: string;
  /** chip de tecnología */
  chip: string;
  /** var() CSS del color, para SVG y --focus-ring */
  ring: string;
}

export const roleAccent: Record<RoleId, Accent> = {
  web: {
    text: "text-signal-web",
    bgSoft: "bg-signal-web/10",
    borderSoft: "border-signal-web/30",
    border: "border-signal-web",
    chip: "border-signal-web/30 text-signal-web",
    ring: "var(--color-signal-web)",
  },
  it: {
    text: "text-signal-it",
    bgSoft: "bg-signal-it/10",
    borderSoft: "border-signal-it/30",
    border: "border-signal-it",
    chip: "border-signal-it/30 text-signal-it",
    ring: "var(--color-signal-it)",
  },
  ai: {
    text: "text-signal-ai",
    bgSoft: "bg-signal-ai/10",
    borderSoft: "border-signal-ai/30",
    border: "border-signal-ai",
    chip: "border-signal-ai/30 text-signal-ai",
    ring: "var(--color-signal-ai)",
  },
};
