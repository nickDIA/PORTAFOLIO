import { createContext, createElement, useContext, type ReactNode } from "react";

/* ============================================================
   Núcleo de i18n: contexto de idioma + helpers de ruta.
   El español es el idioma canónico (sin prefijo); el inglés
   vive bajo /en — cada página tiene una URL propia por idioma,
   compartible directamente (ver decisión en memoria del proyecto).

   Sin JSX a propósito (createElement en vez de <Provider>): este
   módulo lo importan tanto la app (React) como content.ts/
   systemPrompt.ts, que el Worker también compila sin --jsx.
   ============================================================ */

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

/** Texto con una entrada por idioma soportado — la unidad básica de contenido traducible. */
export type LocalizedText = Record<Locale, string>;

const LocaleContext = createContext<Locale>("es");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return createElement(LocaleContext.Provider, { value: locale }, children);
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Resuelve un LocalizedText al idioma actual. */
export function useT() {
  const locale = useLocale();
  return (field: LocalizedText): string => field[locale];
}

/**
 * Antepone /en a una ruta si el idioma es inglés; el español no lleva
 * prefijo. Úsalo para construir cualquier link interno.
 */
export function localizePath(path: string, locale: Locale): string {
  if (locale === "es") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/**
 * Quita el prefijo /en de una ruta actual — la ruta española
 * equivalente. Úsalo para construir el link al otro idioma desde
 * la página en la que ya estás.
 */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}
