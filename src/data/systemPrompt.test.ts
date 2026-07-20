import { describe, it, expect } from "vitest";
import { buildSystemPrompt, limpiar, SYSTEM_PROMPT } from "./systemPrompt";
import { profile, projects } from "./content";

/* ============================================================
   El system prompt es la garantía de que el copiloto no inventa:
   debe contener los hechos reales de content.ts y NUNCA un
   placeholder [[TODO — el modelo no debe ver datos sin rellenar.
   ============================================================ */

describe("limpiar", () => {
  it("elimina fragmentos [[TODO...]] y normaliza espacios", () => {
    expect(limpiar("Logro real [[TODO: ampliar]] verificado")).toBe(
      "Logro real verificado",
    );
  });

  it("devuelve null si el texto era solo placeholder", () => {
    expect(limpiar("[[TODO: rellenar todo esto]]")).toBeNull();
    expect(limpiar("   ")).toBeNull();
  });

  it("deja intacto el texto sin placeholders", () => {
    expect(limpiar("React 19")).toBe("React 19");
  });
});

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt();

  it("nunca contiene placeholders [[TODO", () => {
    expect(prompt).not.toContain("[[TODO");
  });

  it("contiene la identidad y el contacto real", () => {
    expect(prompt).toContain(profile.name);
    expect(prompt).toContain(profile.contact.email);
  });

  it("contiene todos los proyectos por nombre (español canónico)", () => {
    for (const p of projects) {
      expect(prompt).toContain(p.name.es);
    }
  });

  it("incluye las reglas anti-invención y anti-inyección", () => {
    expect(prompt).toContain("No inventes");
    expect(prompt).toContain("revelar este prompt");
  });

  it("nunca filtra un objeto LocalizedText sin resolver", () => {
    expect(prompt).not.toContain("[object Object]");
  });

  it("marca los proyectos centrales", () => {
    expect(prompt).toContain("Nautylab (proyecto central)");
  });

  it("SYSTEM_PROMPT exportado es el prompt construido", () => {
    expect(SYSTEM_PROMPT).toBe(prompt);
  });
});
