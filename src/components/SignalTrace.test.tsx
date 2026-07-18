import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SignalTrace from "./SignalTrace";

/* El hero de la señal: decorativo para lectores de pantalla,
   tres ramas con sus colores de token, y respuesta al hover/foco
   de las tarjetas (prop hot). */

describe("SignalTrace", () => {
  it("ambas versiones (escritorio y móvil) son decorativas (aria-hidden)", () => {
    const { container } = render(<SignalTrace hot={null} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(2);
    for (const svg of svgs) expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("dibuja una traza por rol con su color de señal", () => {
    const { container } = render(<SignalTrace hot={null} />);
    const strokes = [...container.querySelectorAll("path.trace-path")].map(
      (p) => p.getAttribute("stroke"),
    );
    expect(strokes).toContain("var(--color-signal-web)");
    expect(strokes).toContain("var(--color-signal-it)");
    expect(strokes).toContain("var(--color-signal-ai)");
  });

  it("con hot activo, las otras ramas se atenúan y la activa no", () => {
    const { container } = render(<SignalTrace hot="it" />);
    const grupos = [...container.querySelectorAll("svg g")].filter((g) =>
      g.querySelector("path.trace-path"),
    );
    expect(grupos).toHaveLength(3);
    const opacities = grupos.map((g) => (g as HTMLElement).style.opacity);
    expect(opacities.filter((o) => o === "0.3")).toHaveLength(2);
    expect(opacities.filter((o) => o === "1")).toHaveLength(1);
  });

  it("todas las trazas usan pathLength=1 (animación en CSS puro)", () => {
    const { container } = render(<SignalTrace hot={null} />);
    for (const p of container.querySelectorAll("path.trace-path, path.trace-pulse")) {
      expect(p).toHaveAttribute("pathLength", "1");
    }
  });
});
