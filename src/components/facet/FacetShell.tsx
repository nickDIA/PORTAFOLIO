import { useEffect, type ReactNode } from "react";
import { facets, type FacetId } from "../../data/content";
import { facetAccent } from "../../lib/accent";
import { useDocumentTitle } from "../../lib/useDocumentTitle";

interface Props {
  facetId: FacetId;
  children: ReactNode;
}

/**
 * Armazón común de las páginas de faceta: header tematizado,
 * anillo de foco de teclado en el color de señal y título del
 * documento. El contenido de cada faceta va como children.
 */
export default function FacetShell({ facetId, children }: Props) {
  const index = facets.findIndex((f) => f.id === facetId);
  const facet = facets[index];
  const accent = facetAccent[facetId];

  useDocumentTitle(facet.name);

  /* El foco de teclado adopta el color de señal de la faceta */
  useEffect(() => {
    document.documentElement.style.setProperty("--focus-ring", accent.ring);
    return () => {
      document.documentElement.style.removeProperty("--focus-ring");
    };
  }, [accent.ring]);

  return (
    <div className="space-y-16">
      <header className="fade-up">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">
          faceta /0{index + 1}
        </p>
        <h1
          className={`mt-3 text-3xl sm:text-5xl font-bold tracking-tight ${accent.text}`}
        >
          {facet.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-muted">
          {facet.description}
        </p>
      </header>
      {children}
    </div>
  );
}

/** Etiqueta de sección consistente en mono, tematizable. */
export function SectionLabel({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-mono text-sm uppercase tracking-widest text-text-muted"
    >
      {children}
    </h2>
  );
}
