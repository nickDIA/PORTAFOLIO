import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

/* ============================================================
   Routing + tematización: cada ruta renderiza su página, el
   color de señal tematiza el foco de teclado (--focus-ring) y
   el título del documento, y la estructura accesible base
   (skip-link, nav, main) está presente en todas.
   ============================================================ */

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

afterEach(() => {
  cleanup();
  document.documentElement.style.removeProperty("--focus-ring");
});

describe("landing (/)", () => {
  it("muestra nombre, las tres tarjetas de faceta y contacto", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /Dominick Ibarra Acedo/ }),
    ).toBeInTheDocument();
    /* Acotado a main: los nombres de faceta también están en el nav */
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: /Desarrollo Web/ })).toHaveAttribute(
      "href",
      "/desarrollo-web",
    );
    expect(main.getByRole("link", { name: /Servicios IT/ })).toHaveAttribute(
      "href",
      "/servicios-it",
    );
    expect(
      main.getByRole("link", { name: /IA & Automatización/ }),
    ).toHaveAttribute("href", "/ia-automatizacion");
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("los enlaces de contacto ya rellenos son reales, no chips pendientes", () => {
    renderAt("/");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://"),
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://"),
    );
    expect(screen.queryByText(/pendiente/)).not.toBeInTheDocument();
  });
});

describe.each([
  ["/desarrollo-web", "Desarrollo Web", "var(--color-signal-web)"],
  ["/servicios-it", "Servicios IT", "var(--color-signal-it)"],
  ["/ia-automatizacion", "IA & Automatización", "var(--color-signal-ai)"],
])("página de faceta %s", (path, name, ring) => {
  it(`renderiza "${name}" y tematiza foco y título`, () => {
    renderAt(path);
    expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    expect(
      document.documentElement.style.getPropertyValue("--focus-ring"),
    ).toBe(ring);
    expect(document.title).toContain(name);
  });
});

describe("estructura accesible compartida", () => {
  it("skip-link, navegación y main presentes", () => {
    renderAt("/");
    expect(
      screen.getByRole("link", { name: /Saltar al contenido/ }),
    ).toHaveAttribute("href", "#contenido");
    expect(
      screen.getByRole("navigation", { name: /Navegación principal/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenido");
  });
});
