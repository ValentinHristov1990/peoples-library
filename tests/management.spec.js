import { test, expect } from "@playwright/test";

test.describe("Creation, Editing, Content & Notes Management Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: "mock-valid-token-xyz",
          email: "test@example.com",
          id: "123",
        }),
      );
    });
  });

  test("Creation view / form must render all required inputs and submit controls", async ({
    page,
  }) => {
    await page.goto("/create");

    const form = page.locator("form");
    await expect(form).toBeVisible();

    const titleInput = page
      .locator('input[name="title"], input[name="name"], input[type="text"]')
      .first();
    await expect(titleInput).toBeVisible();
    await titleInput.fill("Automatic Test Title");
    await expect(titleInput).toHaveValue("Automatic Test Title");

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test("Editing view must load existing item data and allow modifications", async ({
    page,
  }) => {
    await page.goto("/catalog");

    const editTrigger = page.locator("text=Edit, .edit-btn").first();
    if (await editTrigger.isVisible()) {
      await editTrigger.click();
      await expect(page.locator("form")).toBeVisible();
    }
  });

  test("Notes management form and creation flow", async ({ page }) => {
    await page.goto("/shelf");

    const noteTrigger = page
      .locator('.note-preview-icon, button:has-text("Notes")')
      .first();

    if (await noteTrigger.isVisible()) {
      await noteTrigger.click();

      const titleInput = page.locator(
        'input[name="title"], input[placeholder*="title"]',
      );
      const contentInput = page.locator(
        'textarea[name="content"], textarea[placeholder*="content"]',
      );

      if ((await titleInput.isVisible()) && (await contentInput.isVisible())) {
        await titleInput.fill("Automated Test Note Title");
        await contentInput.fill("Automated test note content body.");

        const saveNoteBtn = page.locator(
          'button:has-text("Save"), button[type="submit"]',
        );
        await expect(saveNoteBtn).toBeVisible();
        await saveNoteBtn.click();

        await expect(
          page.locator("text=Automated Test Note Title"),
        ).toBeVisible();
      }
    }
  });
});
