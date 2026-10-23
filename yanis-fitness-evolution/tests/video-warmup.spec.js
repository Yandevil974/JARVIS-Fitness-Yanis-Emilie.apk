import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

test("JARVIS Brain 1.8.8 reste présent avec le module vidéo", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "JARVIS", exact: true })
    .click();
  await expect(
    page.getByText("Mémoire contrôlée", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("PLATE-FORME IA PERSONNELLE", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("l'échauffement test7 affiche ses vidéos dans le récap et le minuteur", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await startSourceWorkout(page);
  await page.locator(".sequence-warmup").first().click();
  const dialog = page.getByRole("dialog", {
    name: "Bien commencer, c’est déjà progresser.",
  });
  await expect(dialog).toBeVisible();
  const sources = await dialog
    .locator(".warmup-step-thumb.has-video video")
    .evaluateAll((videos) => videos.map((video) => video.getAttribute("src")));
  expect(sources).toEqual(
    expect.arrayContaining([
      "/videos/warmup-mise-en-route.mp4",
      "/videos/warmup-mobilite-epaules.mp4",
      "/videos/warmup-activation-scapulaire.mp4",
    ]),
  );
  await expect(dialog.locator(".warmup-overview video")).toHaveAttribute(
    "src",
    "/videos/warmup-apercu-complet.mp4",
  );
  await dialog
    .getByRole("button", { name: "Lancer l’échauffement guidé", exact: true })
    .click();
  await expect(
    page.locator(".timer-step-visual.has-video video"),
  ).toHaveAttribute("src", "/videos/warmup-mise-en-route.mp4");
  expect(errors).toEqual([]);
});

test("biceps #02 et #09 affichent leur vidéo IA et dictent la prise fixe", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Entraînement", exact: true })
    .click();
  await page.getByRole("tab", { name: /Bibliothèque/ }).click();
  await page.evaluate(() => {
    window.__spoken = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.getVoices = () => [];
    window.speechSynthesis.speak = (utterance) =>
      window.__spoken.push(utterance.text);
  });

  const cases = [
    {
      name: "Curl Scott barre EZ, pronation",
      query: "Curl Scott barre EZ",
      src: "/videos/curl-scott-barre-ez-pronation.mp4",
    },
    {
      name: "Curl haltère supination, banc Scott 90°",
      query: "Curl haltère supination, banc Scott 90",
      src: "/videos/curl-haltere-supination-banc-scott-90.mp4",
    },
  ];
  for (const [index, item] of cases.entries()) {
    await page.getByLabel("Rechercher un exercice").fill(item.query);
    await page
      .getByRole("button", {
        name: `Démonstration ${item.name}`,
        exact: true,
      })
      .click();
    const dialog = page.getByRole("dialog", {
      name: item.name,
      exact: true,
    });
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "src",
      item.src,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      /paumes vers le sol/i,
    );
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      /ne reproduisez pas cette rotation/i,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(/paumes vers le sol/i);
    expect(spoken).toMatch(/dos des mains vers le haut/i);
    expect(spoken).toMatch(/poignets verrouillés/i);
    expect(spoken).toMatch(/Ne reproduisez pas/i);

    if (index === 0) {
      await dialog
        .getByRole("button", { name: "Agrandir", exact: true })
        .click();
      const viewer = page.getByRole("dialog", {
        name: /Vidéo IA · Curl Scott EZ/,
      });
      await expect(viewer.locator(".movement-coaching-note")).toBeVisible();
      await expect(
        viewer.getByRole("button", {
          name: "Écouter le descriptif",
          exact: true,
        }),
      ).toBeVisible();
      await viewer
        .getByRole("button", { name: "Fermer", exact: true })
        .last()
        .click();
    } else {
      await dialog
        .getByRole("button", { name: "Fermer", exact: true })
        .last()
        .click();
    }
  }
  expect(errors).toEqual([]);
});

test("biceps #11 et #13 affichent leur vidéo et dictent le Zottman corrigé", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Entraînement", exact: true })
    .click();
  await page.getByRole("tab", { name: /Bibliothèque/ }).click();
  await page.evaluate(() => {
    window.__spoken = [];
    window.speechSynthesis.cancel = () => {};
    window.speechSynthesis.getVoices = () => [];
    window.speechSynthesis.speak = (utterance) =>
      window.__spoken.push(utterance.text);
  });

  const cases = [
    {
      name: "Curl Zottman assis",
      src: "/videos/curl-zottman-assis.mp4",
    },
    {
      name: "Curl Zottman un bras, banc Scott",
      src: "/videos/curl-zottman-un-bras-banc-scott.mp4",
    },
  ];
  for (const item of cases) {
    await page.getByLabel("Rechercher un exercice").fill(item.name);
    await page
      .getByRole("button", {
        name: `Démonstration ${item.name}`,
        exact: true,
      })
      .click();
    const dialog = page.getByRole("dialog", {
      name: item.name,
      exact: true,
    });
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "src",
      item.src,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      /paumes? vers le sol/i,
    );
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      /Vidéo IA accélérée/i,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(/immobiles? en bas/i);
    expect(spoken).toMatch(/immobiles? en haut/i);
    expect(spoken).toMatch(/supination/i);
    expect(spoken).toMatch(/Ne reproduisez pas/i);
    await dialog
      .getByRole("button", { name: "Fermer", exact: true })
      .last()
      .click();
  }
  expect(errors).toEqual([]);
});

test("biceps #10 et #12 affichent leurs vidéos validées", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".page")).toBeVisible();
  await page
    .locator(".sidebar")
    .getByRole("button", { name: "Entraînement", exact: true })
    .click();
  await page.getByRole("tab", { name: /Bibliothèque/ }).click();

  const cases = [
    {
      name: "Curl Scott haltère neutre",
      src: "/videos/curl-scott-haltere-neutre.mp4",
      poster: "/videos/posters/curl-scott-haltere-neutre.jpg",
    },
    {
      name: "Curl poulie basse",
      src: "/videos/curl-poulie-basse.mp4",
      poster: "/videos/posters/curl-poulie-basse.jpg",
    },
  ];
  for (const item of cases) {
    await page.getByLabel("Rechercher un exercice").fill(item.name);
    await page
      .getByRole("button", {
        name: `Démonstration ${item.name}`,
        exact: true,
      })
      .click();
    const dialog = page.getByRole("dialog", {
      name: item.name,
      exact: true,
    });
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "src",
      item.src,
    );
    await expect(dialog.locator(".movement-video")).toHaveAttribute(
      "poster",
      item.poster,
    );
    await dialog
      .getByRole("button", { name: "Fermer", exact: true })
      .last()
      .click();
  }
  expect(errors).toEqual([]);
});
