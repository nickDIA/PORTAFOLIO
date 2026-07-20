import { useEffect, type ReactNode } from "react";
import { roles, type RoleId } from "../../data/content";
import { roleAccent } from "../../lib/accent";
import { useDocumentTitle } from "../../lib/useDocumentTitle";
import { useT } from "../../i18n/locale";
import { ui } from "../../i18n/ui";

interface Props {
  roleId: RoleId;
  children: ReactNode;
}

/**
 * Armazón común de las páginas de rol: header tematizado,
 * anillo de foco de teclado en el color de señal y título del
 * documento. El contenido de cada rol va como children.
 */
export default function RoleShell({ roleId, children }: Props) {
  const t = useT();
  const index = roles.findIndex((r) => r.id === roleId);
  const role = roles[index];
  const accent = roleAccent[roleId];

  useDocumentTitle(t(role.name));

  /* El foco de teclado adopta el color de señal del rol */
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
          {t(ui.role.label)} /0{index + 1}
        </p>
        <h1
          className={`mt-3 text-3xl sm:text-5xl font-bold tracking-tight ${accent.text}`}
        >
          {t(role.name)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-muted">
          {t(role.description)}
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
