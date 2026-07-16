import type { FacetId } from "../data/content";

/* ============================================================
   Traza de circuito del hero.
   Un nodo de origen central se ramifica en tres trazas, una por
   faceta, cada una en su color de señal. Las ramas terminan
   alineadas con el centro de las tarjetas de faceta (grid de 3
   columnas en un contenedor de 976px con gap de 24px →
   centros en x = 154.67, 488 y 821.33).

   SVG + CSS puro — sin librerías de animación.
   Decorativo para lectores de pantalla (aria-hidden): la
   navegación real son las tarjetas.
   ============================================================ */

const ORIGIN = { x: 488, y: 14 };

interface Branch {
  id: FacetId;
  d: string;
  color: string; // var() del token — nunca hex directo
  padX: number;
  label: string;
  drawDelay: string;
  padDelay: string;
  pulseDelay: string;
}

/* Trazas estilo PCB: verticales, horizontales y codos a 45°. */
const branches: Branch[] = [
  {
    id: "web",
    d: "M488 14 V44 L370 162 H174.67 L154.67 182 V226",
    color: "var(--color-signal-web)",
    padX: 154.67,
    label: "SIG·WEB /01",
    drawDelay: "0.25s",
    padDelay: "1.05s",
    pulseDelay: "1.7s",
  },
  {
    id: "it",
    d: "M488 14 V226",
    color: "var(--color-signal-it)",
    padX: 488,
    label: "SIG·IT /02",
    drawDelay: "0.4s",
    padDelay: "1.2s",
    pulseDelay: "2.3s",
  },
  {
    id: "ai",
    d: "M488 14 V44 L606 162 H801.33 L821.33 182 V226",
    color: "var(--color-signal-ai)",
    padX: 821.33,
    label: "SIG·AI /03",
    drawDelay: "0.55s",
    padDelay: "1.35s",
    pulseDelay: "2.9s",
  },
];

interface Props {
  /** Faceta bajo hover/foco en las tarjetas: su traza se intensifica */
  hot: FacetId | null;
}

export default function SignalTrace({ hot }: Props) {
  return (
    <>
      {/* ---- Versión de escritorio: tres ramas hacia las tarjetas ----
              viewBox con 16 unidades extra arriba: el anillo del nodo
              de origen crece hasta radio ~25 desde un centro a solo
              14 del borde — sin este margen se corta contra el límite
              del SVG. Ninguna coordenada del contenido se movió. ---- */}
      <svg
        viewBox="0 -16 976 256"
        className="hidden sm:block w-full h-auto overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        {/* Stubs decorativos, textura de placa */}
        <g stroke="var(--color-text-muted)" strokeWidth="1.5" opacity="0.2" fill="none">
          <path d="M488 76 H448" />
          <circle cx="444" cy="76" r="2.5" fill="var(--color-text-muted)" stroke="none" />
          <path d="M488 100 H528" />
          <circle cx="532" cy="100" r="2.5" fill="var(--color-text-muted)" stroke="none" />
        </g>

        {branches.map((b) => {
          const dimmed = hot !== null && hot !== b.id;
          return (
            <g
              key={b.id}
              style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 0.3s ease" }}
            >
              {/* Fantasma: la ruta completa, muy tenue, visible desde el inicio */}
              <path d={b.d} stroke={b.color} strokeWidth="2" fill="none" opacity="0.12" />

              {/* Traza que se dibuja */}
              <path
                d={b.d}
                pathLength={1}
                stroke={b.color}
                className="trace-path"
                style={{
                  animationDelay: b.drawDelay,
                  strokeWidth: hot === b.id ? 2.75 : 2,
                  transition: "stroke-width 0.3s ease",
                }}
              />

              {/* Pulso de señal en bucle */}
              <path
                d={b.d}
                pathLength={1}
                stroke={b.color}
                className="trace-pulse"
                style={{ animationDelay: b.pulseDelay }}
              />

              {/* Pad terminal sobre la tarjeta */}
              <circle
                cx={b.padX}
                cy={226}
                r="5"
                fill="var(--color-ink)"
                stroke={b.color}
                strokeWidth="2"
                className="pad-fade"
                style={{ animationDelay: b.padDelay }}
              />

              {/* Etiqueta técnica de la línea */}
              <text
                x={b.padX + 14}
                y={218}
                fill={b.color}
                fontSize="10"
                fontFamily="var(--font-mono)"
                letterSpacing="0.08em"
                className="pad-fade"
                style={{ animationDelay: b.padDelay }}
              >
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Nodo de origen (encima de las trazas) */}
        <circle
          cx={ORIGIN.x}
          cy={ORIGIN.y}
          r="14"
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="1.5"
          className="node-ring"
        />
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="6" fill="var(--color-text)" className="node-core" />
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="2.5" fill="var(--color-ink)" className="node-core" />
      </svg>

      {/* ---- Versión móvil: conector vertical compacto (las tarjetas
              se apilan, así que la señal desciende en degradado) ---- */}
      <svg
        viewBox="0 0 48 88"
        className="sm:hidden mx-auto h-20 w-auto"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="signal-drop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signal-web)" />
            <stop offset="50%" stopColor="var(--color-signal-it)" />
            <stop offset="100%" stopColor="var(--color-signal-ai)" />
          </linearGradient>
        </defs>
        <path
          d="M24 14 V80"
          pathLength={1}
          stroke="url(#signal-drop)"
          className="trace-path"
          style={{ animationDelay: "0.25s" }}
        />
        <circle cx="24" cy="10" r="5" fill="var(--color-text)" className="node-core" />
        <circle cx="24" cy="10" r="2" fill="var(--color-ink)" className="node-core" />
      </svg>
    </>
  );
}
