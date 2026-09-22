// Isolated design study. No app imports, personal data, network, microphone or storage APIs.
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" aria-hidden="true"><use href="#${name}"></use></svg>`;
const orb = (cls = "") =>
  `<div class="orb ${cls}" aria-hidden="true"><div class="orb-grid"></div><div class="orb-ring outer"></div><div class="orb-ring middle"></div><div class="orb-ring inner"></div><div class="orb-core"></div><i class="orb-cross x"></i><i class="orb-cross y"></i><span class="orb-label">J / E</span></div>`;
const status = `<div class="statusbar"><span>09:41</span><span class="island"></span><span class="status-right"><i class="signal"></i><span>▰</span></span></div>`;
const header = `<header class="app-header"><div class="brand"><span class="app-mark">Y<span>/</span>E</span><div>YANIS FITNESS<small>EVOLUTION</small></div></div><button class="icon-button" aria-label="Voir les notifications de démonstration">${icon("bell")}<i></i></button></header>`;
const profiles = `<div class="profile-strip"><div class="profile-switch" aria-label="Profil de démonstration"><button type="button" data-profile="Yanis" aria-pressed="true">Yanis</button><button type="button" data-profile="Émilie" aria-pressed="false">Émilie</button></div><span class="local"><i></i>MODE LOCAL</span></div>`;
const nav = `<nav class="bottom-nav" aria-label="Navigation de démonstration">${[
  ["home", "Accueil"],
  ["barbell", "Séance"],
  ["chart", "Suivi"],
  ["spark", "JARVIS"],
  ["grid", "Plus"],
]
  .map(
    ([i, label], index) =>
      `<button class="${index === 0 ? "active" : ""}" aria-label="${label} — maquette">${icon(i)}<span>${label}</span></button>`,
  )
  .join("")}</nav><div class="gesture"></div>`;
const task = (compact = false) =>
  `<section class="priorities ${compact ? "compact" : ""}"><div class="section-title"><h3>À ne pas oublier</h3><span>01 ACTION</span></div><button class="task-row"><span class="task-icon">${icon("ruler")}</span><span><b>Mes mensurations</b><small>Un relevé à compléter</small></span><span class="task-tag">À faire</span>${icon("chevron")}</button></section>`;
const session = (variant = "") =>
  `<section class="session ${variant}"><div class="card-meta"><span>PROCHAINE SÉANCE</span><span class="time">${icon("clock")}18:00</span></div><div class="session-title"><div><h3 class="session-name">Haut du corps</h3><p><span class="session-duration">45</span> min <i>·</i> Force <i>·</i> 6 exercices</p></div><div class="training-symbol">${icon("barbell")}</div></div><div class="session-bottom"><span class="session-hint">Ton ressenti avant l’effort.</span><button class="primary">Préparer ma séance ${icon("arrow")}</button></div></section>`;
const briefing = (type = "") =>
  `<section class="briefing ${type}"><div class="briefing-head"><span class="spark-box">${icon("spark")}</span><div><h3>Le point JARVIS</h3><span>TON ÉQUIPE · RÈGLES LOCALES</span></div><button class="listen" aria-label="Écouter le point — maquette">${icon("volume")}</button></div><p>Ta séance et un point de suivi<br>t’attendent aujourd’hui.</p><div class="briefing-foot"><span>À partir des données enregistrées</span><button aria-label="Voir pourquoi — maquette">Voir pourquoi ${icon("arrow")}</button></div></section>`;
const welcome = (tag, title) =>
  `<div class="welcome"><span class="micro">LUNDI 21 SEPTEMBRE · DÉMONSTRATION</span><h2>${title} <span data-name>Yanis</span><span class="welcome-punct">.</span></h2><p>${tag}</p></div>`;
const data = [
  {
    id: "a",
    title: "NEXUS",
    subtitle: "Le cockpit JARVIS",
    desc: "Bleu nuit, cyan lumineux et orbe technique. La présence JARVIS est assumée.",
    tags: ["Immersif", "Identité forte"],
    screen: `${welcome("Ton équipe. Ton rythme. Ton prochain pas.", "Bonjour,")}<section class="nexus-hero"><div class="hud-text"><span class="micro">JARVIS / EN VEILLE</span><h3>Prêt pour<br>ton point.</h3><button class="text-action">${icon("volume")}Écouter le point</button><small>Voix à la demande</small></div>${orb()}<div class="hud-coordinate">01 / SUIVI PERSONNEL</div></section>${session()}${task()}<div class="quiet-row">${icon("calendar")}Mon programme <span>Voir la semaine ${icon("arrow")}</span></div>`,
  },
  {
    id: "b",
    title: "VECTOR",
    subtitle: "Le futuriste utile",
    desc: "Un accueil plus net : la séance d’abord, puis le point de l’équipe et la priorité.",
    tags: ["Lisible", "Efficace"],
    screen: `${welcome("L’essentiel pour avancer, sans te disperser.", "Bonjour,")}<div class="day-rail"><span><i></i>AUJOURD’HUI</span><span>TON CAP, EN UN COUP D’ŒIL</span></div>${session("featured")}${briefing()}${task(true)}<button class="week-row"><span>${icon("calendar")}Mon programme</span><span>La semaine ${icon("arrow")}</span></button>`,
  },
  {
    id: "c",
    title: "ORBIT",
    subtitle: "Le compagnon futuriste",
    desc: "Verre fumé, halo indigo et cartes douces. Une présence plus calme, moins technique.",
    tags: ["Apaisant", "Personnel"],
    screen: `<section class="orbit-hero">${orb("soft")}<span class="micro">LUNDI 21 SEPTEMBRE · DÉMONSTRATION</span><h2>Bonjour, <span data-name>Yanis</span>.</h2><p>On fait le point ensemble ?</p><button class="pill">${icon("volume")}Écouter mon équipe<span>→</span></button><small>Voix à la demande · mode local</small></section>${session("glass")}${task(true)}<button class="week-row"><span>${icon("calendar")}Mon programme</span><span>La semaine ${icon("arrow")}</span></button>`,
  },
];
document.querySelector(".concepts").innerHTML = data
  .map(
    (c) =>
      `<article class="concept ${c.id}" data-concept="${c.id}" aria-labelledby="title-${c.id}"><div class="concept-heading"><span class="concept-letter">${c.id.toUpperCase()}</span><div><h2 id="title-${c.id}">${c.title}</h2><p>${c.subtitle}</p></div>${c.id === "b" ? '<span class="recommended">CONSEILLÉ</span>' : ""}</div><div class="phone"><div class="screen">${status}${header}${profiles}<div class="content">${c.screen}</div>${nav}</div></div><div class="concept-footer"><div class="tags">${c.tags.map((x) => `<span>${x}</span>`).join("")}</div><p>${c.desc}</p></div></article>`,
  )
  .join("");
let timer;
document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;
  if (button.dataset.profile) {
    const screen = button.closest(".screen"),
      name = button.dataset.profile;
    screen
      .querySelectorAll("[data-name]")
      .forEach((n) => (n.textContent = name));
    screen
      .querySelectorAll("[data-profile]")
      .forEach((n) => n.setAttribute("aria-pressed", String(n === button)));
    screen
      .querySelectorAll(".session-name")
      .forEach(
        (n) =>
          (n.textContent = name === "Yanis" ? "Haut du corps" : "Corps entier"),
      );
    screen
      .querySelectorAll(".session-duration")
      .forEach((n) => (n.textContent = name === "Yanis" ? "45" : "40"));
    return;
  }
  const toast = document.querySelector(".toast");
  toast.hidden = false;
  if (button.closest(".bottom-nav") && button.textContent.includes("Plus"))
    toast.textContent =
      "Maquette : les 11 rubriques existantes restent accessibles, sans suppression de fonctions.";
  else
    toast.textContent =
      "Maquette uniquement : aucune séance lancée, aucun message envoyé et aucun micro activé.";
  clearTimeout(timer);
  timer = setTimeout(() => (toast.hidden = true), 4500);
});
