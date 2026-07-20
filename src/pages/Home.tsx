import { useState } from "react";
import { Link } from "react-router-dom";
import { roles, isPending, profile, type RoleId } from "../data/content";
import SignalTrace from "../components/SignalTrace";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useLocale, useT, localizePath } from "../i18n/locale";
import { ui } from "../i18n/ui";

/* Clases completas por rol (Tailwind no admite concatenación). */
const cardAccent: Record<string, string> = {
  "signal-web": "border-signal-web/40 hover:border-signal-web focus-visible:border-signal-web",
  "signal-it": "border-signal-it/40 hover:border-signal-it focus-visible:border-signal-it",
  "signal-ai": "border-signal-ai/40 hover:border-signal-ai focus-visible:border-signal-ai",
};

const titleAccent: Record<string, string> = {
  "signal-web": "text-signal-web",
  "signal-it": "text-signal-it",
  "signal-ai": "text-signal-ai",
};

const cardDelays = ["0.9s", "1.05s", "1.2s"];

export default function Home() {
  useDocumentTitle();
  const t = useT();
  const locale = useLocale();

  /* La tarjeta bajo hover/foco intensifica su traza en el SVG:
     el color de señal funciona como navegación, no como adorno. */
  const [hot, setHot] = useState<RoleId | null>(null);

  const contactLinks = [
    { label: "GitHub", href: profile.contact.github },
    { label: "LinkedIn", href: profile.contact.linkedin },
    { label: "Email", href: `mailto:${profile.contact.email}` },
    {
      label: t(ui.home.downloadCv),
      href: profile.contact.cvUrl,
      download: true,
    },
  ];

  return (
    <div className="space-y-24">
      {/* ============ Hero de la señal ============ */}
      <section aria-label={t(ui.home.presentationLabel)} className="pt-6 sm:pt-10">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted fade-up">
            {t(profile.title)}
            {profile.location && !isPending(t(profile.location)) && (
              <> · {t(profile.location)}</>
            )}
          </p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight fade-up [animation-delay:0.1s]">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto fade-up [animation-delay:0.2s]">
            {t(profile.tagline)}
          </p>
        </div>

        {/* La traza nace bajo la intro y conecta con las tarjetas */}
        <div className="mt-10 sm:mt-14">
          <SignalTrace hot={hot} />
        </div>

        {/* Tarjetas de rol: destino de cada rama */}
        <div className="grid gap-6 sm:grid-cols-3 sm:-mt-1">
          {roles.map((r, i) => (
            <Link
              key={r.id}
              to={localizePath(r.slug, locale)}
              onMouseEnter={() => setHot(r.id)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(r.id)}
              onBlur={() => setHot(null)}
              className={`fade-up block rounded-lg bg-surface border p-6 transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${cardAccent[r.signalToken]}`}
              style={{ animationDelay: cardDelays[i] }}
            >
              <p className="font-mono text-xs text-text-muted">0{i + 1}</p>
              <h2
                className={`mt-2 font-display text-xl font-semibold ${titleAccent[r.signalToken]}`}
              >
                {t(r.name)}
              </h2>
              <p className="mt-2 text-sm text-text-muted">{t(r.tagline)}</p>
              <p
                className={`mt-4 font-mono text-xs ${titleAccent[r.signalToken]}`}
                aria-hidden="true"
              >
                {t(ui.home.explore)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Intro personal breve ============ */}
      <section aria-labelledby="sobre-mi" className="max-w-2xl mx-auto text-center">
        <h2
          id="sobre-mi"
          className="font-mono text-sm uppercase tracking-widest text-text-muted"
        >
          {t(ui.home.aboutHeading)}
        </h2>
        <p className="mt-4 text-lg leading-relaxed">{t(profile.intro)}</p>
        <Link
          to={localizePath("/sobre-mi", locale)}
          className="mt-4 inline-block font-mono text-sm text-signal-web transition-colors hover:underline"
        >
          {t(ui.home.readMore)}
        </Link>
      </section>

      {/* ============ Contacto ============ */}
      <section
        aria-labelledby="contacto"
        className="rounded-lg bg-surface p-8 sm:p-10 text-center"
      >
        <h2
          id="contacto"
          className="font-mono text-sm uppercase tracking-widest text-text-muted"
        >
          {t(ui.home.contactHeading)}
        </h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {contactLinks.map((link) =>
            isPending(link.href) ? (
              <li
                key={link.label}
                className="rounded border border-text-muted/30 px-4 py-2 font-mono text-sm text-text-muted"
                title="Enlace pendiente de configurar en content.ts"
              >
                {link.label} · {t(ui.home.pending)}
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.download ? { download: "" } : {})}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block rounded border border-text/20 px-4 py-2 font-mono text-sm transition-colors hover:border-text hover:bg-text/5"
                >
                  {link.label}
                </a>
              </li>
            ),
          )}
        </ul>
        <p className="mt-4 font-mono text-xs text-text-muted">
          {t(profile.contact.cvNote)}
        </p>
      </section>
    </div>
  );
}
