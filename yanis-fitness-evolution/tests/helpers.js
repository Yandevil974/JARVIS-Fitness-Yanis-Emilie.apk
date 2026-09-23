import { expect } from "@playwright/test";
// Le jour « aujourd'hui » du plan peut être une journée METCON (cardio +
// piscine, sans exercices haltères) selon la date : pour rester déterministes
// quelle que soit la date, ces specs démarrent la J1 de la phase 1 du
// programme source (Bras & épaules, 9 exercices) — toujours une séance de
// musculation complète.
export async function startSourceWorkout(page) {
  // Navigation « Programme » : dans la barre mobile (<600 px) ou la sidebar.
  if (page.viewportSize().width < 600)
    await page
      .locator(".mobile-nav")
      .getByRole("button", { name: "Programme", exact: true })
      .click();
  else
    await page
      .locator(".sidebar")
      .getByRole("button", { name: "Programme", exact: true })
      .click();
  const tab = page.getByRole("tab", { name: "Mon programme", exact: true });
  if (await tab.count()) await tab.click();
  await page.getByLabel("Mois du programme").selectOption("1");
  await page
    .locator('[data-phase="1"] [data-source-session="J1"]')
    .getByRole("button", { name: "Démarrer J1", exact: true })
    .click();
  await expect(page.locator(".session-topbar")).toBeVisible();
}
