import { test, expect } from "@playwright/test";
import { initialState } from "../src/store/model.js";
import { STORAGE_KEY } from "../src/app-identity.js";
import { today, addDays } from "../src/engine/utils.js";

// Image synthétique d’un pixel : aucune photo personnelle n’est utilisée.
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAQAAAACBiqPTAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAd2KE6QAAAAHdElNRQfqCw4NHQwSBmcCAAAADElEQVQI12P4wACGAA8IA8FeW+PBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTExLTE0VDEzOjI5OjEyKzAwOjAwQPYOrAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0xMS0xNFQxMzoyOToxMiswMDowMDGrthAAAAAASUVORK5CYII=", "base64");
const image = `data:image/png;base64,${png.toString("base64")}`;
test("envoi à Groq uniquement avec accord, comparaison automatique, arrêt et erreur sans repli", async ({ page }) => {
  const state = initialState();
  const p = state.profiles.elite;
  p.preferences.brain = { enabled: true, provider: "groq", key: "test-only-key-not-real", style: "solo" };
  p.photos = [{ id: "older", date: addDays(today(), -30), view: "face", data: image, simulated: false }];
  await page.addInitScript(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)), { key: STORAGE_KEY, data: state });
  const requests = [];
  let fail = false;
  await page.route("https://api.groq.com/**", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill(fail ? { status: 429, body: "limite" } : {
      status: 200, contentType: "application/json", body: JSON.stringify({ choices: [{ message: { content: JSON.stringify({ comparabilite: "limitee", limites: "La lumière diffère.", zones: [{ zone: "epaules", observation: "Les contours semblent différents." }] }) } }] }),
    });
  });
  await page.goto("/");
  await page.locator(".sidebar").getByRole("button", { name: "Progression", exact: true }).click();
  await page.getByRole("tab", { name: "Photos", exact: true }).click();
  const upload = page.locator('input[type="file"][accept="image/jpeg,image/png,image/webp"]');
  const file = { name: "fixture.png", mimeType: "image/png", buffer: png };
  const consent = page.getByLabel(/J’accepte l’envoi/);
  await expect(consent).not.toBeChecked();
  await upload.setInputFiles(file);
  await expect(page.locator(".photo-gallery img")).toHaveCount(2);
  expect(requests).toHaveLength(0);
  await consent.check();
  await upload.setInputFiles(file);
  await expect(page.locator(".photo-ai-result")).toContainText("Épaules");
  await expect(page.locator(".photo-ai-result")).toContainText("La lumière diffère");
  expect(requests).toHaveLength(1);
  expect(requests[0].model).toBe("qwen/qwen3.8-27b");
  expect(requests[0].messages[1].content.filter(x => x.type === "image_url")).toHaveLength(2);
  fail = true;
  await page.getByRole("button", { name: "Analyser ces deux photos avec Groq" }).click();
  await expect(page.locator(".photo-ai-result")).toContainText("code 429");
  await expect(page.locator(".photo-ai-result")).not.toContainText("Épaules");
  expect(requests).toHaveLength(2);
  await consent.uncheck();
  await upload.setInputFiles(file);
  await expect(page.locator(".photo-gallery img")).toHaveCount(4);
  expect(requests).toHaveLength(2);
});
