import { projects } from "../data/content";
import { facetAccent } from "../lib/accent";
import FacetShell, { SectionLabel } from "../components/facet/FacetShell";
import FeaturedProject from "../components/facet/FeaturedProject";
import ProjectCard from "../components/facet/ProjectCard";
import TechChips from "../components/facet/TechChips";

const accent = facetAccent.ai;

export default function IaAutomatizacion() {
  const copiloto = projects.find((p) => p.id === "copiloto-ia")!;
  const gemini = projects.find((p) => p.id === "integracion-gemini")!;
  const alexa = projects.find((p) => p.id === "alexa-skill")!;

  return (
    <FacetShell facetId="ai">
      {/* El copiloto en primer plano: la prueba viva, no una captura */}
      <section
        aria-labelledby="copiloto"
        className={`rounded-lg border p-6 sm:p-10 ${accent.borderSoft} ${accent.bgSoft}`}
      >
        <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
          prueba viva
        </p>
        <h2
          id="copiloto"
          className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight"
        >
          {copiloto.name}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed">{copiloto.summary}</p>

        <div
          className={`mt-6 rounded-lg border border-dashed p-6 ${accent.borderSoft}`}
        >
          <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
            en vivo — pruébalo ahora
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Abre el dock <span className="font-mono text-signal-ai">Copiloto IA</span>{" "}
            en la esquina inferior derecha y pregúntale por mi experiencia:
            responde anclado a los datos de este sitio, con streaming en tiempo
            real.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Decisiones de ingeniería
          </h3>
          <ul className="mt-3 space-y-2">
            {copiloto.achievements.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden="true" className={`shrink-0 ${accent.text}`}>
                  ▸
                </span>
                <span className="text-sm leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <TechChips tech={copiloto.tech} accent={accent} />
        </div>
      </section>

      {/* Deep-dive de la integración de Gemini */}
      <section aria-label="Integración de Gemini">
        <FeaturedProject project={gemini} accent={accent} label="deep-dive técnico" />
      </section>

      <section aria-labelledby="apoyo-ia" className="space-y-6">
        <SectionLabel id="apoyo-ia">Proyecto de apoyo</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          <ProjectCard project={alexa} accent={accent} />
        </div>
      </section>
    </FacetShell>
  );
}
