import { test, expect } from "@playwright/test";

test.describe("Application Routes, Navigation & Route Guards", () => {
  test("1. Public routes should load correctly and quickly", async ({
    page,
  }) => {
    const startTime = Date.now();
    await page.goto("/");
    await expect(page).toHaveURL("http://localhost:5173/");
    await expect(page.locator("header")).toBeVisible();

    await page.click('a[href="/catalog"]');
    await expect(page).toHaveURL("/catalog");

    const loadDuration = Date.now() - startTime;
    expect(loadDuration).toBeLessThan(3000);
  });

  test("2. Protected routes must block unauthenticated users and redirect to Login", async ({
    page,
  }) => {
    await page.context().clearCookies();

    await page.goto("/shelf");
    await expect(page).toHaveURL("/login");

    await page.goto("/create");
    await expect(page).toHaveURL("/login");

    await page.goto("/my-books");
    await expect(page).toHaveURL("/login");
  });

  test("3. Guest routes should be accessible when logged out", async ({
    page,
  }) => {
    await page.context().clearCookies();

    await page.goto("/login");
    await expect(page).toHaveURL("/login");

    await page.goto("/register");
    await expect(page).toHaveURL("/register");
  });
});
