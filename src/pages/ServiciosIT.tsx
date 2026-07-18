import { experienceByRole, projectsByRole } from "../data/content";
import { roleAccent } from "../lib/accent";
import RoleShell, { SectionLabel } from "../components/role/RoleShell";
import FeaturedProject from "../components/role/FeaturedProject";
import NucleoDemo from "../components/role/NucleoDemo";
import ViajePeticion from "../components/role/ViajePeticion";

const accent = roleAccent.it;

export default function ServiciosIT() {
  const [nucleo] = projectsByRole("it");
  const experience = experienceByRole("it");

  return (
    <RoleShell roleId="it">
      <section aria-label="Proyecto central" className="space-y-6">
        <FeaturedProject project={nucleo} accent={accent} />
        <NucleoDemo />
        <ViajePeticion />
      </section>

      <section aria-labelledby="experiencia" className="space-y-6">
        <SectionLabel id="experiencia">Experiencia</SectionLabel>
        <ol className="relative ml-2 space-y-10 border-l border-signal-it/30 pl-8">
          {experience.map((e) => (
            <li key={e.id} className="relative">
              {/* Nodo de la línea de tiempo */}
              <span
                aria-hidden="true"
                className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-signal-it bg-ink"
              />
              <h3 className="font-display text-lg font-semibold">
                {e.organization}
              </h3>
              <p className={`mt-0.5 font-mono text-xs ${accent.text}`}>
                {e.title} · {e.period}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {e.description}
              </p>
              <ul className="mt-3 space-y-2">
                {e.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm">
                    <span aria-hidden="true" className={`shrink-0 ${accent.text}`}>
                      ▸
                    </span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </RoleShell>
  );
}
