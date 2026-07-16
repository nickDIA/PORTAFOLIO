import { describe, it, expect } from "vitest";
import {
  facets,
  projects,
  experience,
  profile,
  projectsByFacet,
  experienceByFacet,
  isPending,
} from "./content";

/* ============================================================
   Integridad de la fuente única de verdad.
   La UI y (en Fase 5) el system prompt del copiloto asumen estas
   invariantes — si al rellenar los [[TODO se rompe alguna, estos
   tests lo atrapan antes que el navegador.
   ============================================================ */

describe("facetas", () => {
  it("existen exactamente las tres facetas del diseño", () => {
    expect(facets.map((f) => f.id)).toEqual(["web", "it", "ai"]);
  });

  it("cada slug es una ruta absoluta única", () => {
    const slugs = facets.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^\/[a-z-]+$/);
  });

  it("cada faceta usa su token de señal correspondiente", () => {
    expect(facets.find((f) => f.id === "web")?.signalToken).toBe("signal-web");
    expect(facets.find((f) => f.id === "it")?.signalToken).toBe("signal-it");
    expect(facets.find((f) => f.id === "ai")?.signalToken).toBe("signal-ai");
  });
});

describe("proyectos", () => {
  it("todos los ids son únicos", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos pertenecen a una faceta existente", () => {
    const facetIds = new Set(facets.map((f) => f.id));
    for (const p of projects) expect(facetIds.has(p.facet)).toBe(true);
  });

  it("cada faceta tiene exactamente un proyecto central (featured)", () => {
    for (const f of facets) {
      const featured = projects.filter((p) => p.facet === f.id && p.featured);
      expect(featured, `faceta ${f.id}`).toHaveLength(1);
    }
  });

  it("los proyectos clave del brief existen", () => {
    const ids = projects.map((p) => p.id);
    expect(ids).toContain("nautylab");
    expect(ids).toContain("nucleo");
    expect(ids).toContain("copiloto-ia");
    expect(ids).toContain("integracion-gemini");
    expect(ids).toContain("alexa-skill");
  });

  it("toda captura declara ruta bajo /screenshots y un alt", () => {
    for (const p of projects) {
      for (const s of p.screenshots) {
        expect(s.src, `${p.id}: src`).toMatch(/^\/screenshots\//);
        expect(s.alt.length, `${p.id}: alt vacío`).toBeGreaterThan(0);
      }
    }
  });
});

describe("projectsByFacet", () => {
  it("filtra por faceta y pone el proyecto central primero", () => {
    for (const f of facets) {
      const list = projectsByFacet(f.id);
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((p) => p.facet === f.id)).toBe(true);
      expect(list[0].featured).toBe(true);
    }
  });
});

describe("experienceByFacet", () => {
  it("la experiencia IT del brief está completa", () => {
    const ids = experienceByFacet("it").map((e) => e.id);
    expect(ids).toContain("ayuntamiento");
    expect(ids).toContain("freelance-it");
    expect(ids).toContain("liderazgo-operativo");
  });

  it("todas las experiencias pertenecen a facetas existentes", () => {
    const facetIds = new Set(facets.map((f) => f.id));
    for (const e of experience) expect(facetIds.has(e.facet)).toBe(true);
  });
});

describe("isPending", () => {
  it("detecta placeholders [[TODO", () => {
    expect(isPending("[[TODO: rellenar]]")).toBe(true);
    expect(isPending("texto con [[TODO adentro]]")).toBe(true);
    expect(isPending("https://github.com/usuario")).toBe(false);
    expect(isPending("")).toBe(false);
  });
});

describe("perfil", () => {
  it("los datos ya confirmados no son placeholders", () => {
    expect(isPending(profile.name)).toBe(false);
    expect(isPending(profile.contact.email)).toBe(false);
    expect(profile.contact.email).toContain("@");
  });
});
