import { describe, it, expect } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NucleoDemo from "./NucleoDemo";

/* ============================================================
   La demo de Núcleo simula una transacción atómica con pasos
   temporizados (~0.5s entre sí). Estos tests usan timers reales
   y waitFor — el flujo feliz tarda ~1.7s y el rollback ~3.8s.
   ============================================================ */

/* Acotado a la lista de activos: los ids también aparecen en el
   registro de auditoría. */
const getActivoRow = (id: string) => {
  const lista = screen.getByRole("list", { name: "Activos gestionados" });
  const row = within(lista).getByText(id).closest("li");
  expect(row).not.toBeNull();
  return row!;
};

describe("NucleoDemo — estado inicial", () => {
  it("muestra los tres activos con su estado", () => {
    render(<NucleoDemo />);
    for (const id of ["ACT-014", "ACT-027", "ACT-033"]) {
      expect(getActivoRow(id)).toBeInTheDocument();
    }
    expect(within(getActivoRow("ACT-014")).getByText("Operativo")).toBeInTheDocument();
  });

  it("la consola espera y la auditoría trae la entrada semilla", () => {
    render(<NucleoDemo />);
    expect(screen.getByRole("log")).toHaveTextContent("esperando transacción");
    expect(screen.getByText(/Falla reportada por el usuario/)).toBeInTheDocument();
  });
});

describe("NucleoDemo — transacción exitosa", () => {
  it("cambia el estado Y confirma la entrada de auditoría (COMMIT)", async () => {
    const user = userEvent.setup();
    render(<NucleoDemo />);

    const row = getActivoRow("ACT-014");
    await user.click(within(row).getByRole("button", { name: /En mantenimiento/ }));

    /* Secuencia completa en la consola */
    const consola = screen.getByRole("log");
    await waitFor(() => expect(consola).toHaveTextContent("BEGIN TRANSACTION"));
    await waitFor(() => expect(consola).toHaveTextContent("COMMIT"), {
      timeout: 4000,
    });

    /* Ambos efectos visibles: estado nuevo + auditoría confirmada */
    expect(within(getActivoRow("ACT-014")).getByText("En mantenimiento")).toBeInTheDocument();
    const entradas = screen.getAllByText(/ACT-014/);
    expect(entradas.length).toBeGreaterThan(1); // fila + entrada de auditoría
    expect(screen.queryByText(/sin confirmar/)).not.toBeInTheDocument();
  }, 10000);

  it("deshabilita los botones mientras corre la transacción", async () => {
    const user = userEvent.setup();
    render(<NucleoDemo />);

    const row = getActivoRow("ACT-033");
    await user.click(within(row).getByRole("button", { name: /En mantenimiento/ }));

    for (const btn of screen.getAllByRole("button")) {
      expect(btn).toBeDisabled();
    }
    await waitFor(
      () => expect(screen.getByRole("log")).toHaveTextContent("COMMIT"),
      { timeout: 4000 },
    );
    expect(
      within(getActivoRow("ACT-033")).getByRole("button", { name: /De baja/ }),
    ).toBeEnabled();
  }, 10000);
});

describe("NucleoDemo — rollback transaccional", () => {
  it("con forzar error, el estado y la auditoría se revierten JUNTOS", async () => {
    const user = userEvent.setup();
    render(<NucleoDemo />);

    const entradasAntes = screen.getAllByRole("listitem").length;

    const toggle = screen.getByRole("button", { name: /forzar error/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    const row = getActivoRow("ACT-014");
    await user.click(within(row).getByRole("button", { name: /En mantenimiento/ }));

    const consola = screen.getByRole("log");
    await waitFor(() => expect(consola).toHaveTextContent("ERROR simulado"), {
      timeout: 4000,
    });
    await waitFor(() => expect(consola).toHaveTextContent("ROLLBACK"), {
      timeout: 2000,
    });
    await waitFor(
      () => expect(consola).toHaveTextContent("sin cambios parciales"),
      { timeout: 4000 },
    );

    /* Atomicidad: el activo volvió a su estado original... */
    expect(within(getActivoRow("ACT-014")).getByText("Operativo")).toBeInTheDocument();
    /* ...la entrada revertida ya no existe... */
    expect(screen.queryByText(/revertida por rollback/)).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(entradasAntes);
    /* ...y el toggle de error se desarmó solo */
    expect(
      screen.getByRole("button", { name: /forzar error/i }),
    ).toHaveAttribute("aria-pressed", "false");
  }, 15000);
});
