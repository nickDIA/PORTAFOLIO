import { useEffect } from "react";

const BASE = "Dominick Ibarra Acedo — Portafolio";

/** Actualiza el <title> por página (accesibilidad: orientación al navegar). */
export function useDocumentTitle(prefix?: string) {
  useEffect(() => {
    document.title = prefix ? `${prefix} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [prefix]);
}
