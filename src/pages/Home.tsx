import { useState } from "react";
import { Link } from "react-router-dom";
import {
  roles,
  landing,
  isPending,
  profile,
  type RoleId,
} from "../data/content";
import { roleAccent } from "../lib/accent";
import SignalTrace from "../components/SignalTrace";
import ScreenshotFrame from "../components/role/ScreenshotFrame";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useLocale, useT, localizePath } from "../i18n/locale";
import { ui } from "../i18n/ui";

/* ============================================================
   Landing = carta de presentación para CLIENTES (no técnicos).
   Lenguaje de beneficio y evidencia visual; la profundidad
   técnica para reclutadores vive en las páginas de rol, a un
   clic desde cada tarjeta de servicio. Ver `landing` en
   content.ts para el razonamiento completo.
   ============================================================ */

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

  /* CTA principal: WhatsApp con mensaje precargado; mientras el
     número siga en [[TODO, cae a email automáticamente. */
  const whatsappPending = isPending(profile.contact.whatsapp);
  const ctaHref = whatsappPending
    ? `mailto:${profile.contact.email}`
    : `https://wa.me/${profile.contact.whatsapp}?text=${encodeURIComponent(
        t(landing.cta.whatsappMessage),
      )}`;
  const ctaLabel = whatsappPending
    ? t(landing.cta.emailLabel)
    : t(landing.cta.whatsappLabel);
  const ctaExternal = !whatsappPending;

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
      {/* ============ Hero para clientes ============ */}
      <section aria-label={t(ui.home.presentationLabel)} className="pt-6 sm:pt-10">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted fade-up">
            {t(landing.hero.eyebrow)}
          </p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight fade-up [animation-delay:0.1s]">
            {t(landing.hero.headline)}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto fade-up [animation-delay:0.2s]">
            {t(landing.hero.sub)}
          </p>
          <p className="mt-3 font-mono text-sm text-text-muted fade-up [animation-delay:0.3s]">
            {profile.name} · {t(profile.title)}
          </p>
          <div className="mt-7 fade-up [animation-delay:0.4s]">
            <a
              href={ctaHref}
              {...(ctaExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-block rounded-lg bg-signal-web px-6 py-3 font-display font-semibold text-ink transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        {/* La traza nace bajo la intro y conecta con las tarjetas */}
        <div className="mt-10 sm:mt-14">
          <SignalTrace hot={hot} />
        </div>

        {/* Tarjetas de servicio: lenguaje de cliente arriba, el nombre
            técnico del rol como puente hacia su página de profundidad. */}
        <div className="grid gap-6 sm:grid-cols-3 sm:-mt-1">
          {landing.services.map((s, i) => {
            const role = roles.find((r) => r.id === s.role)!;
            return (
              <Link
                key={s.role}
                to={localizePath(role.slug, locale)}
                onMouseEnter={() => setHot(s.role)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(s.role)}
                onBlur={() => setHot(null)}
                className={`fade-up block rounded-lg bg-surface border p-6 transition-all hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${cardAccent[role.signalToken]}`}
                style={{ animationDelay: cardDelays[i] }}
              >
                <p className="font-mono text-xs text-text-muted">
                  {t(role.name)} /0{i + 1}
                </p>
                <h2
                  className={`mt-2 font-display text-xl font-semibold ${titleAccent[role.signalToken]}`}
                >
                  {t(s.label)}
                </h2>
                <p className="mt-2 text-sm text-text-muted">{t(s.benefit)}</p>
                <p
                  className={`mt-4 font-mono text-xs ${titleAccent[role.signalToken]}`}
                  aria-hidden="true"
                >
                  {t(ui.home.explore)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ Evidencia visual ============ */}
      <section aria-labelledby="evidencia" className="space-y-6">
        <h2
          id="evidencia"
          className="font-mono text-sm uppercase tracking-widest text-text-muted"
        >
          {t(landing.evidenceHeading)}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {landing.evidence.map((e) => (
            <ScreenshotFrame
              key={e.shot.src}
              shot={e.shot}
              accent={roleAccent[e.role]}
            />
          ))}
        </div>
      </section>

      {/* ============ Cómo trabajo (confianza) ============ */}
      <section aria-labelledby="como-trabajo" className="space-y-6">
        <h2
          id="como-trabajo"
          className="font-mono text-sm uppercase tracking-widest text-text-muted"
        >
          {t(landing.trustHeading)}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {landing.trust.map((item) => (
            <li
              key={t(item)}
              className="rounded-lg bg-surface p-5 text-sm leading-relaxed"
            >
              {t(item)}
            </li>
          ))}
        </ul>
        {/* El copiloto como demo viviente para el visitante no técnico */}
        <p className="rounded-lg border border-signal-ai/30 bg-signal-ai/10 p-5 text-sm leading-relaxed">
          {t(landing.copilotNote)}
        </p>
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
        <p className="mt-4 font-display text-2xl font-semibold">
          {t(landing.cta.heading)}
        </p>
        <div className="mt-5">
          <a
            href={ctaHref}
            {...(ctaExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-block rounded-lg bg-signal-web px-6 py-3 font-display font-semibold text-ink transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            {ctaLabel}
          </a>
        </div>
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
