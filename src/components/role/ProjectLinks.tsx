import { isPending, type ProjectLink } from "../../data/content";
import { useT } from "../../i18n/locale";
import { ui } from "../../i18n/ui";

interface Props {
  links: ProjectLink[];
}

/** Enlaces de proyecto; los pendientes se muestran como chip inerte. */
export default function ProjectLinks({ links }: Props) {
  const t = useT();
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => {
        const label = t(link.label);
        return isPending(link.url) ? (
          <li
            key={label}
            className="rounded border border-dashed border-text-muted/30 px-3 py-1.5 font-mono text-xs text-text-muted"
            title={t(ui.project.linkPendingTitle)}
          >
            {label} · {t(ui.project.pendingSuffix)}
          </li>
        ) : (
          <li key={label}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border border-text/20 px-3 py-1.5 font-mono text-xs transition-colors hover:border-text hover:bg-text/5"
            >
              {label} ↗
            </a>
          </li>
        );
      })}
    </ul>
  );
}
