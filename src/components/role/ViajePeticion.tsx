import { useT } from "../../i18n/locale";
import { ui } from "../../i18n/ui";

/* ============================================================
   Mini-versión visual de "El viaje de una petición" (Núcleo).
   Una petición avanza por la traza; en la transacción se bifurca
   en dos escrituras simultáneas — cambio de estado y entrada de
   auditoría — que convergen en la respuesta: o ambas o ninguna.
   Mismo lenguaje visual (y clases de animación) que el hero.
   ============================================================ */

const AMBER = "var(--color-signal-it)";

export default function ViajePeticion() {
  const t = useT();

  const stages = [
    { x: 40, y: 84, label: t(ui.viajePeticion.stagePeticion) },
    { x: 200, y: 84, label: t(ui.viajePeticion.stageValidacion) },
    { x: 360, y: 112, label: t(ui.viajePeticion.stageTransaccion) },
    { x: 640, y: 84, label: t(ui.viajePeticion.stageRespuesta) },
  ];

  return (
    <figure
      aria-label={t(ui.viajePeticion.ariaLabel)}
      className="rounded-lg border border-signal-it/30 bg-surface p-6"
    >
      <svg
        viewBox="0 0 720 150"
        className="w-full h-auto"
        aria-hidden="true"
        focusable="false"
      >
        {/* Rutas fantasma (visibles antes del dibujado) */}
        <g stroke={AMBER} strokeWidth="2" fill="none" opacity="0.12">
          <path d="M40 60 H360" />
          <path d="M360 60 L385 35 H535 L560 60" />
          <path d="M360 60 L385 85 H535 L560 60" />
          <path d="M560 60 H640" />
        </g>

        {/* Trazas que se dibujan por tramos */}
        <path
          d="M40 60 H360"
          pathLength={1}
          stroke={AMBER}
          className="trace-path"
          style={{ animationDelay: "0.2s" }}
        />
        <path
          d="M360 60 L385 35 H535 L560 60"
          pathLength={1}
          stroke={AMBER}
          className="trace-path"
          style={{ animationDelay: "0.8s" }}
        />
        <path
          d="M360 60 L385 85 H535 L560 60"
          pathLength={1}
          stroke={AMBER}
          className="trace-path"
          style={{ animationDelay: "0.8s" }}
        />
        <path
          d="M560 60 H640"
          pathLength={1}
          stroke={AMBER}
          className="trace-path"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Pulso en bucle recorriendo la ruta completa */}
        <path
          d="M40 60 H360 L385 35 H535 L560 60 H640"
          pathLength={1}
          stroke={AMBER}
          className="trace-pulse"
          style={{ animationDelay: "2.2s" }}
        />

        {/* Nodos de etapa */}
        {stages.map((s) => (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy={60}
              r="5"
              fill="var(--color-ink)"
              stroke={AMBER}
              strokeWidth="2"
              className="pad-fade"
              style={{ animationDelay: "1.7s" }}
            />
            <text
              x={s.x}
              y={s.y}
              textAnchor="middle"
              fill="var(--color-text-muted)"
              fontSize="11"
              fontFamily="var(--font-mono)"
              className="pad-fade"
              style={{ animationDelay: "1.7s" }}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Etiquetas de las dos escrituras atómicas */}
        <g
          fontFamily="var(--font-mono)"
          fontSize="11"
          className="pad-fade"
          style={{ animationDelay: "1.7s" }}
        >
          <text x="460" y="26" textAnchor="middle" fill={AMBER}>
            {t(ui.viajePeticion.changeOfState)}
          </text>
          <text x="460" y="104" textAnchor="middle" fill={AMBER}>
            {t(ui.viajePeticion.auditEntry)}
          </text>
          <text x="460" y="64" textAnchor="middle" fill="var(--color-text-muted)">
            {t(ui.viajePeticion.atomic)}
          </text>
        </g>
      </svg>

      <figcaption className="mt-4 font-mono text-xs text-text-muted">
        {t(ui.viajePeticion.caption)}
      </figcaption>
    </figure>
  );
}
