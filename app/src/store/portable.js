import { download, today } from "../engine/utils.js";
export async function exportPortable(state) {
  if (globalThis.__JARVIS_PORTABLE__) {
    const root = document.documentElement.cloneNode(true);
    root.querySelector("#root").innerHTML = "";
    root.querySelector("#jarvis-preload")?.remove();
    const preload = document.createElement("script");
    preload.id = "jarvis-preload";
    preload.textContent =
      "globalThis.__JARVIS_PRELOAD__=" +
      JSON.stringify(state).replace(/</g, "\\u003c") +
      ";";
    root.querySelector("head").appendChild(preload);
    download(
      `JARVIS-application-${today()}.html`,
      "<!doctype html>\n" + root.outerHTML,
      "text/html",
    );
    return;
  }
  const [runtime, css, index] = await Promise.all([
    fetch("/runtime.js").then((r) => {
      if (!r.ok)
        throw new Error(
          "Export portable en préparation. Utilisez le JSON ou le fichier HTML portable livré avec le projet.",
        );
      return r.text();
    }),
    fetch("/runtime.css").then((r) => r.text()),
    fetch("/media-index.json").then((r) => r.json()),
  ]);
  if (runtime.trim().startsWith("<"))
    throw new Error(
      "Le runtime portable est absent. Lancez npm run build:portable, ou utilisez la sauvegarde JSON.",
    );
  const assets = {};
  let cursor = 0;
  const read = async () => {
    while (cursor < index.length) {
      const path = index[cursor++];
      const response = await fetch(path);
      if (!response.ok) throw new Error("Média indisponible : " + path);
      const blob = await response.blob();
      assets[path] = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
    }
  };
  await Promise.all(Array.from({ length: 6 }, read));
  const inlineCSS = css.replace(
    /url\((['"]?)([^)'"\s]+)\1\)/g,
    (match, q, url) => {
      let path = url.replace(/^\.\.\//, "/").replace(/^\.\//, "/");
      return assets[path] ? `url("${assets[path]}")` : match;
    },
  );
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#173452"><title>JARVIS — Fitness Intelligence</title><style>${inlineCSS}</style><script id="jarvis-preload">globalThis.__JARVIS_PRELOAD__=${JSON.stringify(state).replace(/</g, "\\u003c")};<\/script></head><body><div id="root"></div><script>globalThis.__JARVIS_PORTABLE__=true;globalThis.__JARVIS_ASSETS__=${JSON.stringify(assets).replace(/</g, "\\u003c")};<\/script><script type="module">${runtime.replace(/<\/script/gi, "<\\/script")}<\/script></body></html>`;
  download(`JARVIS-application-${today()}.html`, html, "text/html");
}
