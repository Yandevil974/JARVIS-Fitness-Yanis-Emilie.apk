// Visual mockup only: no application imports, storage, microphone or API calls.
const people = {
  yanis: { name: "Yanis", session: "Haut du corps 1", duration: "45" },
  emilie: { name: "Émilie", session: "Corps entier", duration: "35" },
};
const nav = [
  ["home", "Accueil"],
  ["barbell", "Séances"],
  ["chart", "Progrès"],
  ["spark", "JARVIS"],
  ["grid", "Plus"],
];
document.querySelectorAll(".bottom-nav").forEach((el) => {
  el.innerHTML = nav
    .map(
      ([icon, name], i) =>
        `<button${i === 0 ? ' class="active" aria-current="page"' : ""}><svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg>${name}</button>`,
    )
    .join("");
});
const orbMarkup = document.querySelector(".jarvis-orb").outerHTML;
document.querySelector("#orb-demo").innerHTML = ["light", "dark"]
  .map(
    (theme) =>
      `<div class="sample ${theme}"><span>${theme === "light" ? "CLAIR" : "SOMBRE COLORÉ"}</span>${orbMarkup}</div>`,
  )
  .join("");
const motionButton = document.querySelector("#motion-toggle");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function syncMotionPreference() {
  motionButton.disabled = reducedMotion.matches;
  motionButton.textContent = reducedMotion.matches
    ? "Mouvements réduits respectés"
    : document.body.dataset.motion === "paused"
      ? "Animer l’orbe"
      : "Mettre l’orbe en pause";
}
reducedMotion.addEventListener("change", syncMotionPreference);
syncMotionPreference();
let toastTimer;
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button === motionButton) {
    const pause = document.body.dataset.motion !== "paused";
    document.body.dataset.motion = pause ? "paused" : "running";
    button.setAttribute("aria-pressed", String(pause));
    syncMotionPreference();
    return;
  }
  if (button.dataset.person) {
    const screen = button.closest(".screen");
    const person = people[button.dataset.person];
    screen.dataset.profile = button.dataset.person;
    screen.querySelector("[data-name]").textContent = person.name;
    screen.querySelector("[data-session]").textContent = person.session;
    screen.querySelector("[data-duration]").textContent = person.duration;
    screen
      .querySelectorAll("[data-person]")
      .forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
    return;
  }
  const toast = document.querySelector(".toast");
  clearTimeout(toastTimer);
  toast.hidden = false;
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
});
