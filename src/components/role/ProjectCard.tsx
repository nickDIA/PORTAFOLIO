import type { Project } from "../../data/content";
import type { Accent } from "../../lib/accent";
import { useT } from "../../i18n/locale";
import TechChips from "./TechChips";
import ProjectLinks from "./ProjectLinks";

interface Props {
  project: Project;
  accent: Accent;
}

/** Tarjeta compacta para proyectos de apoyo. */
export default function ProjectCard({ project, accent }: Props) {
  const t = useT();
  return (
    <article
      aria-labelledby={`proyecto-${project.id}`}
      className="flex flex-col gap-4 rounded-lg bg-surface p-6"
    >
      <div>
        <h3
          id={`proyecto-${project.id}`}
          className="font-display text-lg font-semibold"
        >
          {t(project.name)}
        </h3>
        <p className="mt-0.5 font-mono text-xs text-text-muted">
          {t(project.title)} · {t(project.period)}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">
        {t(project.summary)}
      </p>
      <div className="mt-auto space-y-4">
        <TechChips tech={project.tech} accent={accent} />
        <ProjectLinks links={project.links} />
      </div>
    </article>
  );
}
