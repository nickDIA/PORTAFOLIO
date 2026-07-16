import { isPending } from "../../data/content";
import type { Accent } from "../../lib/accent";

interface Props {
  tech: string[];
  accent: Accent;
  label?: string;
}

/** Fila de chips de tecnología en el color de señal de la faceta. */
export default function TechChips({ tech, accent, label = "Stack" }: Props) {
  const items = tech.filter((t) => !isPending(t));
  if (items.length === 0) return null;

  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className={`rounded border px-2.5 py-1 font-mono text-xs ${accent.chip}`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
