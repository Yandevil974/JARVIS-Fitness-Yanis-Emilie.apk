// Standalone visual study: synthetic examples only. No app, storage or API access.
const screen = document.querySelector(".screen");
const people = {
  yanis: {
    name: "Yanis",
    session: "Haut du corps",
    duration: "45",
    colors: [
      ["Ivoire", "#f7f6f4"],
      ["Pêche", "#fce2d4"],
      ["Orange", "hsl(30 88% 44%)"],
      ["Lavande", "#ece5f6"],
      ["Menthe", "#dff2ec"],
    ],
  },
  emilie: {
    name: "Émilie",
    session: "Corps entier",
    duration: "35",
    colors: [
      ["Ivoire rosé", "hsl(330 17.4% 96.2%)"],
      ["Rose", "hsl(334 74% 50%)"],
      ["Violet", "hsl(272 66% 58%)"],
      ["Lavande", "#ece5f6"],
      ["Menthe", "#dff2ec"],
    ],
  },
};
const nav = [
  ["home", "Accueil"],
  ["barbell", "Séances"],
  ["chart", "Progrès"],
  ["spark", "JARVIS"],
  ["grid", "Plus"],
];
document.querySelector(".bottom-nav").innerHTML = nav
  .map(
    ([icon, name], index) =>
      `<button${index === 0 ? ' class="active" aria-current="page"' : ""}><svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg>${name}</button>`,
  )
  .join("");
let toastTimer;
document.querySelectorAll("button").forEach((button) =>
  button.addEventListener("click", () => {
    const key = button.dataset.person;
    if (key) {
      const person = people[key];
      screen.dataset.profile = key;
      document.querySelector("[data-name]").textContent = person.name;
      document.querySelector("[data-session]").textContent = person.session;
      document.querySelector("[data-duration]").textContent = person.duration;
      document
        .querySelectorAll("[data-person]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      document.querySelector(".swatches").innerHTML = person.colors
        .map(
          ([name, color]) => `<span style="--swatch:${color}">${name}</span>`,
        )
        .join("");
      return;
    }
    const toast = document.querySelector(".toast");
    clearTimeout(toastTimer);
    toast.hidden = false;
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  }),
);
