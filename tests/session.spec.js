import { test, expect } from "@playwright/test";

test.describe("Comprehensive Session, Storage & Resilience Suite", () => {
  test("Fresh application start must initialize with clean storage and land strictly on Home", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/");

    const authStorage = await page.evaluate(() => localStorage.getItem("auth"));
    expect(authStorage).toBeNull();

    await expect(page).toHaveURL("http://localhost:5173/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Corrupted or malformed auth JSON in localStorage must be safely wiped on reload without crashing", async ({
    page,
  }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.setItem("auth", "{ broken-json-syntax-string");
    });

    await page.reload();

    await expect(page).toHaveURL("http://localhost:5173/");

    const cleanedStorage = await page.evaluate(() =>
      localStorage.getItem("auth"),
    );
    expect(cleanedStorage).toBeNull();
  });

  test("Page refresh on public subroutes must preserve layout and state", async ({
    page,
  }) => {
    await page.goto("/catalog");
    await expect(page).toHaveURL("/catalog");

    await page.reload();
    await expect(page).toHaveURL("/catalog");
    await expect(page.locator("main")).toBeVisible();
  });
});
