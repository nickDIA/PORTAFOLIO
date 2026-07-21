import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { headForPath, type HeadData } from "../seo/meta";

/* ============================================================
   Sincroniza en runtime el <head> con la ruta activa: canonical,
   Open Graph, Twitter Card y alternates hreflang. Es el gemelo en
   cliente del prerender (src/seo/meta.ts es la fuente compartida)
   — necesario porque en la SPA la navegación no recarga la página,
   y Google (que sí ejecuta JS) debe ver el <head> de cada ruta.

   El <title> y document.lang los siguen gestionando useDocumentTitle
   y Layout respectivamente; aquí no se tocan para no duplicar
   escrituras. El prerender sí incluye title (los scrapers lo leen
   del HTML estático).
   ============================================================ */

/** Crea o actualiza una etiqueta singleton identificada por un selector. */
function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void,
): void {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

function meta(attr: "name" | "property", key: string, content: string): void {
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(attr, key);
      return el;
    },
    (el) => el.setAttribute("content", content),
  );
}

function applyHead(h: HeadData): void {
  meta("name", "description", h.description);

  upsert(
    'link[rel="canonical"]',
    () => {
      const el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      return el;
    },
    (el) => el.setAttribute("href", h.canonical),
  );

  meta("property", "og:type", "website");
  meta("property", "og:site_name", "DIA");
  meta("property", "og:title", h.title);
  meta("property", "og:description", h.description);
  meta("property", "og:url", h.canonical);
  meta("property", "og:locale", h.ogLocale);
  meta("property", "og:image", h.ogImage);
  meta("name", "twitter:card", "summary_large_image");
  meta("name", "twitter:title", h.title);
  meta("name", "twitter:description", h.description);
  meta("name", "twitter:image", h.ogImage);

  /* hreflang: son varios enlaces — se reemplazan en bloque para no acumular. */
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove());
  for (const alt of h.alternates) {
    const el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", alt.hreflang);
    el.setAttribute("href", alt.href);
    document.head.appendChild(el);
  }
}

/** Aplica el <head> SEO de la ruta activa; se recalcula al navegar. */
export function useHeadMeta(): void {
  const { pathname } = useLocation();
  useEffect(() => {
    applyHead(headForPath(pathname));
  }, [pathname]);
}
