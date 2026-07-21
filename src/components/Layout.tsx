import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { roles } from "../data/content";
import { useLocale, useT, localizePath, stripLocalePrefix } from "../i18n/locale";
import { ui } from "../i18n/ui";
import { useHeadMeta } from "../lib/useHeadMeta";
import ChatDock from "./copilot/ChatDock";

/* Mapa estático rol → clases (Tailwind necesita ver las clases
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
  const locale = useLocale();
  const t = useT();
  const location = useLocation();

  /* <head> SEO por ruta (canonical, Open Graph, Twitter, hreflang) —
     el gemelo en runtime del prerender. Ver src/seo/meta.ts. */
  useHeadMeta();

  /* lang del documento sincronizado con el idioma actual — accesibilidad
     y corrección semántica, no solo cosmético. */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const otherLocale = locale === "es" ? "en" : "es";
  const otherLocalePath = localizePath(
    stripLocalePrefix(location.pathname),
    otherLocale,
  );
  const otherLocaleLabel = otherLocale === "en" ? "English" : "Español";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Accesibilidad: enlace para saltar la navegación con teclado */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2 focus:rounded font-mono text-sm"
      >
        {t(ui.layout.skipLink)}
      </a>

      <header className="border-b border-surface">
        <nav
          aria-label={t(ui.layout.navLabel)}
          className="mx-auto max-w-5xl flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4"
        >
          <NavLink
            to={localizePath("/", locale)}
            end
            aria-label={t(ui.layout.brand)}
            className="font-display font-semibold text-lg tracking-tight"
          >
            {/* Cada inicial en su color de señal — D-I-A son, en orden,
                Desarrollo web, servicios IT y automatización con IA. */}
            <span className="text-signal-web">D</span>
            <span className="text-signal-it">I</span>
            <span className="text-signal-ai">A</span>
          </NavLink>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 ml-auto">
            {roles.map((r) => (
              <li key={r.id}>
                <NavLink
                  to={localizePath(r.slug, locale)}
                  className={({ isActive }) =>
                    `font-mono text-sm transition-colors ${
                      isActive
                        ? signalNav[r.signalToken].active
                        : signalNav[r.signalToken].idle
                    }`
                  }
                >
                  {t(r.name)}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to={localizePath("/sobre-mi", locale)}
                className={({ isActive }) =>
                  `font-mono text-sm transition-colors ${
                    isActive ? "text-text" : "text-text-muted hover:text-text"
                  }`
                }
              >
                {t(ui.about.navLabel)}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={otherLocalePath}
                hrefLang={otherLocale}
                className="rounded border border-text/20 px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-text hover:text-text"
              >
                {otherLocaleLabel}
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main id="contenido" className="flex-1 mx-auto w-full max-w-5xl px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-surface">
        <div className="mx-auto max-w-5xl px-6 py-6 font-mono text-xs text-text-muted">
          {t(ui.layout.footer)}
        </div>
      </footer>

      {/* Dock persistente del copiloto — acompaña todas las rutas */}
      <ChatDock />
    </div>
  );
}
