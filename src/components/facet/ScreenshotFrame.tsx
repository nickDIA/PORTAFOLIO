import { useState } from "react";
import { isPending, type Screenshot } from "../../data/content";
import type { Accent } from "../../lib/accent";

interface Props {
  shot: Screenshot;
  accent: Accent;
}

/**
 * Marco de captura de pantalla. Si la imagen aún no existe en
 * /public (placeholder [[TODO o error de carga), muestra un marco
 * punteado con la ruta esperada — el sitio nunca enseña imágenes rotas.
 */
export default function ScreenshotFrame({ shot, accent }: Props) {
  const [failed, setFailed] = useState(false);
  /* Pendiente si la ruta o el alt siguen en [[TODO (la captura aún no es
     real) o si la imagen no carga — nunca se muestra una imagen rota. */
  const pending = isPending(shot.src) || isPending(shot.alt) || failed;

  if (pending) {
    return (
      <figure
        className={`flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 ${accent.borderSoft} ${accent.bgSoft}`}
      >
        <span className="font-mono text-xs text-text-muted">
          [ captura pendiente ]
        </span>
        <span className="text-center font-mono text-xs text-text-muted">
          public{shot.src}
        </span>
      </figure>
    );
  }

  return (
    <figure>
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full rounded-lg border ${accent.borderSoft}`}
      />
      {shot.caption && (
        <figcaption className="mt-2 font-mono text-xs text-text-muted">
          {shot.caption}
        </figcaption>
      )}
    </figure>
  );
}
