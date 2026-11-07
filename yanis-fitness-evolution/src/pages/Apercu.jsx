// Aperçu des visuels retouchés — page de lecture seule.
//
// Rien n'est remplacé ici : cette page montre, dans l'application, les visuels
// retouchés (lots 1 à 21 + prototype 44 = 87 visuels ; chantier 2 « femme » =
// 10 images couvrant 28 numéros) pour que l'utilisateur les juge à l'œil sur
// son téléphone. L'intégration aux médias de l'application ne se fait qu'après
// son accord, numéro par numéro.
import React, { useState } from "react";
import { PageHeading, Panel, Badge, SectionHeading } from "../components/ui.jsx";
import { assetSrc } from "../engine/utils.js";
import { APERCU } from "../data/apercu.js";

const chip = (actif) => ({
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  border: "1px solid var(--line, #2a3442)",
  background: actif ? "var(--mint, #16a34a)" : "transparent",
  color: actif ? "#04140a" : "inherit",
  cursor: "pointer",
});

function Carte({ e, onOpen }) {
  return (
    <Panel className="apercu-card" onClick={() => onOpen(e)} style={{ cursor: "zoom-in", padding: 10 }}>
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#0b0f14" }}>
        <img
          loading="lazy"
          src={assetSrc(e.fichier)}
          alt={e.nom}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(0,0,0,.72)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          n°{e.n}
        </span>
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: e.profil === "femme" ? "rgba(190,24,93,.85)" : "rgba(22,163,74,.85)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          {e.profil === "femme" ? "FEMME" : e.profil === "homme" ? "HOMME" : "—"}
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>{e.nom}</div>
      <div style={{ fontSize: 12, opacity: 0.65 }}>
        {e.lot === "prototype" ? "prototype validé" : `lot ${e.lot}`} · {e.images} image{e.images > 1 ? "s" : ""} ·{" "}
        {e.l}×{e.h}
        {e.alerte ? " · ⚠ à trancher à l'œil" : ""}
      </div>
    </Panel>
  );
}

function Visionneuse({ e, onClose }) {
  if (!e) return null;
  const sans = e.numeros ? e : null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(4,8,12,.94)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        gap: 10,
        overflow: "auto",
      }}
    >
      <img
        src={assetSrc(e.fichier)}
        alt={e.nom}
        style={{ maxWidth: "100%", maxHeight: "62vh", objectFit: "contain", borderRadius: 12 }}
      />
      <div style={{ textAlign: "center", color: "#e8eef6" }}>
        <div style={{ fontWeight: 700 }}>
          n°{e.n} — {e.nom}
        </div>
        {sans ? (
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            couvre les n°{sans.numeros.join(", ")} · {sans.taille} · {sans.images} images
            <br />
            saturation {sans.sat_avant} → {sans.sat_apres} · teinte {sans.teinte_avant}° → {sans.teinte_apres}°
            <br />
            couverture peau {sans.couverture_peau} · débordement {sans.debordement_vert} · manque peau{" "}
            {sans.manque_peau} / vert pâle {sans.manque_vert_pale}
          </div>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            {e.profil === "femme" ? "femme" : "homme"} · {e.lot === "prototype" ? "prototype validé" : `lot ${e.lot}`} ·{" "}
            {e.images} images · empreinte {e.sha256_8}…
          </div>
        )}
        {sans?.alerte ? (
          <div style={{ fontSize: 13, color: "#fbbf24", marginTop: 6, maxWidth: 420 }}>⚠ {sans.alerte}</div>
        ) : null}
        <div style={{ fontSize: 12, opacity: 0.55, marginTop: 10 }}>toucher pour fermer</div>
      </div>
    </div>
  );
}

export default function Apercu() {
  const [vue, setVue] = useState("lots");
  const [ouvert, setOuvert] = useState(null);
  const liste = vue === "lots" ? APERCU.lots : APERCU.sansSource;
  return (
    <>
      <PageHeading
        eyebrow="APERÇU — RIEN N'EST INTÉGRÉ"
        title="Vos visuels retouchés."
        description="Les 87 visuels refaits depuis les PNG natifs et les 10 corrections de vert de la série femme, à juger à l'œil sur le téléphone. Aucun GIF livré n'est remplacé tant que vous n'avez pas dit oui, numéro par numéro."
      />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button style={chip(vue === "lots")} onClick={() => setVue("lots")}>
          Retouches HD ({APERCU.lots.length})
        </button>
        <button style={chip(vue === "sans")} onClick={() => setVue("sans")}>
          Série femme — vert seul ({APERCU.sansSource.length} images / 28 n°)
        </button>
      </div>

      {vue === "sans" ? (
        <Panel style={{ marginBottom: 14, fontSize: 13, lineHeight: 1.55 }}>
          <SectionHeading title="Ce qu'il faut regarder" />
          <div>
            Ces 10 images viennent des GIF livrés (aucune source native) : <b>seul le vert</b> a bougé, à taille
            identique. Cinq tirent vers le cyan — <b>l'eau du bassin peut être prise pour le muscle peint</b> : c'est
            le point à trancher à l'œil (n°292, 313, 210/246, 274/275/276, 326). Les six numéros sans vert du tout (
            {APERCU.sansVert.join(", ")}) n'ont rien à améliorer.
          </div>
        </Panel>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {liste.map((e) => (
          <Carte key={`${e.n}-${e.lot || "sans"}`} e={e} onOpen={setOuvert} />
        ))}
      </div>
      <Visionneuse e={ouvert} onClose={() => setOuvert(null)} />
    </>
  );
}
