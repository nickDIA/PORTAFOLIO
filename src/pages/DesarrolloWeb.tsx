import { isPending, profile, projectsByFacet } from "../data/content";
import { facetAccent } from "../lib/accent";
import FacetShell, { SectionLabel } from "../components/facet/FacetShell";
import FeaturedProject from "../components/facet/FeaturedProject";
import ProjectCard from "../components/facet/ProjectCard";

const accent = facetAccent.web;

export default function DesarrolloWeb() {
  const [featured, ...support] = projectsByFacet("web");
  const github = profile.contact.github;

  return (
    <FacetShell facetId="web">
      <section aria-label="Proyecto central">
        <FeaturedProject project={featured} accent={accent} />
      </section>

      <section aria-labelledby="proyectos-apoyo" className="space-y-6">
        <SectionLabel id="proyectos-apoyo">
          {support.length === 1 ? "Proyecto de apoyo" : "Proyectos de apoyo"}
        </SectionLabel>
        <div className="grid gap-6 sm:grid-cols-2">
          {support.map((p) => (
            <ProjectCard key={p.id} project={p} accent={accent} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="codigo"
        className={`rounded-lg border p-8 text-center ${accent.borderSoft} ${accent.bgSoft}`}
      >
        <h2 id="codigo" className="font-display text-xl font-semibold">
          El código está abierto
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Los repositorios públicos están en GitHub — la evidencia se puede
          leer, no solo mirar.
        </p>
        <div className="mt-5">
          {isPending(github) ? (
            <span
              className="inline-block rounded border border-dashed border-text-muted/30 px-4 py-2 font-mono text-sm text-text-muted"
              title="URL pendiente de configurar en content.ts"
            >
              GitHub · pendiente
            </span>
          ) : (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block rounded border px-4 py-2 font-mono text-sm transition-colors hover:bg-signal-web/20 ${accent.border} ${accent.text}`}
            >
              Ver GitHub ↗
            </a>
          )}
        </div>
      </section>
    </FacetShell>
  );
}
