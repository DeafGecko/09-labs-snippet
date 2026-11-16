import { expect, test } from "@playwright/test";

test("the saved theme is applied on load", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("09labs-theme", JSON.stringify("light")));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("search narrows the snippet list", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Vite Production Build Script").first()).toBeVisible();
  await page.getByPlaceholder("Search snippets, tags, or commands...").first().fill("Tailwind");
  await expect(page.getByText("Tailwind CSS v4 Quick Setup").first()).toBeVisible();
  await expect(page.getByText("Vite Production Build Script")).toHaveCount(0);
});

test("a favorite survives a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByTitle("Add to Favorites").first().click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("09labs-favorites"))).not.toBeNull();
  await page.reload();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("09labs-favorites") || "[]").length)).toBe(1);
});

test("a new snippet is saved and still there after a reload", async ({ page }) => {
  const title = `Test snippet ${Date.now()}`;
  await page.goto("/");
  await page.getByRole("button", { name: "Snippet", exact: true }).filter({ visible: true }).first().click();
  await page.getByPlaceholder("e.g., Glassmorphism Card Effect").fill(title);
  await page.getByPlaceholder("React, CSS, UI").fill("test");
  await page.getByPlaceholder("Brief summary of what this snippet does...").fill("A test snippet.");
  await page.getByPlaceholder("Paste or write your source code here...").fill("console.log('hi');");
  await page.getByPlaceholder("Explain how it works, props, or usage context...").fill("Used in tests.");
  await page.getByRole("button", { name: "Create Snippet" }).click();
  await expect(page.getByText(title).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(title).first()).toBeVisible();
});
