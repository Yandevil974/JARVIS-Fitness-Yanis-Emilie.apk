import React, { useId, useState } from "react";
import { numberLabel, dateLabel } from "../engine/utils.js";
import { Icon, Button } from "./ui.jsx";
export function LineChart({
  points = [],
  height = 200,
  unit = "",
  color = "var(--mint)",
  emptyAction,
  onEmpty,
  showLabels = true,
}) {
  const [hover, setHover] = useState(null);
  const id = useId().replace(/:/g, "");
  const width = 620,
    padX = 44,
    padY = 22;
  const valid = points.filter((p) => Number.isFinite(p.value));
  if (!valid.length)
    return (
      <div className="chart-empty" style={{ height }}>
        <div className="chart-grid-lines" />
        <div className="chart-empty-inner">
          <Icon name="ChartNoAxesCombined" size={26} />
          <strong>La progression commence par une mesure.</strong>
          <span>Aucune donnée enregistrée sur cette période.</span>
          {emptyAction && (
            <button className="text-link" onClick={onEmpty}>
              {emptyAction} <Icon name="ArrowRight" size={14} />
            </button>
          )}
        </div>
      </div>
    );
  const vals = valid.map((p) => p.value),
    max = Math.max(...vals),
    min = Math.min(...vals),
    delta = max - min || Math.max(1, max * 0.1);
  const lo = Math.max(0, min - delta * 0.2),
    hi = max + delta * 0.2;
  const coords = valid.map((p, i) => ({
    ...p,
    x:
      padX +
      (valid.length === 1 ? 0.5 : i / (valid.length - 1)) * (width - padX * 2),
    y: height - padY - ((p.value - lo) / (hi - lo)) * (height - padY * 2),
  }));
  const path = coords.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const fill =
    path +
    ` L${coords.at(-1).x},${height - padY} L${coords[0].x},${height - padY}Z`;
  return (
    <div className="line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Graphique de ${valid.length} observations en ${unit}. Première : ${vals[0]}, dernière : ${vals.at(-1)}.`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1={padX}
              x2={width - padX}
              y1={padY + v * (height - padY * 2)}
              y2={padY + v * (height - padY * 2)}
              stroke="var(--line)"
              strokeDasharray="3 5"
            />
            <text
              x={padX - 9}
              y={padY + v * (height - padY * 2) + 3}
              fill="var(--dim)"
              textAnchor="end"
              fontSize="9"
            >
              {numberLabel(hi - v * (hi - lo), 0)}
            </text>
          </g>
        ))}
        <path d={fill} fill={`url(#${id})`} />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {coords.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            aria-label={`${dateLabel(p.date)} : ${numberLabel(p.value)} ${unit}`}
          >
            <circle cx={p.x} cy={p.y} r="13" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={hover === i ? 5 : 3} fill={color} />
            {hover === i && (
              <g>
                <rect
                  x={Math.min(width - 132, Math.max(0, p.x - 60))}
                  y={Math.max(0, p.y - 43)}
                  width="120"
                  height="27"
                  rx="5"
                  fill="var(--panel-3)"
                  stroke="var(--line-strong)"
                />
                <text
                  x={Math.min(width - 72, Math.max(60, p.x))}
                  y={Math.max(17, p.y - 26)}
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize="10"
                >
                  {numberLabel(p.value)} {unit} · {dateLabel(p.date)}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      {showLabels && (
        <div className="chart-labels">
          <span>{dateLabel(valid[0].date)}</span>
          <span>
            {valid.length > 2
              ? dateLabel(valid[Math.floor(valid.length / 2)].date)
              : ""}
          </span>
          <span>{dateLabel(valid.at(-1).date)}</span>
        </div>
      )}
    </div>
  );
}
export function BarChart({ data, unit = "séries" }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="horizontal-bars">
      {data.map((d) => (
        <div key={d.name}>
          <div>
            <span>{d.name}</span>
            <strong>
              {numberLabel(d.value)} <small>{unit}</small>
            </strong>
          </div>
          <div className="bar-track">
            <i
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color || "var(--mint)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
