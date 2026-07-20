/* ============================================================
   SEO — FUENTE ÚNICA DE VERDAD DEL <head> POR RUTA
   ------------------------------------------------------------
   Un solo módulo calcula título, descripción, canonical, Open
   Graph, Twitter Card y alternates hreflang para cada una de las
   8 rutas (4 español + 4 inglés). Lo consumen DOS lados:

     • En cliente: el hook useHeadMeta() (SPA — al navegar sin
       recarga hay que actualizar el <head> en runtime, sobre
       todo para Google, que sí ejecuta JS).
     • En build: scripts/prerender.mjs, que congela estas mismas
       etiquetas en HTML estático por ruta — porque los scrapers
       de previsualización social (Facebook, LinkedIn, WhatsApp)
       NO ejecutan JS y solo verían el index.html base.

   Sin JSX ni dependencias de React/DOM: el script de prerender
   lo importa en Node vía Vite (ssrLoadModule).
   ============================================================ */

import { profile, roles } from "../data/content";
import { LOCALES, localizePath, stripLocalePrefix, type Locale } from "../i18n/locale";

/** Dominio canónico de producción; sobreescribible por entorno (Cloudflare Pages). */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://portafolio-ccq.pages.dev"
).replace(/\/+$/, "");

/** Imagen de previsualización de marca (1200×630) — ver public/og-image.png. */
export const OG_IMAGE_PATH = "/og-image.png";

const BASE_TITLE = "Dominick Ibarra Acedo — Portafolio";

/** Locale → etiqueta og:locale (idioma_REGIÓN). */
const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_US" };

/** Las 8 rutas reales del sitio (home + 3 roles) × (es, en). */
export const ROUTES: string[] = LOCALES.flatMap((locale) =>
  ["/", ...roles.map((r) => r.slug)].map((path) => localizePath(path, locale)),
);

export interface HeadData {
  lang: Locale;
  title: string;
  description: string;
  /** URL absoluta canónica de esta ruta en su idioma. */
  canonical: string;
  ogLocale: string;
  ogImage: string;
  /** Enlaces hreflang: español, inglés y x-default (español canónico). */
  alternates: { hreflang: string; href: string }[];
}

/** Quita la barra final salvo en la raíz, para comparar slugs de forma estable. */
function normalize(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

/** Resuelve todos los datos de <head> para un pathname (con o sin prefijo /en). */
export function headForPath(pathname: string): HeadData {
  const path = normalize(pathname);
  const locale: Locale = path === "/en" || path.startsWith("/en/") ? "en" : "es";
  const basePath = stripLocalePrefix(path); // "/", "/desarrollo-web", …
  const role = roles.find((r) => r.slug === basePath);

  const title = role ? `${role.name[locale]} · ${BASE_TITLE}` : BASE_TITLE;
  const description = role
    ? role.description[locale]
    : profile.tagline[locale];

  const esHref = SITE_URL + basePath;
  const enHref = SITE_URL + localizePath(basePath, "en");

  return {
    lang: locale,
    title,
    description,
    canonical: SITE_URL + localizePath(basePath, locale),
    ogLocale: OG_LOCALE[locale],
    ogImage: SITE_URL + OG_IMAGE_PATH,
    alternates: [
      { hreflang: "es", href: esHref },
      { hreflang: "en", href: enHref },
      { hreflang: "x-default", href: esHref },
    ],
  };
}

/* ------------------- Serialización a HTML (prerender) ------------------- */

const escapeAttr = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Renderiza el bloque de etiquetas gestionadas del <head> como HTML.
 * Lo usa el prerender para inyectar entre los marcadores SEO de index.html.
 * DEBE producir las mismas etiquetas que useHeadMeta() escribe en runtime.
 */
export function renderHeadTags(head: HeadData): string {
  const tags = [
    `<title>${escapeAttr(head.title)}</title>`,
    `<meta name="description" content="${escapeAttr(head.description)}" />`,
    `<link rel="canonical" href="${head.canonical}" />`,
    ...head.alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
    ),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Dominick Ibarra Acedo" />`,
    `<meta property="og:title" content="${escapeAttr(head.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(head.description)}" />`,
    `<meta property="og:url" content="${head.canonical}" />`,
    `<meta property="og:locale" content="${head.ogLocale}" />`,
    `<meta property="og:image" content="${head.ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(head.description)}" />`,
    `<meta name="twitter:image" content="${head.ogImage}" />`,
  ];
  return tags.join("\n    ");
}

/** sitemap.xml con las 8 rutas absolutas — lo emite el prerender. */
export function renderSitemap(): string {
  const urls = ROUTES.map((path) => {
    const href = SITE_URL + (path === "/" ? "" : path);
    return `  <url><loc>${href}</loc></url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
