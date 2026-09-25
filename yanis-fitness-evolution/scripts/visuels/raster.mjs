// Rastériseur minimaliste (zéro dépendance) pour la vérification des visuels.
// Supporte exactement les primitives émises par figure.mjs (portage de
// HumanAnim.jsx) : lignes épaisses à bouts ronds, polylignes, disques,
// anneaux, rectangles (coins arrondis), quadratiques échantillonnées.
// Sortie PNG via zlib (natif node) + CRC32 maison.
import { deflateSync } from "node:zlib";

export function hex(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const CRC_T = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

export class Canvas {
  constructor(w, h, bg = "#f4f1ea") {
    this.w = w;
    this.h = h;
    this.px = new Uint8ClampedArray(w * h * 3);
    const [r, g, b] = hex(bg);
    for (let i = 0; i < w * h; i++) {
      this.px[i * 3] = r;
      this.px[i * 3 + 1] = g;
      this.px[i * 3 + 2] = b;
    }
  }
  blend(x, y, r, g, b, a) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || a <= 0) return;
    const i = (y * this.w + x) * 3;
    const ia = 1 - a;
    this.px[i] = r * a + this.px[i] * ia;
    this.px[i + 1] = g * a + this.px[i + 1] * ia;
    this.px[i + 2] = b * a + this.px[i + 2] * ia;
  }
  // Ligne épaisse, bouts ronds (équivalent stroke-linecap round).
  line(x0, y0, x1, y1, w, color, alpha = 1) {
    const [r, g, b] = typeof color === "string" ? hex(color) : color;
    const rad = w / 2;
    const minx = Math.max(0, Math.floor(Math.min(x0, x1) - rad - 1));
    const maxx = Math.min(this.w - 1, Math.ceil(Math.max(x0, x1) + rad + 1));
    const miny = Math.max(0, Math.floor(Math.min(y0, y1) - rad - 1));
    const maxy = Math.min(this.h - 1, Math.ceil(Math.max(y0, y1) + rad + 1));
    const dx = x1 - x0, dy = y1 - y0;
    const len2 = dx * dx + dy * dy || 1;
    for (let y = miny; y <= maxy; y++) {
      for (let x = minx; x <= maxx; x++) {
        const cx = x + 0.5, cy = y + 0.5;
        let t = ((cx - x0) * dx + (cy - y0) * dy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = x0 + t * dx, py = y0 + t * dy;
        const d = Math.hypot(cx - px, cy - py);
        if (d <= rad) {
          // Léger anti-crénelage sur 1 px.
          const aa = d > rad - 1 ? (rad - d) : 1;
          this.blend(x, y, r, g, b, alpha * aa);
        }
      }
    }
  }
  polyline(pts, w, color, alpha = 1) {
    for (let i = 0; i + 1 < pts.length; i++)
      this.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w, color, alpha);
    // Jointures rondes : pastille à chaque sommet intérieur.
    for (let i = 1; i + 1 < pts.length; i++)
      this.disc(pts[i][0], pts[i][1], w / 2, color, alpha);
  }
  disc(cx, cy, r, color, alpha = 1) {
    const [rr, gg, bb] = typeof color === "string" ? hex(color) : color;
    const minx = Math.max(0, Math.floor(cx - r - 1));
    const maxx = Math.min(this.w - 1, Math.ceil(cx + r + 1));
    const miny = Math.max(0, Math.floor(cy - r - 1));
    const maxy = Math.min(this.h - 1, Math.ceil(cy + r + 1));
    for (let y = miny; y <= maxy; y++)
      for (let x = minx; x <= maxx; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d <= r) {
          const aa = d > r - 1 ? r - d : 1;
          this.blend(x, y, rr, gg, bb, alpha * aa);
        }
      }
  }
  ring(cx, cy, r, w, color, alpha = 1) {
    const [rr, gg, bb] = typeof color === "string" ? hex(color) : color;
    const ro = r + w / 2, ri = Math.max(0.5, r - w / 2);
    const minx = Math.max(0, Math.floor(cx - ro - 1));
    const maxx = Math.min(this.w - 1, Math.ceil(cx + ro + 1));
    const miny = Math.max(0, Math.floor(cy - ro - 1));
    const maxy = Math.min(this.h - 1, Math.ceil(cy + ro + 1));
    for (let y = miny; y <= maxy; y++)
      for (let x = minx; x <= maxx; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d <= ro && d >= ri) this.blend(x, y, rr, gg, bb, alpha);
      }
  }
  rect(x, y, w, h, color, alpha = 1, rx = 0) {
    const [r, g, b] = typeof color === "string" ? hex(color) : color;
    const minx = Math.max(0, Math.floor(x));
    const maxx = Math.min(this.w - 1, Math.ceil(x + w));
    const miny = Math.max(0, Math.floor(y));
    const maxy = Math.min(this.h - 1, Math.ceil(y + h));
    for (let yy = miny; yy <= maxy; yy++) {
      for (let xx = minx; xx <= maxx; xx++) {
        const cx = xx + 0.5, cy = yy + 0.5;
        // Coins arrondis : distance au rectangle intérieur.
        const qx = Math.min(Math.max(cx, x + rx), x + w - rx);
        const qy = Math.min(Math.max(cy, y + rx), y + h - rx);
        const inside = rx <= 0
          ? cx >= x && cx <= x + w && cy >= y && cy <= y + h
          : Math.hypot(cx - (w > 2 * rx ? qx : x + w / 2), cy - (h > 2 * rx ? qy : y + h / 2)) <= rx ||
            (cx >= x && cx <= x + w && cy >= y + rx && cy <= y + h - rx) ||
            (cy >= y && cy <= y + h && cx >= x + rx && cx <= x + w - rx);
        if (inside) this.blend(xx, yy, r, g, b, alpha);
      }
    }
  }
  // Courbe quadratique échantillonnée en segments.
  quad(x0, y0, cx, cy, x1, y1, w, color, alpha = 1) {
    let px = x0, py = y0;
    const n = 24;
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
      const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
      this.line(px, py, x, y, w, color, alpha);
      px = x;
      py = y;
    }
  }
  // Copie un buffer RGBA dans le canvas (agrandissement au plus proche).
  blit(rgba, w, h, ox, oy, scale = 1, bg = null) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const a = rgba[i + 3] / 255;
        if (a <= 0) continue;
        let r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
        for (let sy = 0; sy < scale; sy++)
          for (let sx = 0; sx < scale; sx++)
            this.blend(ox + x * scale + sx, oy + y * scale + sy, r, g, b, a);
      }
    }
  }
  toPNG() {
    const { w, h, px } = this;
    const raw = Buffer.alloc((w * 3 + 1) * h);
    for (let y = 0; y < h; y++) {
      raw[y * (w * 3 + 1)] = 0;
      Buffer.from(px.subarray(y * w * 3, (y + 1) * w * 3)).copy(raw, y * (w * 3 + 1) + 1);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
  }
}
