import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { EXERCISE_VIDEOS, videoFor } from "../src/data/exercise-videos.js";
import {
  STEP_VIDEOS,
  WARMUP_OVERVIEW,
  stepVideoFor,
} from "../src/data/step-videos.js";

function publicAssetExists(src) {
  return existsSync(fileURLToPath(new URL(`../public${src}`, import.meta.url)));
}

function releaseAssetExists(src) {
  return existsSync(
    fileURLToPath(new URL(`../release${src}`, import.meta.url)),
  );
}

test("chaque vidéo d'exercice activée et chaque poster sont présents", () => {
  const entries = Object.entries(EXERCISE_VIDEOS);
  assert.ok(entries.length >= 10);
  for (const [id, video] of entries) {
    assert.ok(publicAssetExists(video.poster), `poster absent : ${id}`);
    if (["validated", "coached"].includes(video.status)) {
      assert.ok(publicAssetExists(video.src), `vidéo absente : ${id}`);
      assert.equal(videoFor(id), video);
    } else {
      assert.equal(videoFor(id), null);
    }
  }
});

test("biceps #02 et #09 sont jouables avec correction audio, sans être validés", () => {
  for (const id of [
    "curl-scott-barre-ez-pronation",
    "curl-haltere-supination-banc-scott-90",
  ]) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "coached");
    assert.equal(videoFor(id), video);
    assert.match(video.coaching.spoken, /paumes vers le sol/i);
    assert.match(video.coaching.spoken, /dos des mains vers le haut/i);
    assert.match(video.coaching.spoken, /poignets verrouillés/i);
    assert.match(video.coaching.spoken, /seulement les coudes/i);
    assert.match(video.coaching.notice, /ne reproduisez pas cette rotation/i);
  }
  assert.match(
    EXERCISE_VIDEOS["curl-scott-barre-ez-pronation"].coaching.spoken,
    /barre EZ/i,
  );
  assert.match(
    EXERCISE_VIDEOS["curl-haltere-supination-banc-scott-90"].coaching.spoken,
    /deux haltères/i,
  );
  assert.match(
    EXERCISE_VIDEOS["curl-haltere-supination-banc-scott-90"].coaching.spoken,
    /haltères horizontaux/i,
  );
});

test("biceps #10 et #12 sont intégrés comme vidéos validées", () => {
  for (const id of ["curl-scott-haltere-neutre", "curl-poulie-basse"]) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "validated");
    assert.equal(videoFor(id), video);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${id}`);
  }
  assert.match(
    EXERCISE_VIDEOS["curl-scott-haltere-neutre"].label,
    /haltère neutre/i,
  );
  assert.match(EXERCISE_VIDEOS["curl-poulie-basse"].label, /poulie basse/i);
});

test("Zottman #11 et #13 sont jouables avec leur consigne corrective", () => {
  const cases = [
    {
      id: "curl-zottman-assis",
      equipment: /deux haltères/i,
      tempo: /trois secondes/i,
    },
    {
      id: "curl-zottman-un-bras-banc-scott",
      equipment: /une seule haltère/i,
      tempo: /quatre secondes/i,
    },
  ];
  for (const { id, equipment, tempo } of cases) {
    const video = EXERCISE_VIDEOS[id];
    assert.equal(video.status, "coached");
    assert.equal(videoFor(id), video);
    assert.match(video.coaching.spoken, equipment);
    assert.match(video.coaching.spoken, tempo);
    assert.match(video.coaching.spoken, /paumes? vers le sol/i);
    assert.match(video.coaching.spoken, /immobiles? en (bas|haut)/i);
    assert.match(video.coaching.spoken, /seulement (les coudes|le coude)/i);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i);
    assert.match(video.coaching.notice, /Vidéo IA accélérée/i);
  }
});

test("biceps #14 à #17 sont jouables en coached avec leurs réserves explicites", () => {
  const cases = [
    {
      id: "curl-halteres-incline-supination",
      title: /retour en haut/i,
      hand: /prise neutre en bas/i,
      notice: /termine en bas/i,
      spoken: /remontez toujours jusqu’en haut/i,
    },
    {
      id: "curl-marteau",
      title: /prise marteau neutre/i,
      hand: /pouces vers le haut/i,
      notice: /change d’athlète/i,
      spoken: /chiffres affichés ne sont pas le tempo/i,
    },
    {
      id: "curl-scott-90-haltere-supination",
      title: /coloration sur la cuisse/i,
      hand: /supination fixe/i,
      notice: /coloration musculaire migre sur la cuisse/i,
      spoken: /biceps du bras posé/i,
    },
    {
      id: "curl-zottman",
      title: /sans la remontée supplémentaire/i,
      hand: /descente pronée/i,
      notice: /ajoute une remontée/i,
      spoken: /remontée supplémentaire/i,
    },
  ];
  for (const item of cases) {
    const video = EXERCISE_VIDEOS[item.id];
    assert.equal(video.status, "coached", item.id);
    assert.equal(videoFor(item.id), video, item.id);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${item.id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${item.id}`);
    assert.match(video.coaching.title, item.title, item.id);
    assert.match(video.coaching.handCue, item.hand, item.id);
    assert.match(video.coaching.notice, item.notice, item.id);
    assert.match(video.coaching.spoken, item.spoken, item.id);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i, item.id);
  }
});

test("biceps #18 à #20 sont jouables en coached après accord, sans validation technique", () => {
  const cases = [
    {
      id: "curl-concentration",
      title: /bras contre la cuisse/i,
      hand: /un seul haltère en supination/i,
      notice: /marque des pauses/i,
      spoken: /descendez en trois secondes/i,
    },
    {
      id: "curl-halteres-incline-prise-neutre",
      title: /Après le quart en bas/i,
      hand: /prise neutre fixe/i,
      notice: /ne redescend pas après le quart/i,
      spoken: /haut, bas, quart, bas, haut/i,
    },
    {
      id: "curl-barre",
      title: /Restez sur place/i,
      hand: /barre droite en supination/i,
      notice: /part vers un banc/i,
      spoken: /Chaque répétition se termine en haut/i,
    },
  ];
  for (const item of cases) {
    const video = EXERCISE_VIDEOS[item.id];
    assert.equal(video.status, "coached", item.id);
    assert.notEqual(video.status, "validated", item.id);
    assert.equal(videoFor(item.id), video, item.id);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${item.id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${item.id}`);
    assert.match(video.coaching.title, item.title, item.id);
    assert.match(video.coaching.handCue, item.hand, item.id);
    assert.match(video.coaching.notice, item.notice, item.id);
    assert.match(video.coaching.spoken, item.spoken, item.id);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i, item.id);
  }
});

test("triceps #02 et #04 sont jouables en coached après dépôt de Yanis", () => {
  const cases = [
    {
      id: "triceps-dips",
      src: "/videos/triceps-dips.mp4",
      poster: "/videos/posters/triceps-dips.jpg",
      gif: "/media/3aea2b016706d5d4.gif",
      title: /buste droit/i,
      hand: /barre parallèle/i,
      notice: /texte parasite/i,
      spoken: /Descendez en trois secondes/i,
    },
    {
      id: "french-press-poulie-basse",
      src: "/videos/french-press-poulie-basse.mp4",
      poster: "/videos/posters/french-press-poulie-basse.jpg",
      gif: "/media/a40720f67740d2a0.gif",
      title: /deux coudes hauts/i,
      hand: /poulie basse/i,
      notice: /coude partir vers l’avant/i,
      spoken: /mains derrière la tête/i,
    },
  ];
  for (const item of cases) {
    const video = EXERCISE_VIDEOS[item.id];
    assert.equal(video.status, "coached", item.id);
    assert.notEqual(video.status, "validated", item.id);
    assert.equal(video.src, item.src, item.id);
    assert.equal(video.poster, item.poster, item.id);
    assert.equal(videoFor(item.id), video, item.id);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${item.id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${item.id}`);
    assert.ok(publicAssetExists(item.gif), `GIF public absent : ${item.id}`);
    assert.ok(
      releaseAssetExists(video.src),
      `vidéo release absente : ${item.id}`,
    );
    assert.ok(
      releaseAssetExists(video.poster),
      `poster release absent : ${item.id}`,
    );
    assert.ok(releaseAssetExists(item.gif), `GIF release absent : ${item.id}`);
    assert.match(video.coaching.title, item.title, item.id);
    assert.match(video.coaching.handCue, item.hand, item.id);
    assert.match(video.coaching.notice, item.notice, item.id);
    assert.match(video.coaching.spoken, item.spoken, item.id);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i, item.id);
  }
});

test("triceps #03 et #05 à #09 utilisent leurs vidéos accompagnées et conservent les GIF", () => {
  const sharedSrc = "/videos/extensions-triceps-ez-commune-05-06-09.mp4";
  const sharedPoster =
    "/videos/posters/extensions-triceps-ez-commune-05-06-09.jpg";
  const cases = [
    {
      id: "triceps-extensions-halteres-banc-plat",
      src: "/videos/triceps-extensions-halteres-banc-plat.mp4",
      poster: "/videos/posters/triceps-extensions-halteres-banc-plat.jpg",
      gif: "/media/3aea2b016706d5d4.gif",
      title: /coudes appuyés/i,
      hand: /barre fixe du banc/i,
      notice: /pause en bas/i,
      spoken: /paumes face à face/i,
    },
    {
      id: "french-press-barre-ez",
      src: sharedSrc,
      poster: "/videos/posters/french-press-barre-ez.jpg",
      gif: "/media/a40720f67740d2a0.gif",
      title: /vers le front/i,
      hand: /poignées intérieures/i,
      notice: /partagée avec #06 et #09/i,
      spoken: /jamais vers le cou ou la gorge/i,
    },
    {
      id: "extensions-triceps-barre-ez",
      src: sharedSrc,
      poster: sharedPoster,
      gif: "/media/3aea2b016706d5d4.gif",
      title: /hauts des bras fixes/i,
      hand: /poignées intérieures/i,
      notice: /sans mouvement de pullover/i,
      spoken: /derrière le sommet de la tête/i,
    },
    {
      id: "barre-au-front-pushdown-triceps",
      src: "/videos/barre-au-front-pushdown-triceps.mp4",
      poster: "/videos/posters/barre-au-front-pushdown-triceps.jpg",
      gif: "/media/4b9f932f0c18e763.gif",
      title: /ralentissez la montée/i,
      hand: /poulie haute/i,
      notice: /drop set 10\/8\/6/i,
      spoken: /paumes vers le sol/i,
    },
    {
      id: "french-press-haltere-un-bras",
      src: "/videos/french-press-haltere-un-bras.mp4",
      poster: "/videos/posters/french-press-haltere-un-bras.jpg",
      gif: "/media/a40720f67740d2a0.gif",
      title: /poignet neutre/i,
      hand: /Un seul haltère/i,
      notice: /orientation du poignet/i,
      spoken: /remontez toujours en haut/i,
    },
    {
      id: "extensions-triceps-pullover-barre-ez",
      src: sharedSrc,
      poster: sharedPoster,
      gif: "/media/e9aa82132494b300.gif",
      title: /Combinez pullover/i,
      hand: /poignées intérieures/i,
      notice: /mouvement volontaire des épaules/i,
      spoken: /arc derrière la tête/i,
    },
  ];
  for (const item of cases) {
    const video = EXERCISE_VIDEOS[item.id];
    assert.equal(video.status, "coached", item.id);
    assert.notEqual(video.status, "validated", item.id);
    assert.equal(video.src, item.src, item.id);
    assert.equal(video.poster, item.poster, item.id);
    assert.equal(videoFor(item.id), video, item.id);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${item.id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${item.id}`);
    assert.ok(publicAssetExists(item.gif), `GIF public absent : ${item.id}`);
    assert.ok(
      releaseAssetExists(video.src),
      `vidéo release absente : ${item.id}`,
    );
    assert.ok(
      releaseAssetExists(video.poster),
      `poster release absent : ${item.id}`,
    );
    assert.ok(releaseAssetExists(item.gif), `GIF release absent : ${item.id}`);
    assert.match(video.coaching.title, item.title, item.id);
    assert.match(video.coaching.handCue, item.hand, item.id);
    assert.match(video.coaching.notice, item.notice, item.id);
    assert.match(video.coaching.spoken, item.spoken, item.id);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i, item.id);
  }
  assert.equal(
    new Set(
      [
        "french-press-barre-ez",
        "extensions-triceps-barre-ez",
        "extensions-triceps-pullover-barre-ez",
      ].map((id) => EXERCISE_VIDEOS[id].src),
    ).size,
    1,
    "la dérogation #05/#06/#09 doit utiliser un seul MP4 canonique",
  );
});

test("triceps #10, #12 et #13 sont accompagnés et #11 reste sans MP4", () => {
  const cases = [
    {
      id: "developpe-couche-prise-serree",
      src: "/videos/developpe-couche-prise-serree.mp4",
      poster: "/videos/posters/developpe-couche-prise-serree.jpg",
      gif: "/media/5e38d08443e26319.gif",
      title: /Descendez en trois secondes/i,
      hand: /prise pronée rapprochée/i,
      notice: /tempo 3010/i,
      spoken: /bas du sternum/i,
    },
    {
      id: "pushdown-triceps-cable",
      src: "/videos/pushdown-triceps-cable.mp4",
      poster: "/videos/posters/pushdown-triceps-cable.jpg",
      gif: "/media/028724a3c679a470.gif",
      title: /ne traversez pas le buste/i,
      hand: /poignée D/i,
      notice: /trajectoire croisée/i,
      spoken: /cent vingt secondes de repos/i,
    },
    {
      id: "california-press-barre-au-cou",
      src: "/videos/california-press-barre-au-cou.mp4",
      poster: "/videos/posters/california-press-barre-au-cou.jpg",
      gif: "/media/843d0c24da25ffee.gif",
      title: /charge légère/i,
      hand: /pouces enroulés/i,
      notice: /caméra zoome/i,
      spoken: /espace visible/i,
    },
  ];
  for (const item of cases) {
    const video = EXERCISE_VIDEOS[item.id];
    assert.equal(video.status, "coached", item.id);
    assert.notEqual(video.status, "validated", item.id);
    assert.equal(video.src, item.src, item.id);
    assert.equal(video.poster, item.poster, item.id);
    assert.equal(videoFor(item.id), video, item.id);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${item.id}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${item.id}`);
    assert.ok(publicAssetExists(item.gif), `GIF public absent : ${item.id}`);
    assert.ok(releaseAssetExists(video.src), `vidéo release absente : ${item.id}`);
    assert.ok(
      releaseAssetExists(video.poster),
      `poster release absent : ${item.id}`,
    );
    assert.ok(releaseAssetExists(item.gif), `GIF release absent : ${item.id}`);
    assert.match(video.coaching.title, item.title, item.id);
    assert.match(video.coaching.handCue, item.hand, item.id);
    assert.match(video.coaching.notice, item.notice, item.id);
    assert.match(video.coaching.spoken, item.spoken, item.id);
    assert.match(video.coaching.spoken, /Ne reproduisez pas/i, item.id);
  }
  assert.equal(
    videoFor("extensions-triceps-halteres-incline"),
    null,
    "#11 attend sa nouvelle vidéo avec l'orientation #03",
  );
  assert.ok(publicAssetExists("/media/2ec2c2c1b7eb18a5.gif"));
  assert.ok(releaseAssetExists("/media/2ec2c2c1b7eb18a5.gif"));
});

test("les cinq vidéos de l'échauffement test7 et l'aperçu sont intégrés", () => {
  for (const name of [
    "Mise en route",
    "Mobilité des épaules",
    "Mobilité hanches & chevilles",
    "Activation fessiers",
    "Activation scapulaire",
  ]) {
    const video = stepVideoFor(name);
    assert.ok(video, `association absente : ${name}`);
    assert.ok(publicAssetExists(video.src), `vidéo absente : ${name}`);
    assert.ok(publicAssetExists(video.poster), `poster absent : ${name}`);
  }
  assert.equal(Object.keys(STEP_VIDEOS).length, 5);
  assert.ok(publicAssetExists(WARMUP_OVERVIEW.src));
  assert.ok(publicAssetExists(WARMUP_OVERVIEW.poster));
});
