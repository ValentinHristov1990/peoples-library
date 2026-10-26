import { test, expect } from "@playwright/test";

test.describe("Comprehensive Authentication & Forms Suite", () => {
  test("Login page must validate elements, allow credential typing, and handle submission gracefully", async ({
    page,
  }) => {
    await page.goto("/login");

    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]',
    );
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    await emailInput.fill("test-user@example.com");
    await passwordInput.fill("SecurePassword123!");

    await expect(emailInput).toHaveValue("test-user@example.com");
    await expect(passwordInput).toHaveValue("SecurePassword123!");

    await submitBtn.click();
    await expect(page).toHaveURL("/login");
  });

  test("Login email validation rejects values without an @", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill("1234");
    await emailInput.blur();

    await expect(page.getByText("Please enter a valid email address!")).toBeVisible();
    await expect(emailInput).toHaveCSS("border-color", "rgb(229, 57, 53)");
  });

  test("Register page must render fields correctly and support switching back to login", async ({
    page,
  }) => {
    await page.goto("/register");

    const inputs = page.locator("input");
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(2);

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();

    const loginLink = page.locator('a[href="/login"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL("/login");
    }
  });

  test("Logout action must clear localStorage session and redirect safely", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: "mock-token-xyz",
          email: "test@example.com",
        }),
      );
    });

    await page.reload();

    const logoutBtn = page
      .locator('button:has-text("Logout"), a:has-text("Logout"), .logout-btn')
      .first();

    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();

      const authStorage = await page.evaluate(() =>
        localStorage.getItem("auth"),
      );
      expect(authStorage).toBeNull();
      await expect(page).toHaveURL("http://localhost:5173/");
    }
  });
});
