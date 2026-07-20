import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axe from "axe-core";
import App from "./App";

/* ============================================================
   Auditoría axe-core por página (WCAG 2.1 A/AA estructural).
   La regla color-contrast se excluye: jsdom no renderiza, así
   que axe no puede computar colores — el contraste se verifica
   manualmente contra los tokens (ver TESTING.md).
   ============================================================ */

const auditar = async (path: string) => {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target).join(", ")}`,
  );
};

afterEach(cleanup);

describe.each([
  ["/"],
  ["/desarrollo-web"],
  ["/servicios-it"],
  ["/ia-automatizacion"],
  ["/en"],
  ["/en/desarrollo-web"],
  ["/en/servicios-it"],
  ["/en/ia-automatizacion"],
])("axe %s", (path) => {
  it("sin violaciones de accesibilidad", async () => {
    expect(await auditar(path)).toEqual([]);
  }, 15000);
});
