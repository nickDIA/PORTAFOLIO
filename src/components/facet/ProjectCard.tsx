import type { Project } from "../../data/content";
import type { Accent } from "../../lib/accent";
import TechChips from "./TechChips";
import ProjectLinks from "./ProjectLinks";

interface Props {
  project: Project;
  accent: Accent;
}

/** Tarjeta compacta para proyectos de apoyo. */
export default function ProjectCard({ project, accent }: Props) {
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
          {project.name}
        </h3>
        <p className="mt-0.5 font-mono text-xs text-text-muted">
          {project.role} · {project.period}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-text-muted">
        {project.summary}
      </p>
      <div className="mt-auto space-y-4">
        <TechChips tech={project.tech} accent={accent} />
        <ProjectLinks links={project.links} />
      </div>
    </article>
  );
}
