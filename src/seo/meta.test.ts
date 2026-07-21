import { describe, it, expect } from "vitest";
import {
  ROUTES,
  SITE_URL,
  headForPath,
  renderHeadTags,
  renderSitemap,
} from "./meta";
import { landing, profile, roles } from "../data/content";

/* ============================================================
   meta.ts es la fuente única del <head> por ruta — la consumen
   tanto el hook de runtime como el prerender. Estas pruebas fijan
   sus invariantes: una entrada por cada una de las 8 rutas, título
   y descripción localizados, canonical/alternates absolutos y
   coherentes, y serialización a HTML sin fugas de comillas.
   ============================================================ */

describe("ROUTES", () => {
  it("cubre home + 3 roles + sobre mí en ambos idiomas (10 rutas únicas)", () => {
    expect(ROUTES).toHaveLength(10);
    expect(new Set(ROUTES).size).toBe(10);
    expect(ROUTES).toEqual(
      expect.arrayContaining([
        "/",
        "/desarrollo-web",
        "/servicios-it",
        "/ia-automatizacion",
        "/sobre-mi",
        "/en",
        "/en/desarrollo-web",
        "/en/servicios-it",
        "/en/ia-automatizacion",
        "/en/sobre-mi",
      ]),
    );
  });
});

describe("headForPath — home", () => {
  it("español: título base y descripción en lenguaje de cliente (landing)", () => {
    const h = headForPath("/");
    expect(h.lang).toBe("es");
    expect(h.title).toBe("Dominick Ibarra Acedo — Portafolio");
    expect(h.description).toBe(landing.hero.sub.es);
    expect(h.canonical).toBe(`${SITE_URL}/`);
    expect(h.ogLocale).toBe("es_ES");
  });

  it("inglés (/en): descripción de landing en inglés y canonical con prefijo", () => {
    const h = headForPath("/en");
    expect(h.lang).toBe("en");
    expect(h.description).toBe(landing.hero.sub.en);
    expect(h.canonical).toBe(`${SITE_URL}/en`);
    expect(h.ogLocale).toBe("en_US");
  });
});

describe("headForPath — páginas de rol", () => {
  it.each(roles)("$slug tematiza título y descripción por idioma", (role) => {
    const es = headForPath(role.slug);
    expect(es.lang).toBe("es");
    expect(es.title).toBe(`${role.name.es} · Dominick Ibarra Acedo — Portafolio`);
    expect(es.description).toBe(role.description.es);
    expect(es.canonical).toBe(`${SITE_URL}${role.slug}`);

    const en = headForPath(`/en${role.slug}`);
    expect(en.lang).toBe("en");
    expect(en.title).toBe(`${role.name.en} · Dominick Ibarra Acedo — Portafolio`);
    expect(en.description).toBe(role.description.en);
    expect(en.canonical).toBe(`${SITE_URL}/en${role.slug}`);
  });
});

describe("headForPath — página Sobre mí", () => {
  it("título y descripción usan el contenido de about, no el genérico de home", () => {
    const es = headForPath("/sobre-mi");
    expect(es.title).toBe("Sobre mí · Dominick Ibarra Acedo — Portafolio");
    expect(es.description).not.toBe(profile.tagline.es);
    expect(es.canonical).toBe(`${SITE_URL}/sobre-mi`);

    const en = headForPath("/en/sobre-mi");
    expect(en.title).toBe("About me · Dominick Ibarra Acedo — Portafolio");
    expect(en.canonical).toBe(`${SITE_URL}/en/sobre-mi`);
  });
});

describe("headForPath — invariantes transversales", () => {
  it("og:image siempre absoluto y sobre el mismo dominio", () => {
    for (const path of ROUTES) {
      const h = headForPath(path);
      expect(h.ogImage).toBe(`${SITE_URL}/og-image.png`);
    }
  });

  it("alternates apuntan es↔en de la MISMA página; x-default = español", () => {
    const h = headForPath("/en/servicios-it");
    const byLang = Object.fromEntries(
      h.alternates.map((a) => [a.hreflang, a.href]),
    );
    expect(byLang.es).toBe(`${SITE_URL}/servicios-it`);
    expect(byLang.en).toBe(`${SITE_URL}/en/servicios-it`);
    expect(byLang["x-default"]).toBe(byLang.es);
  });

  it("tolera barra final (/en/ y /servicios-it/)", () => {
    expect(headForPath("/en/").lang).toBe("en");
    expect(headForPath("/servicios-it/").canonical).toBe(
      `${SITE_URL}/servicios-it`,
    );
  });
});

describe("renderHeadTags", () => {
  it("incluye title, description, canonical, OG, Twitter y los 3 hreflang", () => {
    const html = renderHeadTags(headForPath("/desarrollo-web"));
    expect(html).toContain("<title>");
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('name="twitter:card"');
    expect(html.match(/hreflang=/g)).toHaveLength(3);
  });

  it("escapa comillas y ángulos para no romper el atributo/HTML", () => {
    const html = renderHeadTags({
      lang: "es",
      title: 'A "B" <C>',
      description: 'x "y" <z>',
      canonical: `${SITE_URL}/`,
      ogLocale: "es_ES",
      ogImage: `${SITE_URL}/og-image.png`,
      alternates: [],
    });
    expect(html).toContain("&quot;");
    expect(html).toContain("&lt;");
    expect(html).not.toContain('"B"');
  });
});

describe("renderSitemap", () => {
  it("lista las 10 rutas como URLs absolutas en XML válido", () => {
    const xml = renderSitemap();
    expect(xml).toContain("<?xml");
    expect(xml).toContain("<urlset");
    expect(xml.match(/<loc>/g)).toHaveLength(10);
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`); // home sin barra final
    expect(xml).toContain(`<loc>${SITE_URL}/en/servicios-it</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/en/sobre-mi</loc>`);
  });
});
