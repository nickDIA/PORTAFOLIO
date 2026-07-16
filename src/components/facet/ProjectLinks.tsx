import { isPending, type ProjectLink } from "../../data/content";

interface Props {
  links: ProjectLink[];
}

/** Enlaces de proyecto; los pendientes se muestran como chip inerte. */
export default function ProjectLinks({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) =>
        isPending(link.url) ? (
          <li
            key={link.label}
            className="rounded border border-dashed border-text-muted/30 px-3 py-1.5 font-mono text-xs text-text-muted"
            title="Enlace pendiente de configurar en content.ts"
          >
            {link.label} · pendiente
          </li>
        ) : (
          <li key={link.label}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border border-text/20 px-3 py-1.5 font-mono text-xs transition-colors hover:border-text hover:bg-text/5"
            >
              {link.label} ↗
            </a>
          </li>
        ),
      )}
    </ul>
  );
}
