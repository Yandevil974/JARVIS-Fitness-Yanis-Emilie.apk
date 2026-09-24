import React, { memo, useEffect, useMemo, useRef, useState } from "react";
// Rendu SVG du moteur human-motion : même personnage stylisé pour tous les
// visuels « créés » (traits pleins, fond neutre, sol discret, vue de profil).
const RAD = Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;
// Direction depuis une origine : angle 0 = vers le bas, positif = vers +x
// (avant). `up` inverse (0 = vers le haut).
function joint(x, y, angle, len, up = false) {
  const a = angle * RAD;
  return up
    ? [x + Math.sin(a) * len, y - Math.cos(a) * len]
    : [x + Math.sin(a) * len, y + Math.cos(a) * len];
}
export function interpolatePose(spec, t) {
  const out = {};
  for (const k of Object.keys(spec.a)) {
    const a = spec.a[k],
      b = spec.b[k];
    out[k] = typeof a === "number" && typeof b === "number" ? lerp(a, b, t) : a;
  }
  return out;
}
function Poly({ pts, w, o = 1 }) {
  return (
    <polyline
      points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={o}
    />
  );
}
// The source reference intentionally has no face. The app keeps that
// anatomical language but adds a neutral, created face so the male and female
// characters remain identifiable in every generated movement.
function Face({ x, y, r = 10, gender = "male" }) {
  const female = gender === "female";
  return (
    <g className="human-face" transform={`translate(${x} ${y})`}>
      {female && <path d={`M ${-r * 1.1} ${r * 0.3} Q ${-r * 1.7} ${-r * 1.5} 0 ${-r * 1.45} Q ${r * 1.7} ${-r * 1.5} ${r * 1.1} ${r * 0.3}`} fill="#596368" opacity=".95" />}
      <ellipse rx={r * 1.02} ry={r * 1.12} fill="#e7ebea" stroke="#536067" strokeWidth="1.4" />
      {!female && <path d={`M ${-r * 1.02} ${-r * 0.35} Q 0 ${-r * 1.5} ${r * 1.04} ${-r * 0.38} L ${r * 0.85} ${-r * 0.75} Q 0 ${-r * 1.7} ${-r * 0.86} ${-r * 0.72} Z`} fill="#596368" />}
      <circle cx={-r * 0.34} cy={-r * 0.08} r={Math.max(1.15, r * 0.1)} fill="#273239" />
      <circle cx={r * 0.34} cy={-r * 0.08} r={Math.max(1.15, r * 0.1)} fill="#273239" />
      <path d={`M ${-r * 0.27} ${r * 0.48} Q 0 ${r * 0.68} ${r * 0.27} ${r * 0.48}`} fill="none" stroke="#69757a" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}
function buildFigure(spec, t) {
  const p = interpolatePose(spec, t);
  const rig = spec.rig || "stand";
  const lying = rig === "floor-back" || rig === "bench" || rig === "figure4";
  const prone = rig === "prone-machine";
  const L = { torso: 60, neck: 15, upper: 28, fore: 26, thigh: 50, shin: 48, head: 10 };
  const armActive = ["pec", "dos", "epA", "epL", "epP", "bic", "tri", "avb"].includes(p.active);
  const legActive = ["fes", "moy", "qua", "isc", "add", "mol"].includes(p.active);
  const coreActive = ["abs", "tra", "lom"].includes(p.active);
  let px = 210,
    py = 176 + (p.pelvisY || 0),
    floor = 286;
  if (["sit-machine", "machine-seat"].includes(rig)) py = 210;
  if (rig === "bench") ((py = 222), (floor = 286));
  if (rig === "floor-back" || rig === "figure4") ((py = 240), (floor = 280));
  if (prone) ((py = 240), (floor = 280));
  if (rig === "plank") ((py = 238), (floor = 284));
  if (rig === "pool") ((py = 208), (floor = 0));
  if (["kneel-rollout", "quadruped", "child"].includes(rig)) ((py = 232), (floor = 284));
  if (rig === "hang") py = 156;
  const ink = "#31506e";
  let figure;
  if (rig === "pool") {
    const body = [px - 46, py + 8];
    const chestP = joint(body[0], body[1], 78 + (p.torso ?? 0), 40, false);
    const handA = joint(body[0] + 30, py + 2, p.shoulder ?? 0, L.upper + 14);
    figure = (
      <g color={ink} transform="translate(0 0)">
        <Poly pts={[body, [px + 18, py + 10], [px + 58, py + 14]]} w={13} o={0.55} />
        <Poly pts={[body, [px + 18, py + 10], [px + 58, py + 14]]} w={13} o={0.45} />
        <Face x={chestP[0] + 12} y={chestP[1] - 8} r={L.head} gender={spec.gender} />
        <Poly pts={[chestP, handA]} w={7} />
      </g>
    );
  } else if (lying || prone) {
    const dir = prone ? 1 : -1;
    const chestP = [px + dir * L.torso * Math.cos(((p.torso ?? 8) - (prone ? 0 : 0)) * RAD) * (prone ? -1 : -1), py - (lying ? L.torso * Math.sin((p.torso ?? 8) * RAD) * 0.25 : 0)];
    const hip = [px, py];
    const knee = joint(hip[0], hip[1], prone ? 92 * dir : 90 - (p.hip ?? 8), lying ? L.thigh : L.thigh * 0.9);
    const ankle = joint(knee[0], knee[1], prone ? 178 : 178 - (p.knee ?? 90), L.shin);
    const head = [chestP[0] + dir * 14, chestP[1] - 6];
    const sh = [chestP[0] + dir * -2, chestP[1] + 6];
    const elbow = joint(sh[0], sh[1], prone ? 40 : 90 + (p.shoulder ?? 0), L.upper);
    const hand = joint(elbow[0], elbow[1], (prone ? 40 : 90 + (p.shoulder ?? 0)) + (p.elbow ?? 0), L.fore);
    figure = (
      <g color={ink}>
        <line x1={hip[0]} y1={hip[1]} x2={chestP[0]} y2={chestP[1]} stroke={ink} strokeWidth={15} strokeLinecap="round" />
        <Face x={head[0]} y={head[1]} r={L.head} gender={spec.gender} />
        <Poly pts={[hip, knee, ankle]} w={9} />
        {!prone && <Poly pts={[sh, elbow, hand]} w={7} />}
        {rig === "bench" && <Bar hand={hand} />}
      </g>
    );
  } else if (rig === "plank") {
    const elbow = [px - 34, 268];
    const hand = [px - 18, 268];
    const head = [px - 58, 262 - (p.torso ?? 58) * 0.05];
    const hip = [px + 40, 268 - (p.hip ?? 6) * 0.35];
    const feet = [px + 92, 268];
    figure = (
      <g color={ink}>
        <line x1={elbow[0] - 12} y1={elbow[1]} x2={hip[0]} y2={hip[1]} stroke={ink} strokeWidth={14} strokeLinecap="round" />
        <Poly pts={[elbow, [elbow[0] - 14, elbow[1] - 24]]} w={7} />
        <Poly pts={[hip, feet]} w={9} />
        <Face x={head[0]} y={head[1]} r={L.head} gender={spec.gender} />
      </g>
    );
  } else if (rig === "kneel-rollout" || rig === "quadruped") {
    const chestP = joint([px - 6, py][0], py, 66 + (p.torso ?? 20) * 0.5, 34, false);
    const head = [chestP[0] - 14, chestP[1] + 6];
    const hand = rig === "quadruped" ? [chestP[0] - 18, floor - 4] : joint(chestP[0], chestP[1], 128 + (p.shoulder ?? 8) * 0.2, 30);
    const hip = [px + 34, py + (p.hip ?? 60) * 0.16];
    const knee = [px + 44, floor - 14];
    figure = (
      <g color={ink}>
        <line x1={chestP[0]} y1={chestP[1]} x2={hip[0]} y2={hip[1]} stroke={ink} strokeWidth={14} strokeLinecap="round" />
        <Face x={head[0]} y={head[1]} r={L.head} gender={spec.gender} />
        <Poly pts={[hip, knee, [px + 22, floor - 2]]} w={9} />
        <Poly pts={[chestP, hand]} w={7} />
        {rig === "kneel-rollout" && <circle cx={hand[0] - 6} cy={floor - 10} r="10" fill="none" stroke={ink} strokeWidth="5" />}
        {p.side && <Poly pts={[hip, [hip[0] + 6, hip[1] - (p.knee ?? 60) * 0.4], [hip[0] + 26, hip[1] - (p.knee ?? 60) * 0.5]]} w={8} o={0.6} />}
      </g>
    );
  } else if (rig === "child") {
    const hip = [px + 30, floor - 26];
    const chestP = joint(hip[0], hip[1], 208 + (p.torso ?? 60) * 0.2, 52, true);
    const hand = [chestP[0] - 46, floor - 2];
    figure = (
      <g color={ink}>
        <Poly pts={[chestP, hip, [hip[0] + 8, floor - 2]]} w={14} />
        <Face x={chestP[0] - 12} y={chestP[1] - 6} r={L.head} gender={spec.gender} />
        <Poly pts={[chestP, hand]} w={7} />
      </g>
    );
  } else {
    // Debout / assis machine / suspension / appui mural : chaîne FK classique.
    const hang = rig === "hang";
    const hip = [px, py];
    const spread = p.side || rig === "stand-side" ? Math.max(0, (p.hip ?? 0)) : 0;
    const knee = joint(hip[0], hip[1], (p.hip ?? 2) + spread, L.thigh);
    const ankle = joint(knee[0], knee[1], (p.hip ?? 2) + spread - (p.knee ?? 2), L.shin);
    // 2e jambe : anti-phase (marche), décalée (fentes) ou appui
    let leg2 = null;
    if (p.backLeg) {
      const k2 = joint(hip[0] - 4, hip[1] + 1, -24 - (p.hip ?? 0) * 0.5, L.thigh);
      const a2 = joint(k2[0], k2[1], -24 - (p.hip ?? 0) * 0.5 + 66, L.shin);
      leg2 = [hip, k2, a2];
    } else if (p.anti) {
      const k2 = joint(hip[0] - 3, hip[1], -(p.hip ?? 0), L.thigh);
      const a2 = joint(k2[0], k2[1], -(p.hip ?? 0) + (p.knee ?? 20) * 0.8, L.shin);
      leg2 = [hip, k2, a2];
    } else if (spread > 6) {
      leg2 = [hip, [hip[0], hip[1] + L.thigh], [hip[0], hip[1] + L.thigh + L.shin]];
    } else if (rig === "sit-machine" || rig === "machine-seat" || rig === "wide") {
      const k2 = [hip[0] - 16, hip[1] + 4];
      leg2 = [hip, k2, [k2[0] + 4, k2[1] + L.shin]];
    }
    const chestP = hang
      ? joint(hip[0], hip[1], (p.torso ?? 2), L.torso, true)
      : joint(hip[0], hip[1], p.torso ?? 4, L.torso, true);
    const head = joint(chestP[0], chestP[1], (p.neck ?? 0) + (hang ? 0 : 8), L.neck + 3, true);
    const sh = [chestP[0], chestP[1] + 4];
    const elbow = hang
      ? joint(sh[0], sh[1], 180 - (p.shoulder ?? 160), L.upper)
      : joint(sh[0], sh[1], p.shoulder ?? 0, L.upper);
    const hand = joint(elbow[0], elbow[1], (p.shoulder ?? 0) + (p.elbow ?? 0) * (hang ? -1 : 1) + (hang ? 180 : 0), L.fore);
    const armBack = [
      [sh[0] - 7, sh[1] + 3],
      [elbow[0] - 7, elbow[1] + 4],
    ];
    figure = (
      <g color={ink}>
        {leg2 && <Poly pts={leg2} w={9} o={0.45} />}
        <Poly pts={[hip, knee, ankle]} w={9} />
        <Poly pts={[ankle, [ankle[0] + 15, ankle[1] + 2]]} w={5} />
        <line x1={hip[0]} y1={hip[1]} x2={chestP[0]} y2={chestP[1]} stroke={ink} strokeWidth={14.5 * (p.chest || 1)} strokeLinecap="round" />
        <Poly pts={armBack} w={6} o={0.35} />
        <Poly pts={[sh, elbow, hand]} w={7} />
        {(armActive || coreActive) && <g color="#b7f339" opacity=".78"><Poly pts={[sh, elbow, hand]} w={11} o={armActive ? .3 : .12} /></g>}
        {(legActive || coreActive) && <g color="#b7f339" opacity=".78"><Poly pts={[hip, knee, ankle]} w={13} o={legActive ? .27 : .1} /></g>}
        {coreActive && <line x1={hip[0]} y1={hip[1] - 2} x2={chestP[0]} y2={chestP[1] + 6} stroke="#b7f339" strokeWidth="9" opacity=".2" strokeLinecap="round" />}
        <Face x={head[0]} y={head[1]} r={L.head} gender={spec.gender} />
        {rig === "hang" && <line x1={hand[0] - 22} y1={60} x2={hand[0] + 34} y2="60" stroke={ink} strokeWidth="7" strokeLinecap="round" />}
        <Props p={p} sh={sh} elbow={elbow} hand={hand} chest={chestP} hip={hip} knee={knee} ankle={ankle} floor={floor} />
      </g>
    );
  }
  return { figure, floor };
}
function Bar({ hand, wide = 50 }) {
  return (
    <g stroke="#46617f" strokeWidth="5" strokeLinecap="round">
      <line x1={hand[0] - wide} y1={hand[1]} x2={hand[0] + wide} y2={hand[1]} />
      <line x1={hand[0] - wide} y1={hand[1] - 9} x2={hand[0] - wide} y2={hand[1] + 9} strokeWidth="9" />
      <line x1={hand[0] + wide} y1={hand[1] - 9} x2={hand[0] + wide} y2={hand[1] + 9} strokeWidth="9" />
    </g>
  );
}
function Dumbbells({ hand }) {
  return (
    <g fill="#46617f">
      {[hand, [hand[0] - 9, hand[1] + 7]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 8} y={y - 4} width="16" height="8" rx="2" />
          <rect x={x - 11} y={y - 7} width="5" height="14" rx="1" />
          <rect x={x + 6} y={y - 7} width="5" height="14" rx="1" />
        </g>
      ))}
    </g>
  );
}
function Props({ p, sh, elbow, hand, chest, hip, ankle, floor }) {
  const out = [];
  if (p.db) out.push(<Dumbbells key="db" hand={hand} />);
  if (p.bar === "back") out.push(<Bar key="bb" hand={[chest[0] - 2, chest[1] + 9]} wide={54} />);
  if (p.bar === "hands") out.push(<Bar key="bh" hand={[hand[0], (hand[1] + ankle[1]) / 2 + 6]} wide={46} />);
  if (p.bar === "hips") out.push(<Bar key="bhp" hand={[hip[0], hip[1] - 10]} wide={40} />);
  if (p.bar === "over") out.push(<Bar key="bo" hand={hand} wide={40} />);
  if (p.cable) {
    const anchor = p.cable === "up" ? [292, 66] : [300, 252];
    out.push(
      <g key="cb">
        <line x1={hand[0]} y1={hand[1]} x2={anchor[0]} y2={anchor[1]} stroke="#7fa6c9" strokeWidth="3" />
        <rect x={anchor[0] - 12} y={p.cable === "up" ? 48 : 238} width="26" height="18" rx="4" fill="#7fa6c9" opacity=".55" />
      </g>,
    );
  }
  if (p.band)
    out.push(
      <path key="bd" d={`M ${hand[0]} ${hand[1]} Q ${(hand[0] + 280) / 2} ${Math.max(hand[1], 250) + 12} 280 250`} stroke="#e0a24f" strokeWidth="4" fill="none" />,
    );
  if (p.grab) out.push(<line key="gr" x1={hand[0]} y1={hand[1]} x2={ankle[0]} y2={ankle[1] - 14} stroke="#46617f" strokeWidth="4" strokeLinecap="round" />);
  return out;
}
function HumanAnim({ spec, gender = "male", paused = false, reduced = false, small = false, className = "" }) {
  const startRef = useRef(0);
  const renderSpec = useMemo(() => ({ ...spec, gender: spec.gender || gender }), [spec, gender]);
  const [t, setT] = useState(reduced || paused ? 0.6 : 0);
  useEffect(() => {
    if (paused || reduced || !spec) return;
    let alive = true;
    const cycle = Math.max(900, Math.min(9000, spec.cycle || 2600));
    startRef.current = performance.now();
    const step = (now) => {
      if (!alive) return;
      const phase = ((now - startRef.current) % cycle) / cycle;
      const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      setT(spec.pulse ? 0.82 + 0.18 * Math.sin(phase * Math.PI) : tri);
      requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [paused, reduced, spec]);
  const model = useMemo(() => (renderSpec ? buildFigure(renderSpec, t) : null), [renderSpec, t]);
  if (!model) return null;
  return (
    <svg
      viewBox="0 0 420 300"
      className={`human-anim movement-svg ${small ? "small" : ""} ${className}`}
      role="img"
      aria-label={spec.label || "Animation humaine du mouvement"}
    >
      {model.floor > 0 && <line x1="24" y1={model.floor} x2="396" y2={model.floor} stroke="#d9cfbd" strokeWidth="3" />}
      {spec.rig === "pool" && (
        <g>
          <rect x="0" y="208" width="420" height="92" fill="#bfe2f2" opacity=".55" />
          <path d="M0 208 Q 26 201 52 208 T 104 208 T 156 208 T 208 208 T 260 208 T 312 208 T 364 208 T 416 208" stroke="#8cc6e6" strokeWidth="3" fill="none" />
        </g>
      )}
      {(spec.rig === "bench" || spec.rig === "prone-machine") && (
        <rect x="140" y={spec.rig === "bench" ? 244 : 252} width="140" height="10" rx="4" fill="#cbb79a" />
      )}
      {(spec.rig === "sit-machine" || spec.rig === "machine-seat") && (
        <g>
          <rect x="168" y="220" width="52" height="9" rx="3" fill="#cbb79a" />
          <rect x="206" y="158" width="9" height="122" fill="#b9a487" opacity=".7" />
        </g>
      )}
      {spec.rig === "doorway" && <rect x="252" y="84" width="12" height="196" fill="#cbb79a" />}
      {spec.rig === "wall" && <line x1="292" y1="40" x2="292" y2="284" stroke="#c9bda9" strokeWidth="6" />}
      {model.figure}
    </svg>
  );
}
export default memo(HumanAnim);
