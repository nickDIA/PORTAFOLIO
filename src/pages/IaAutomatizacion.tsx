import { projects } from "../data/content";
import { roleAccent } from "../lib/accent";
import { useT } from "../i18n/locale";
import { ui } from "../i18n/ui";
import RoleShell, { SectionLabel } from "../components/role/RoleShell";
import FeaturedProject from "../components/role/FeaturedProject";
import ProjectCard from "../components/role/ProjectCard";
import TechChips from "../components/role/TechChips";

const accent = roleAccent.ai;

export default function IaAutomatizacion() {
  const t = useT();
  const copiloto = projects.find((p) => p.id === "copiloto-ia")!;
  const gemini = projects.find((p) => p.id === "integracion-gemini")!;
  const alexa = projects.find((p) => p.id === "alexa-skill")!;

  return (
    <RoleShell roleId="ai">
      {/* El copiloto en primer plano: la prueba viva, no una captura */}
      <section
        aria-labelledby="copiloto"
        className={`rounded-lg border p-6 sm:p-10 ${accent.borderSoft} ${accent.bgSoft}`}
      >
        <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
          {t(ui.iaAutomatizacion.liveProofLabel)}
        </p>
        <h2
          id="copiloto"
          className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight"
        >
          {t(copiloto.name)}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed">{t(copiloto.summary)}</p>

        <div
          className={`mt-6 rounded-lg border border-dashed p-6 ${accent.borderSoft}`}
        >
          <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
            {t(ui.iaAutomatizacion.tryNowLabel)}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {t(ui.iaAutomatizacion.tryNowBefore)}{" "}
            <span className="font-mono text-signal-ai">
              {t(ui.chatDock.dockLabel)}
            </span>{" "}
            {t(ui.iaAutomatizacion.tryNowAfter)}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {t(ui.iaAutomatizacion.engineeringDecisionsHeading)}
          </h3>
          <ul className="mt-3 space-y-2">
            {copiloto.achievements.map((a) => (
              <li key={t(a)} className="flex gap-3">
                <span aria-hidden="true" className={`shrink-0 ${accent.text}`}>
                  ▸
                </span>
                <span className="text-sm leading-relaxed">{t(a)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <TechChips tech={copiloto.tech} accent={accent} />
        </div>
      </section>

      {/* Deep-dive de la integración de Gemini */}
      <section aria-label={t(ui.iaAutomatizacion.geminiIntegrationLabel)}>
        <FeaturedProject
          project={gemini}
          accent={accent}
          label={t(ui.iaAutomatizacion.deepDiveLabel)}
        />
      </section>

      <section aria-labelledby="apoyo-ia" className="space-y-6">
        <SectionLabel id="apoyo-ia">{t(ui.project.supportOne)}</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          <ProjectCard project={alexa} accent={accent} />
        </div>
      </section>
    </RoleShell>
  );
}
