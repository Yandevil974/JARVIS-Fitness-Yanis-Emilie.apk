import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/app-identity.js";
import { startSourceWorkout } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.__YFE_KEY__ = key;
  }, STORAGE_KEY);
});

test("JARVIS Brain 1.9.0 reste présent avec le module vidéo", async ({
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

test("biceps #14 à #17 affichent leurs réserves et dictent le geste corrigé", async ({
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
      name: "Curl haltères incliné, supination",
      src: "/videos/curl-halteres-incline-supination.mp4",
      poster: "/videos/posters/curl-halteres-incline-supination.jpg",
      title: /retour en haut/i,
      hand: /prise neutre en bas/i,
      notice: /termine en bas/i,
      spoken: /remontez toujours jusqu’en haut/i,
    },
    {
      name: "Curl marteau",
      src: "/videos/curl-marteau.mp4",
      poster: "/videos/posters/curl-marteau.jpg",
      title: /prise marteau neutre/i,
      hand: /pouces vers le haut/i,
      notice: /change d’athlète/i,
      spoken: /chiffres affichés ne sont pas le tempo/i,
    },
    {
      name: "Curl Scott 90° haltère supination",
      src: "/videos/curl-scott-90-haltere-supination.mp4",
      poster: "/videos/posters/curl-scott-90-haltere-supination.jpg",
      title: /coloration sur la cuisse/i,
      hand: /supination fixe/i,
      notice: /coloration musculaire migre sur la cuisse/i,
      spoken: /Ignorez la coloration sur la cuisse/i,
    },
    {
      name: "Curl Zottman",
      src: "/videos/curl-zottman.mp4",
      poster: "/videos/posters/curl-zottman.jpg",
      title: /remontée supplémentaire/i,
      hand: /descente pronée/i,
      notice: /ajoute une remontée/i,
      spoken: /C’est la fin de la répétition/i,
    },
  ];
  for (const [index, item] of cases.entries()) {
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
    expect(spoken).toMatch(/Ne reproduisez pas/i);

    if (index === 0) {
      await dialog
        .getByRole("button", { name: "Agrandir", exact: true })
        .click();
      const viewer = page.getByRole("dialog", {
        name: /Vidéo IA · Curl incliné supination/,
      });
      await expect(
        viewer.locator(".movement-coaching-note strong"),
      ).toContainText(/retour en haut/i);
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

test("biceps #18 à #20 affichent leurs réserves et dictent le geste corrigé", async ({
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
      name: "Curl concentration",
      src: "/videos/curl-concentration.mp4",
      poster: "/videos/posters/curl-concentration.jpg",
      title: /bras contre la cuisse/i,
      hand: /un seul haltère en supination/i,
      notice: /marque des pauses/i,
      spoken: /descendez en trois secondes/i,
    },
    {
      name: "Curl haltères incliné, prise neutre",
      src: "/videos/curl-halteres-incline-prise-neutre.mp4",
      poster: "/videos/posters/curl-halteres-incline-prise-neutre.jpg",
      title: /Après le quart en bas/i,
      hand: /prise neutre fixe/i,
      notice: /ne redescend pas après le quart/i,
      spoken: /haut, bas, quart, bas, haut/i,
    },
    {
      name: "Curl barre",
      src: "/videos/curl-barre.mp4",
      poster: "/videos/posters/curl-barre.jpg",
      title: /Restez sur place/i,
      hand: /barre droite en supination/i,
      notice: /part vers un banc/i,
      spoken: /Chaque répétition se termine en haut/i,
    },
  ];
  for (const [index, item] of cases.entries()) {
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
    expect(spoken).toMatch(/Ne reproduisez pas/i);

    if (index === 1) {
      await dialog
        .getByRole("button", { name: "Agrandir", exact: true })
        .click();
      const viewer = page.getByRole("dialog", {
        name: /Vidéo IA · Curl incliné neutre 1¼/,
      });
      await expect(
        viewer.locator(".movement-coaching-note strong"),
      ).toContainText(/Après le quart en bas/i);
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

test("triceps #02 et #04 affichent leurs réserves et dictent le geste corrigé", async ({
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
      name: "Triceps dips",
      src: "/videos/triceps-dips.mp4",
      poster: "/videos/posters/triceps-dips.jpg",
      title: /buste droit/i,
      hand: /barre parallèle/i,
      notice: /texte parasite/i,
      spoken: /Descendez en trois secondes/i,
    },
    {
      name: "French press poulie basse",
      src: "/videos/french-press-poulie-basse.mp4",
      poster: "/videos/posters/french-press-poulie-basse.jpg",
      title: /deux coudes hauts/i,
      hand: /poulie basse/i,
      notice: /coude partir vers l’avant/i,
      spoken: /mains derrière la tête/i,
    },
  ];
  for (const [index, item] of cases.entries()) {
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
    expect(spoken).toMatch(/Ne reproduisez pas/i);

    if (index === 1) {
      await dialog
        .getByRole("button", { name: "Agrandir", exact: true })
        .click();
      const viewer = page.getByRole("dialog", {
        name: /Vidéo IA · French press poulie basse/,
      });
      await expect(
        viewer.locator(".movement-coaching-note strong"),
      ).toContainText(/deux coudes hauts/i);
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

test("triceps #03 et #05 à #09 affichent les sources autorisées et leurs consignes propres", async ({
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

  const sharedSrc = "/videos/extensions-triceps-ez-commune-05-06-09.mp4";
  const sharedPoster =
    "/videos/posters/extensions-triceps-ez-commune-05-06-09.jpg";
  const cases = [
    {
      name: "Triceps extensions haltères, banc plat",
      src: "/videos/triceps-extensions-halteres-banc-plat.mp4",
      poster: "/videos/posters/triceps-extensions-halteres-banc-plat.jpg",
      title: /coudes appuyés/i,
      hand: /barre fixe du banc/i,
      notice: /pause en bas/i,
      spoken: /paumes face à face/i,
    },
    {
      name: "French press barre EZ",
      src: sharedSrc,
      poster: "/videos/posters/french-press-barre-ez.jpg",
      title: /vers le front/i,
      hand: /poignées intérieures/i,
      notice: /partagée avec #06 et #09/i,
      spoken: /jamais vers le cou ou la gorge/i,
    },
    {
      name: "Extensions triceps barre EZ",
      src: sharedSrc,
      poster: sharedPoster,
      title: /hauts des bras fixes/i,
      hand: /poignées intérieures/i,
      notice: /sans mouvement de pullover/i,
      spoken: /derrière le sommet de la tête/i,
    },
    {
      name: "Barre au front (pushdown triceps)",
      src: "/videos/barre-au-front-pushdown-triceps.mp4",
      poster: "/videos/posters/barre-au-front-pushdown-triceps.jpg",
      title: /ralentissez la montée/i,
      hand: /poulie haute/i,
      notice: /drop set 10\/8\/6/i,
      spoken: /paumes vers le sol/i,
    },
    {
      name: "French press haltère un bras",
      src: "/videos/french-press-haltere-un-bras.mp4",
      poster: "/videos/posters/french-press-haltere-un-bras.jpg",
      title: /poignet neutre/i,
      hand: /Un seul haltère/i,
      notice: /orientation du poignet/i,
      spoken: /remontez toujours en haut/i,
    },
    {
      name: "Extensions triceps + pullover barre EZ",
      src: sharedSrc,
      poster: sharedPoster,
      title: /Combinez pullover/i,
      hand: /poignées intérieures/i,
      notice: /mouvement volontaire des épaules/i,
      spoken: /arc derrière la tête/i,
    },
  ];
  for (const [index, item] of cases.entries()) {
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
    expect(spoken).toMatch(/Ne reproduisez pas/i);

    if (index === cases.length - 1) {
      await dialog
        .getByRole("button", { name: "Agrandir", exact: true })
        .click();
      const viewer = page.getByRole("dialog", {
        name: /Vidéo IA · Extensions triceps et pullover/,
      });
      await expect(
        viewer.locator(".movement-coaching-note strong"),
      ).toContainText(/Combinez pullover/i);
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

test("triceps #10, #12 et #13 affichent leurs notices et dictent le geste corrigé", async ({
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
      name: "Développé couché prise serrée",
      src: "/videos/developpe-couche-prise-serree.mp4",
      poster: "/videos/posters/developpe-couche-prise-serree.jpg",
      title: /Descendez en trois secondes/i,
      hand: /prise pronée rapprochée/i,
      notice: /marque des arrêts/i,
      spoken: /bas du sternum/i,
    },
    {
      name: "Pushdown triceps câble",
      src: "/videos/pushdown-triceps-cable.mp4",
      poster: "/videos/posters/pushdown-triceps-cable.jpg",
      title: /ne traversez pas le buste/i,
      hand: /poignée D/i,
      notice: /trajectoire croisée/i,
      spoken: /épaule opposée/i,
    },
    {
      name: "California press (barre au cou)",
      src: "/videos/california-press-barre-au-cou.mp4",
      poster: "/videos/posters/california-press-barre-au-cou.jpg",
      title: /charge légère/i,
      hand: /pouces enroulés/i,
      notice: /caméra zoome/i,
      spoken: /espace visible/i,
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
    expect(spoken).toMatch(/Ne reproduisez pas/i);
    await dialog
      .getByRole("button", { name: "Fermer", exact: true })
      .last()
      .click();
  }
  expect(errors).toEqual([]);
});

test("pectoraux #01 à #08 affichent leurs vidéos et consignes corrigées", async ({
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
      name: "Pompes inclinées (mains surélevées)",
      src: "/videos/pompes-inclinees-mains-surelevees.mp4",
      poster: "/videos/posters/pompes-inclinees-mains-surelevees.jpg",
      title: /pause haute/i,
      hand: /barre fixe surélevée/i,
      notice: /nouvelle source remise/i,
      spoken: /pompes au sol/i,
    },
    {
      name: "Développé couché haltères",
      src: "/videos/developpe-couche-halteres.mp4",
      poster: "/videos/posters/developpe-couche-halteres.jpg",
      title: /synchronisés/i,
      hand: /Deux haltères indépendants/i,
      notice: /désynchronise les bras/i,
      spoken: /désynchronisation des bras/i,
    },
    {
      name: "Développé incliné haltères",
      src: "/videos/developpe-incline-halteres.mp4",
      poster: "/videos/posters/developpe-incline-halteres.jpg",
      title: /tête appuyée/i,
      hand: /Deux haltères indépendants/i,
      notice: /redresse légèrement la tête/i,
      spoken: /soulèvement de la tête/i,
    },
    {
      name: "Développé incliné barre",
      src: "/videos/developpe-incline-barre.mp4",
      poster: "/videos/posters/developpe-incline-barre.jpg",
      title: /ligne du sternum/i,
      hand: /barre droite en prise pronée/i,
      notice: /visage et du cou/i,
      spoken: /tempo 3010/i,
    },
    {
      name: "Développé haltères plat, prise neutre",
      src: "/videos/developpe-halteres-plat-prise-neutre.mp4",
      poster: "/videos/posters/developpe-halteres-plat-prise-neutre.jpg",
      title: /hanches appuyées/i,
      hand: /prise neutre/i,
      notice: /redresse le buste/i,
      spoken: /soulèvement des hanches/i,
    },
    {
      name: "Écartés haltères décliné",
      src: "/videos/ecartes-halteres-decline.mp4",
      poster: "/videos/posters/ecartes-halteres-decline.jpg",
      title: /paumes vers le plafond/i,
      hand: /dos des mains vers le sol/i,
      notice: /désynchronise les bras/i,
      spoken: /paumes restent tournées vers le plafond/i,
    },
    {
      name: "Développé haltères incliné 30°",
      src: "/videos/developpe-halteres-incline-30.mp4",
      poster: "/videos/posters/developpe-halteres-incline-30.jpg",
      title: /quatre secondes/i,
      hand: /prise pronée/i,
      notice: /identique à celle du développé incliné #03/i,
      spoken: /quatre secondes/i,
    },
    {
      name: "Développé haltères décliné, prise neutre",
      src: "/videos/developpe-halteres-decline-prise-neutre.mp4",
      poster: "/videos/posters/developpe-halteres-decline-prise-neutre.jpg",
      title: /prise neutre/i,
      hand: /paumes face à face/i,
      notice: /trop rapide pour le tempo 4010/i,
      spoken: /bas de la poitrine/i,
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
    await expect(
      dialog.locator(".movement-coaching-note strong"),
    ).toContainText(item.title);
    await expect(dialog.locator(".movement-coaching-note")).toContainText(
      item.notice,
    );
    await expect(dialog.locator(".exercise-audio-cue")).toContainText(
      item.hand,
    );
    await dialog
      .getByRole("button", { name: "Écouter le descriptif", exact: true })
      .click();
    const spoken = await page.evaluate(() => window.__spoken.at(-1));
    expect(spoken).toMatch(item.spoken);
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
