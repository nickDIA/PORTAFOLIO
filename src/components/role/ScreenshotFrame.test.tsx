import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ScreenshotFrame from "./ScreenshotFrame";
import { roleAccent } from "../../lib/accent";

/* El sitio nunca debe mostrar una imagen rota: capturas con alt
   pendiente ([[TODO) o que fallan al cargar caen al marco punteado. */

describe("ScreenshotFrame", () => {
  it("alt pendiente [[TODO → marco pendiente con la ruta esperada", () => {
    render(
      <ScreenshotFrame
        shot={{
          src: "/screenshots/nucleo-1.png",
          alt: { es: "[[TODO: describir]]", en: "[[TODO: describe]]" },
        }}
        accent={roleAccent.it}
      />,
    );
    expect(screen.getByText("[ captura pendiente ]")).toBeInTheDocument();
    expect(screen.getByText("public/screenshots/nucleo-1.png")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("captura real → renderiza la imagen con alt (locale por defecto: es) y lazy loading", () => {
    render(
      <ScreenshotFrame
        shot={{
          src: "/screenshots/real.png",
          alt: { es: "Vista del panel", en: "Panel view" },
        }}
        accent={roleAccent.web}
      />,
    );
    const img = screen.getByRole("img", { name: "Vista del panel" });
    expect(img).toHaveAttribute("src", "/screenshots/real.png");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("si la imagen falla al cargar, cae al marco pendiente", () => {
    render(
      <ScreenshotFrame
        shot={{
          src: "/screenshots/rota.png",
          alt: { es: "Captura que no existe", en: "Screenshot doesn't exist" },
        }}
        accent={roleAccent.web}
      />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("[ captura pendiente ]")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
