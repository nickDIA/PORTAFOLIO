import type { ReactNode } from "react";
import type { Project } from "../../data/content";
import type { Accent } from "../../lib/accent";
import TechChips from "./TechChips";
import ScreenshotFrame from "./ScreenshotFrame";
import ProjectLinks from "./ProjectLinks";

interface Props {
  project: Project;
  accent: Accent;
  /** Etiqueta sobre el título (por defecto "proyecto central") */
  label?: string;
  /** Slot extra bajo la descripción (ej. demo interactiva de Núcleo) */
  children?: ReactNode;
}

/** Presentación grande del proyecto central de un rol. */
export default function FeaturedProject({
  project,
  accent,
  label = "proyecto central",
  children,
}: Props) {
  const hasShots = project.screenshots.length > 0;

  return (
    <article
      aria-labelledby={`proyecto-${project.id}`}
      className={`rounded-lg border bg-surface p-6 sm:p-10 ${accent.borderSoft}`}
    >
      <p className={`font-mono text-xs uppercase tracking-widest ${accent.text}`}>
        {label}
      </p>
      <h2
        id={`proyecto-${project.id}`}
        className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight"
      >
        {project.name}
      </h2>
      <p className="mt-1 font-mono text-xs text-text-muted">
        {project.title} · {project.period}
      </p>

      <div className={`mt-8 grid gap-10 ${hasShots ? "lg:grid-cols-2" : ""}`}>
        <div className="space-y-8">
          <p className="leading-relaxed">{project.description}</p>

          {children}

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
              Logros
            </h3>
            <ul className="mt-3 space-y-2">
              {project.achievements.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden="true" className={`shrink-0 ${accent.text}`}>
                    ▸
                  </span>
                  <span className="text-sm leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <TechChips tech={project.tech} accent={accent} />
          <ProjectLinks links={project.links} />
        </div>

        {hasShots && (
          <div className="space-y-4">
            {project.screenshots.map((shot) => (
              <ScreenshotFrame key={shot.src} shot={shot} accent={accent} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
