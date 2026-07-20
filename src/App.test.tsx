import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

/* ============================================================
   Routing + tematización + bilingüismo: cada ruta renderiza su
   página en el idioma correcto (español sin prefijo, inglés bajo
   /en), el color de señal tematiza el foco de teclado y el
   título del documento, y la estructura accesible base está
   presente en ambos árboles de rutas.
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
  it("muestra nombre, las tres tarjetas de rol y contacto en español", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /Dominick Ibarra Acedo/ }),
    ).toBeInTheDocument();
    /* Acotado a main: los nombres de rol también están en el nav */
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

describe("landing (/en)", () => {
  it("muestra las tres tarjetas de rol traducidas al inglés", () => {
    renderAt("/en");
    expect(
      screen.getByRole("heading", { level: 1, name: /Dominick Ibarra Acedo/ }),
    ).toBeInTheDocument();
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: /Web Development/ })).toHaveAttribute(
      "href",
      "/en/desarrollo-web",
    );
    expect(main.getByRole("link", { name: /IT Services/ })).toHaveAttribute(
      "href",
      "/en/servicios-it",
    );
    expect(
      main.getByRole("link", { name: /AI & Automation/ }),
    ).toHaveAttribute("href", "/en/ia-automatizacion");
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});

describe.each([
  ["/desarrollo-web", "Desarrollo Web", "var(--color-signal-web)"],
  ["/servicios-it", "Servicios IT", "var(--color-signal-it)"],
  ["/ia-automatizacion", "IA & Automatización", "var(--color-signal-ai)"],
])("página de rol %s (español)", (path, name, ring) => {
  it(`renderiza "${name}" y tematiza foco y título`, () => {
    renderAt(path);
    expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    expect(
      document.documentElement.style.getPropertyValue("--focus-ring"),
    ).toBe(ring);
    expect(document.title).toContain(name);
  });
});

describe.each([
  ["/en/desarrollo-web", "Web Development", "var(--color-signal-web)"],
  ["/en/servicios-it", "IT Services", "var(--color-signal-it)"],
  ["/en/ia-automatizacion", "AI & Automation", "var(--color-signal-ai)"],
])("página de rol %s (inglés)", (path, name, ring) => {
  it(`renderiza "${name}" y tematiza foco y título`, () => {
    renderAt(path);
    expect(screen.getByRole("heading", { level: 1, name })).toBeInTheDocument();
    expect(
      document.documentElement.style.getPropertyValue("--focus-ring"),
    ).toBe(ring);
    expect(document.title).toContain(name);
  });
});

describe("selector de idioma", () => {
  it("en / ofrece un link a la versión en inglés de la misma página", () => {
    renderAt("/servicios-it");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en/servicios-it",
    );
  });

  it("en /en ofrece un link a la versión en español de la misma página", () => {
    renderAt("/en/servicios-it");
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
      "href",
      "/servicios-it",
    );
  });

  it("el link de idioma en la raíz apunta a /en, no a /en/", () => {
    renderAt("/");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
  });
});

describe("estructura accesible compartida", () => {
  it("skip-link, navegación y main presentes en español", () => {
    renderAt("/");
    expect(
      screen.getByRole("link", { name: /Saltar al contenido/ }),
    ).toHaveAttribute("href", "#contenido");
    expect(
      screen.getByRole("navigation", { name: /Navegación principal/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenido");
  });

  it("skip-link, navegación y main presentes en inglés, y traducidos", () => {
    renderAt("/en");
    expect(
      screen.getByRole("link", { name: /Skip to content/ }),
    ).toHaveAttribute("href", "#contenido");
    expect(
      screen.getByRole("navigation", { name: /Main navigation/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenido");
  });

  it("document.documentElement.lang sigue la ruta actual", () => {
    renderAt("/");
    expect(document.documentElement.lang).toBe("es");
    cleanup();
    renderAt("/en");
    expect(document.documentElement.lang).toBe("en");
  });
});
