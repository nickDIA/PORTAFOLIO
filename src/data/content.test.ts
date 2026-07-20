import { describe, it, expect } from "vitest";
import {
  roles,
  projects,
  experience,
  profile,
  projectsByRole,
  experienceByRole,
  isPending,
} from "./content";
import type { LocalizedText } from "../i18n/locale";

/* ============================================================
   Integridad de la fuente única de verdad.
   La UI y el system prompt del copiloto asumen estas
   invariantes — si al rellenar los [[TODO se rompe alguna, estos
   tests lo atrapan antes que el navegador.
   ============================================================ */

describe("roles", () => {
  it("existen exactamente los tres roles del diseño", () => {
    expect(roles.map((r) => r.id)).toEqual(["web", "it", "ai"]);
  });

  it("cada slug es una ruta absoluta única", () => {
    const slugs = roles.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^\/[a-z-]+$/);
  });

  it("cada rol usa su token de señal correspondiente", () => {
    expect(roles.find((r) => r.id === "web")?.signalToken).toBe("signal-web");
    expect(roles.find((r) => r.id === "it")?.signalToken).toBe("signal-it");
    expect(roles.find((r) => r.id === "ai")?.signalToken).toBe("signal-ai");
  });
});

describe("proyectos", () => {
  it("todos los ids son únicos", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos pertenecen a un rol existente", () => {
    const roleIds = new Set(roles.map((r) => r.id));
    for (const p of projects) expect(roleIds.has(p.role)).toBe(true);
  });

  it("cada rol tiene exactamente un proyecto central (featured)", () => {
    for (const r of roles) {
      const featured = projects.filter((p) => p.role === r.id && p.featured);
      expect(featured, `rol ${r.id}`).toHaveLength(1);
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

  it("toda captura declara ruta bajo /screenshots y un alt en ambos idiomas", () => {
    for (const p of projects) {
      for (const s of p.screenshots) {
        expect(s.src, `${p.id}: src`).toMatch(/^\/screenshots\//);
        expect(s.alt.es.length, `${p.id}: alt.es vacío`).toBeGreaterThan(0);
        expect(s.alt.en.length, `${p.id}: alt.en vacío`).toBeGreaterThan(0);
      }
    }
  });
});

describe("projectsByRole", () => {
  it("filtra por rol y pone el proyecto central primero", () => {
    for (const r of roles) {
      const list = projectsByRole(r.id);
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((p) => p.role === r.id)).toBe(true);
      expect(list[0].featured).toBe(true);
    }
  });
});

describe("experienceByRole", () => {
  it("la experiencia IT del brief está completa", () => {
    const ids = experienceByRole("it").map((e) => e.id);
    expect(ids).toContain("ayuntamiento");
    expect(ids).toContain("freelance-it");
    expect(ids).toContain("liderazgo-operativo");
  });

  it("todas las experiencias pertenecen a roles existentes", () => {
    const roleIds = new Set(roles.map((r) => r.id));
    for (const e of experience) expect(roleIds.has(e.role)).toBe(true);
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

/* ============================================================
   Bilingüismo: cada campo LocalizedText debe traer es Y en no
   vacíos — un placeholder [[TODO sin rellenar cuenta como
   "presente" (es intencional, ver content.ts), pero un campo
   real nunca debe quedar vacío en ningún idioma.
   ============================================================ */

const nonEmpty = (field: LocalizedText, where: string) => {
  expect(field.es.length, `${where}.es vacío`).toBeGreaterThan(0);
  expect(field.en.length, `${where}.en vacío`).toBeGreaterThan(0);
};

describe("bilingüe", () => {
  it("perfil: tagline, intro, location y cvNote traen ambos idiomas", () => {
    nonEmpty(profile.title, "profile.title");
    nonEmpty(profile.tagline, "profile.tagline");
    nonEmpty(profile.intro, "profile.intro");
    nonEmpty(profile.location, "profile.location");
    nonEmpty(profile.contact.cvNote, "profile.contact.cvNote");
  });

  it("cada rol trae name, tagline y description en ambos idiomas", () => {
    for (const r of roles) {
      nonEmpty(r.name, `role ${r.id}.name`);
      nonEmpty(r.tagline, `role ${r.id}.tagline`);
      nonEmpty(r.description, `role ${r.id}.description`);
    }
  });

  it("cada proyecto trae sus campos de prosa en ambos idiomas", () => {
    for (const p of projects) {
      nonEmpty(p.name, `project ${p.id}.name`);
      nonEmpty(p.title, `project ${p.id}.title`);
      nonEmpty(p.summary, `project ${p.id}.summary`);
      nonEmpty(p.description, `project ${p.id}.description`);
      for (const [i, a] of p.achievements.entries()) {
        nonEmpty(a, `project ${p.id}.achievements[${i}]`);
      }
    }
  });

  it("cada experiencia trae organization, title y description en ambos idiomas", () => {
    for (const e of experience) {
      nonEmpty(e.organization, `experience ${e.id}.organization`);
      nonEmpty(e.title, `experience ${e.id}.title`);
      nonEmpty(e.description, `experience ${e.id}.description`);
    }
  });

  it("los placeholders [[TODO están sincronizados entre es y en (mismo estado pendiente)", () => {
    for (const p of projects) {
      expect(isPending(p.period.es), `${p.id}.period`).toBe(
        isPending(p.period.en),
      );
    }
  });
});
