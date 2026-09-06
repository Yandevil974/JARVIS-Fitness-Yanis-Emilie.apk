import React, { useId, useState } from "react";
import { MUSCLES } from "../data/library.js";
import { assetSrc } from "../engine/utils.js";
import { Icon } from "./ui.jsx";
import { FRONT_REGIONS, BACK_REGIONS } from "./anatomical-regions.js";
function Region({ region, ...props }) {
  return (
    <path
      d={typeof region === "string" ? region : region.d}
      transform={region.mirror ? "translate(688 0) scale(-1 1)" : undefined}
      {...props}
    />
  );
}
function Figure({ back, primary, secondary, onSelect }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, ""),
    regions = back ? BACK_REGIONS : FRONT_REGIONS,
    path = assetSrc(`/human/${back ? "back" : "front"}.webp`);
  return (
    <svg
      className="anatomy-svg realistic-anatomy"
      viewBox="135 5 420 750"
      role="group"
      aria-label={`Anatomie humaine réaliste, vue ${back ? "postérieure" : "antérieure"}. Zones indicatives.`}
    >
      <defs>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id={`${id}-primary`} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values=".21 .08 .06 0 .08 .20 .32 .13 0 .16 .26 .42 .28 0 .27 0 0 0 1 0"
          />
        </filter>
        <filter id={`${id}-secondary`} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values=".36 .25 .19 0 .04 .33 .34 .24 0 .06 .33 .36 .31 0 .11 0 0 0 1 0"
          />
        </filter>
        <mask id={`${id}-main`}>
          {regions
            .filter(([m]) => primary.includes(m))
            .map(([m, r], i) => (
              <Region
                region={r}
                key={i}
                fill="white"
                filter={`url(#${id}-soft)`}
              />
            ))}
        </mask>
        <mask id={`${id}-second`}>
          {regions
            .filter(([m]) => secondary.includes(m) && !primary.includes(m))
            .map(([m, r], i) => (
              <Region
                region={r}
                key={i}
                fill="white"
                filter={`url(#${id}-soft)`}
              />
            ))}
        </mask>
      </defs>
      <image href={path} x="0" y="0" width="688" height="768" />
      <image
        href={path}
        width="688"
        height="768"
        mask={`url(#${id}-second)`}
        filter={`url(#${id}-secondary)`}
      />
      <image
        href={path}
        width="688"
        height="768"
        mask={`url(#${id}-main)`}
        filter={`url(#${id}-primary)`}
      />
      {regions.map(([muscle, r], i) => (
        <Region
          region={r}
          key={i}
          className="anatomy-hit-area"
          fill="transparent"
          tabIndex={onSelect ? 0 : undefined}
          role={onSelect ? "button" : undefined}
          aria-label={MUSCLES[muscle]}
          onClick={() => onSelect?.(muscle)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect?.(muscle);
            }
          }}
        >
          <title>{MUSCLES[muscle]}</title>
        </Region>
      ))}
    </svg>
  );
}
export default function Anatomy({
  primary = ["dos"],
  secondary = ["bic", "epP"],
  onSelect,
  compact = false,
}) {
  const [selected, setSelected] = useState(null);
  const select = (m) => {
    setSelected(m);
    onSelect?.(m);
  };
  return (
    <div className={`anatomy human-atlas ${compact ? "compact" : ""}`}>
      <div className="anatomy-figures">
        <div>
          <Figure primary={primary} secondary={secondary} onSelect={select} />
          <span>ANTÉRIEUR</span>
        </div>
        <div>
          <Figure
            back
            primary={primary}
            secondary={secondary}
            onSelect={select}
          />
          <span>POSTÉRIEUR</span>
        </div>
      </div>
      {selected && (
        <div className="muscle-tooltip">
          <Icon name="Focus" size={13} />
          {MUSCLES[selected]}
          <button
            aria-label="Masquer le muscle"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
        </div>
      )}
      <div className="anatomy-legend">
        <span>
          <i />
          Principal
        </span>
        <span>
          <i />
          Secondaire
        </span>
      </div>
    </div>
  );
}
