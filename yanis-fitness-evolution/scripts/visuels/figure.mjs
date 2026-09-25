// Portage 1:1 de la géométrie de src/components/HumanAnim.jsx (buildFigure +
// décor du composant) vers un backend de dessin générique `d`.
// Les formules sont recopiées à l'identique ; seul le JSX est remplacé par
// des appels d.line / d.polyline / d.disc / d.ring / d.rect / d.quad.
// Toute correction de posture doit être appliquée DES DEUX CÔTÉS
// (HumanAnim.jsx = référence affichée ; ce fichier = outil de vérification).
const RAD = Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;

export function joint(x, y, angle, len, up = false) {
  const a = angle * RAD;
  return up
    ? [x + Math.sin(a) * len, y - Math.cos(a) * len]
    : [x + Math.sin(a) * len, y + Math.cos(a) * len];
}

export function interpolatePose(spec, t) {
  const out = {};
  for (const k of Object.keys(spec.a)) {
    const a = spec.a[k], b = spec.b[k];
    out[k] = typeof a === "number" && typeof b === "number" ? lerp(a, b, t) : a;
  }
  return out;
}

const INK = "#31506e";

function bar(d, hand, wide = 50) {
  const c = "#46617f";
  d.line(hand[0] - wide, hand[1], hand[0] + wide, hand[1], 5, c);
  d.line(hand[0] - wide, hand[1] - 9, hand[0] - wide, hand[1] + 9, 9, c);
  d.line(hand[0] + wide, hand[1] - 9, hand[0] + wide, hand[1] + 9, 9, c);
}

function dumbbells(d, hand) {
  const c = "#46617f";
  for (const [x, y] of [hand, [hand[0] - 9, hand[1] + 7]]) {
    d.rect(x - 8, y - 4, 16, 8, c, 1, 2);
    d.rect(x - 11, y - 7, 5, 14, c, 1, 1);
    d.rect(x + 6, y - 7, 5, 14, c, 1, 1);
  }
}

function props(d, p, sh, elbow, hand, chest, hip, ankle) {
  if (p.db) dumbbells(d, hand);
  if (p.bar === "back") bar(d, [chest[0] - 2, chest[1] + 9], 54);
  if (p.bar === "hands") bar(d, [hand[0], (hand[1] + ankle[1]) / 2 + 6], 46);
  if (p.bar === "hips") bar(d, [hip[0], hip[1] - 10], 40);
  if (p.bar === "over") bar(d, hand, 40);
  if (p.cable) {
    const anchor = p.cable === "up" ? [292, 66] : [300, 252];
    d.line(hand[0], hand[1], anchor[0], anchor[1], 3, "#7fa6c9");
    d.rect(anchor[0] - 12, p.cable === "up" ? 48 : 238, 26, 18, "#7fa6c9", 0.55, 4);
  }
  if (p.band)
    d.quad(hand[0], hand[1], (hand[0] + 280) / 2, Math.max(hand[1], 250) + 12, 280, 250, 4, "#e0a24f");
  if (p.grab) d.line(hand[0], hand[1], ankle[0], ankle[1] - 14, 4, "#46617f");
  if (p.support === "left") {
    d.line(120, 84, 120, 284, 10, "#cbb79a");
    d.line(sh[0] - 6, sh[1] + 2, 120, sh[1] + 30, 7, INK);
  }
}

// Dessine la figure pour la pose interpolée t (0 = a, 1 = b).
export function drawFigure(d, spec, t) {
  const p = interpolatePose(spec, t);
  const rig = spec.rig || "stand";
  const lying = rig === "floor-back" || rig === "bench" || rig === "figure4";
  const prone = rig === "prone-machine";
  const L = { torso: 60, neck: 15, upper: 28, fore: 26, thigh: 50, shin: 48, head: 10 };
  let px = 210, py = 176 + (p.pelvisY || 0), floor = 286;
  if (["sit-machine", "machine-seat"].includes(rig)) py = 210;
  if (rig === "bench") ((py = 238), (floor = 286));
  if (rig === "floor-back" || rig === "figure4") ((py = 240 + (p.pelvisY || 0)), (floor = 280));
  if (prone) ((py = 240), (floor = 280));
  if (rig === "plank") ((py = 238), (floor = 284));
  if (rig === "pool") ((py = 208), (floor = 0));
  if (["kneel-rollout", "quadruped", "child"].includes(rig)) ((py = 232), (floor = 284));
  if (rig === "cobra") ((py = 262), (floor = 284));
  if (rig === "sit-floor") ((py = 272), (floor = 284));
  if (rig === "hang") py = 156;

  // --- décor (ordre du composant HumanAnim) ---
  if (floor > 0) d.line(24, floor, 396, floor, 3, "#d9cfbd");
  if (rig === "pool") {
    d.rect(0, 208, 420, 92, "#bfe2f2", 0.55);
    // M0 208 Q 26 201 52 208 T 104 208 ... T 416 208 (T = reflet du contrôle)
    let cx = 0, cy = 208, pcx = 26, pcy = 201;
    d.quad(0, 208, 26, 201, 52, 208, 3, "#8cc6e6");
    cx = 52; cy = 208;
    for (const nx of [104, 156, 208, 260, 312, 364, 416]) {
      const ccx = 2 * cx - pcx, ccy = 2 * cy - pcy;
      d.quad(cx, cy, ccx, ccy, nx, 208, 3, "#8cc6e6");
      pcx = ccx; pcy = ccy; cx = nx; cy = 208;
    }
  }
  if (rig === "bench" || rig === "prone-machine")
    d.rect(140, rig === "bench" ? 244 : 252, 140, 10, "#cbb79a", 1, 4);
  if (rig === "sit-machine" || rig === "machine-seat") {
    d.rect(168, 220, 52, 9, "#cbb79a", 1, 3);
    d.rect(206, 158, 9, 122, "#b9a487", 0.7);
  }
  if (rig === "doorway") d.rect(252, 84, 12, 196, "#cbb79a");
  if (rig === "wall") d.line(292, 40, 292, 284, 6, "#c9bda9");

  // --- figure ---
  if (rig === "pool") {
    const body = [px - 46, py + 8];
    const chestP = joint(body[0], body[1], 78 + (p.torso ?? 0), 40, false);
    const handA = joint(body[0] + 30, py + 2, p.shoulder ?? 0, L.upper + 14);
    d.polyline([body, [px + 18, py + 10], [px + 58, py + 14]], 13, INK, 0.55);
    d.polyline([body, [px + 18, py + 10], [px + 58, py + 14]], 13, INK, 0.45);
    d.disc(chestP[0] + 12, chestP[1] - 8, L.head, INK);
    d.polyline([chestP, handA], 7, INK);
  } else if (lying || prone) {
    const dir = prone ? 1 : -1;
    const chestP = [px + dir * L.torso * Math.cos(((p.torso ?? 8) - (prone ? 0 : 0)) * RAD) * (prone ? -1 : -1), py - (lying ? L.torso * Math.sin((p.torso ?? 8) * RAD) * 0.25 : 0)];
    const hip = [px, py];
    const knee = joint(hip[0], hip[1], prone ? -96 + (p.hip ?? 4) : 90 - (p.hip ?? 8), lying ? L.thigh : L.thigh * 0.9);
    const ankle = joint(knee[0], knee[1], prone ? -96 + (p.hip ?? 4) - (p.knee ?? 6) : 178 - (p.knee ?? 90), L.shin);
    if (!prone && p.legUp) { knee[1] -= p.legUp; ankle[1] -= p.legUp; }
    const head = [chestP[0] + dir * 14, chestP[1] - 6];
    const sh = [chestP[0] + dir * -2, chestP[1] + 6];
    const elbow = joint(sh[0], sh[1], prone ? 40 : 90 + (p.shoulder ?? 0), L.upper);
    const hand = joint(elbow[0], elbow[1], (prone ? 40 : 90 + (p.shoulder ?? 0)) + (p.elbow ?? 0), L.fore);
    d.line(hip[0], hip[1], chestP[0], chestP[1], 15, INK);
    d.disc(head[0], head[1], L.head, INK);
    if (!prone && p.legStraight2) d.polyline([hip, [hip[0] - 50, hip[1] + 2], [hip[0] - 98, hip[1] + 2]], 9, INK, 0.45);
    d.polyline([hip, knee, ankle], 9, INK);
    if (!prone) d.polyline([sh, elbow, hand], 7, INK);
    if (rig === "bench") bar(d, hand);
    if (p.bar === "hips") bar(d, [hip[0] + 10, hip[1] - 12], 40);
  } else if (rig === "plank") {
    const elbow = [px - 34, 268];
    const hand = [px - 18, 268];
    const head = [px - 58, 262 - (p.torso ?? 58) * 0.05];
    const hip = [px + 40, 268 - (p.hip ?? 6) * 0.35];
    const feet = [px + 92, 268];
    d.line(elbow[0] - 12, elbow[1], hip[0], hip[1], 14, INK);
    d.polyline([elbow, [elbow[0] - 14, elbow[1] - 24]], 7, INK);
    d.polyline([hip, feet], 9, INK);
    d.disc(head[0], head[1], L.head, INK);
  } else if (rig === "kneel-rollout") {
    const rt = ((p.torso ?? 30) - 30) / 38;
    const hip = [252 - 20 * rt, 230 + 12 * rt];
    const chestP = [194 - 22 * rt, 218 + 17 * rt];
    const hand = [215 - 85 * rt, 268 + 4 * rt];
    const knee = [254, floor - 8];
    d.polyline([hip, knee, [knee[0] + 20, floor - 2]], 9, INK);
    d.line(hip[0], hip[1], chestP[0], chestP[1], 14, INK);
    d.disc(chestP[0] - 5, chestP[1] - 18, L.head, INK);
    d.polyline([chestP, hand], 7, INK);
    d.ring(hand[0] - 6, floor - 10, 10, 5, INK);
  } else if (rig === "quadruped") {
    const chestP = joint([px - 6, py][0], py, 66 + (p.torso ?? 20) * 0.5, 34, false);
    const head = [chestP[0] - 14, chestP[1] + 6];
    const hand = [chestP[0] - 18, floor - 4];
    const hip = [px + 34, py + (p.hip ?? 60) * 0.16];
    const knee = [px + 44, floor - 14];
    d.line(chestP[0], chestP[1], hip[0], hip[1], 14, INK);
    d.disc(head[0], head[1], L.head, INK);
    d.polyline([hip, knee, [px + 22, floor - 2]], 9, INK);
    d.polyline([chestP, hand], 7, INK);
    if (p.side) d.polyline([hip, [hip[0] + 6, hip[1] - (p.knee ?? 60) * 0.4], [hip[0] + 26, hip[1] - (p.knee ?? 60) * 0.5]], 8, INK, 0.6);
  } else if (rig === "child") {
    const ct = (p.torso ?? 60) - 60;
    const hip = [250, 264];
    const chestP = [195 - ct * 0.3, 272 - ct * 0.4];
    const hand = [chestP[0] - 55, floor - 2];
    const amid = [(chestP[0] + hand[0]) / 2, (chestP[1] + hand[1]) / 2 - 2];
    d.line(hip[0], hip[1], chestP[0], chestP[1], 14.5, INK);
    d.polyline([hip, [228, 280], [272, 282]], 9, INK);
    d.polyline([chestP, amid, hand], 7, INK);
    d.disc(chestP[0] - 12, chestP[1] + 8, L.head, INK);
  } else if (rig === "cobra") {
    const hip = [250, 268];
    const cc = (p.torso ?? 40) * RAD;
    const sh = [hip[0] - 60 * Math.cos(cc), hip[1] - 60 * Math.sin(cc)];
    const head = [sh[0] - 10, sh[1] - 16];
    const hand = [sh[0] + 4, floor - 6];
    d.line(hip[0], hip[1], sh[0], sh[1], 14.5, INK);
    d.polyline([hip, [hip[0] + 50, hip[1] + 8], [hip[0] + 98, hip[1] + 10]], 9, INK);
    d.polyline([sh, hand], 7, INK);
    d.disc(head[0], head[1], L.head, INK);
  } else if (rig === "front") {
    const hipF = [210, 176 + (p.crouch || 0)];
    const chestF = [210 + (p.lean || 0), hipF[1] - 60];
    const headF = [chestF[0], chestF[1] - 20];
    const legF = (sd, ang, tang) => {
      const k = joint(hipF[0] + sd * 4, hipF[1], sd * ang, L.thigh);
      return [[hipF[0] + sd * 4, hipF[1]], k, joint(k[0], k[1], sd * tang, L.shin)];
    };
    const armF = (sh2, ang, bend) => {
      const e = joint(sh2[0], sh2[1], ang, L.upper);
      return [sh2, e, joint(e[0], e[1], ang + bend, L.fore)];
    };
    d.polyline(legF(-1, p.legL ?? 20, p.legTibL ?? 5), 9, INK, p.legGhost ?? 1);
    d.polyline(legF(1, p.legR ?? 20, p.legTibR ?? 5), 9, INK);
    d.line(hipF[0], hipF[1], chestF[0], chestF[1], 14.5, INK);
    d.polyline(armF([chestF[0] + 8, chestF[1] + 4], p.armR ?? 10, p.armBendR ?? 5), 7, INK);
    d.polyline(armF([chestF[0] - 8, chestF[1] + 4], -(p.armL ?? 10), -(p.armBendL ?? 5)), 7, INK);
    d.disc(headF[0], headF[1], L.head, INK);
  } else {
    const hang = rig === "hang";
    const hip = [px, py];
    const spread = p.side || rig === "stand-side" ? Math.max(0, (p.hip ?? 0)) : 0;
    const knee = joint(hip[0], hip[1], (p.hip ?? 2) + spread, L.thigh);
    const ankle = joint(knee[0], knee[1], (p.hip ?? 2) + spread - (p.knee ?? 2), L.shin);
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
    if (!leg2 && p.stance) {
      leg2 = [hip, [hip[0] - 2, hip[1] + L.thigh], [hip[0] - 2, hip[1] + L.thigh + L.shin]];
    }
    if (!leg2 && p.lungeBack) {
      const f2 = [hip[0] - 38, floor - 8];
      leg2 = [hip, [hip[0] + (f2[0] - hip[0]) * 0.51, hip[1] + (f2[1] - hip[1]) * 0.51], f2];
    }
    if (!leg2 && p.kneel) leg2 = [hip, [hip[0] - 8, floor - 4], [hip[0] - 52, floor - 2]];
    if (!leg2 && p.bent2) leg2 = [hip, [hip[0] + 20, hip[1] + 2], [hip[0] + 6, hip[1] + 6]];
    if (!leg2 && p.cross2) leg2 = [hip, [hip[0] + 25, hip[1] + 8], [hip[0] + 48, hip[1] - 6]];
    if (!leg2 && p.lift2) leg2 = [hip, [hip[0] - 15, hip[1] + 30], [hip[0] - 25, hip[1] + 15]];
    const chestP = hang
      ? joint(hip[0], hip[1], (p.torso ?? 2), L.torso, true)
      : joint(hip[0], hip[1], p.torso ?? 4, L.torso, true);
    const head = joint(chestP[0], chestP[1], (p.neck ?? 0) + (hang ? 0 : 8), L.neck + 3, true);
    const sh = [chestP[0], chestP[1] + 4];
    const elbow = hang
      ? joint(sh[0], sh[1], 180 - (p.shoulder ?? 160), L.upper)
      : joint(sh[0], sh[1], p.shoulder ?? 0, L.upper);
    const hand = joint(elbow[0], elbow[1], (p.shoulder ?? 0) + (p.elbow ?? 0) * (hang ? -1 : 1) + (hang ? 180 : 0), L.fore);
    const armBack = [[sh[0] - 7, sh[1] + 3], [elbow[0] - 7, elbow[1] + 4]];
    if (leg2) d.polyline(leg2, 9, INK, 0.45);
    d.polyline([hip, knee, ankle], 9, INK);
    if (p.step) {
      d.rect(ankle[0] - 2, floor - 30, 74, 30, "#cbb79a");
      d.polyline([ankle, [ankle[0] - 6, floor - 30 + (p.heelDrop || 0) * 14], [ankle[0] + 15, floor - 30]], 5, INK);
    } else {
      d.polyline([ankle, [ankle[0] + 15, (ankle[1] + 2) * (1 - (p.toeLift || 0)) + (floor - 1) * (p.toeLift || 0)]], 5, INK);
    }
    d.line(hip[0], hip[1], chestP[0], chestP[1], 14.5 * (p.chest || 1), INK);
    d.polyline(armBack, 6, INK, 0.35);
    d.polyline([sh, elbow, hand], 7, INK);
    d.disc(head[0], head[1], L.head, INK);
    if (rig === "hang") d.line(hand[0] - 22, hand[1], hand[0] + 34, hand[1], 7, INK);
    props(d, p, sh, elbow, hand, chestP, hip, ankle);
  }
}
