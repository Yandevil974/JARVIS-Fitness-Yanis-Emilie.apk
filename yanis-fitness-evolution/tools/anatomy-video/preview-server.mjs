// Serveur de prévisualisation (outil de développement uniquement).
// Sert la vidéo générée + une fiche qui reproduit le lecteur intégré à
// l'application (mêmes états lecture/pause, même libellé).
//
//   node tools/anatomy-video/preview-server.mjs
//   → http://localhost:8099
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const MEDIA = path.resolve(ROOT, "..", "..", "public", "media", "video");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(MEDIA, "manifest.json"), "utf8"));
const PORT = Number(process.env.PORT || 8099);
const TYPES = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".html": "text/html; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = fs
      .readFileSync(path.join(ROOT, "preview.html"), "utf8")
      .replace("__MANIFEST__", JSON.stringify(MANIFEST));
    res.writeHead(200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" });
    return res.end(html);
  }
  const rel = url.pathname.replace(/^\/media\/video\/?/, "");
  const file = path.resolve(MEDIA, rel);
  if (!file.startsWith(MEDIA) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end("not found");
    return;
  }
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const range = req.headers.range;
  if (range) {
    const [startRaw, endRaw] = range.replace(/bytes=/, "").split("-");
    const start = Number(startRaw);
    const end = endRaw ? Number(endRaw) : stat.size - 1;
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(file).pipe(res);
});
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Prévisualisation vidéo : http://localhost:${PORT}`),
);
