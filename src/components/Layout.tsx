import { NavLink, Outlet } from "react-router-dom";
import { facets } from "../data/content";
import ChatDock from "./copilot/ChatDock";

/* Mapa estático faceta → clases (Tailwind necesita ver las clases
   completas en el código para generarlas — no admite concatenación). */
const signalNav: Record<string, { active: string; idle: string }> = {
  "signal-web": {
    active: "text-signal-web",
    idle: "text-text-muted hover:text-signal-web",
  },
  "signal-it": {
    active: "text-signal-it",
    idle: "text-text-muted hover:text-signal-it",
  },
  "signal-ai": {
    active: "text-signal-ai",
    idle: "text-text-muted hover:text-signal-ai",
  },
};

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Accesibilidad: enlace para saltar la navegación con teclado */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2 focus:rounded font-mono text-sm"
      >
        Saltar al contenido
      </a>

      <header className="border-b border-surface">
        <nav
          aria-label="Navegación principal"
          className="mx-auto max-w-5xl flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4"
        >
          <NavLink
            to="/"
            className="font-display font-semibold text-lg tracking-tight"
          >
            Portafolio
          </NavLink>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 ml-auto">
            {facets.map((f) => (
              <li key={f.id}>
                <NavLink
                  to={f.slug}
                  className={({ isActive }) =>
                    `font-mono text-sm transition-colors ${
                      isActive
                        ? signalNav[f.signalToken].active
                        : signalNav[f.signalToken].idle
                    }`
                  }
                >
                  {f.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="contenido" className="flex-1 mx-auto w-full max-w-5xl px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-surface">
        <div className="mx-auto max-w-5xl px-6 py-6 font-mono text-xs text-text-muted">
          © 2026 — construido con React, TypeScript y Tailwind CSS
        </div>
      </footer>

      {/* Dock persistente del copiloto — acompaña todas las rutas */}
      <ChatDock />
    </div>
  );
}
