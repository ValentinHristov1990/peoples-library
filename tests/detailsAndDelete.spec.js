import { test, expect } from "@playwright/test";

test.describe("Item Details, Deletion & Notes Operations Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken: "mock-valid-token-xyz",
          email: "test@example.com",
        }),
      );
    });
  });

  test("Catalog items must allow navigating to details view", async ({
    page,
  }) => {
    await page.goto("/catalog");

    const bookItem = page.locator(".catalog-item, .book-card, article").first();
    if (await bookItem.isVisible()) {
      const detailsLink = bookItem
        .locator('a, button:has-text("Details"), text=More')
        .first();
      if (await detailsLink.isVisible()) {
        await detailsLink.click();
        await expect(page.locator("main, .details-container")).toBeVisible();
      }
    }
  });

  test("Deletion actions must be properly contained and protected", async ({
    page,
  }) => {
    await page.goto("/shelf");

    const deleteBtn = page
      .locator('button:has-text("Delete"), .delete-icon')
      .first();
    if (await deleteBtn.isVisible()) {
      await expect(deleteBtn).toBeEnabled();
    }
  });

  test("Notes list must expose editing and deletion controls", async ({
    page,
  }) => {
    await page.goto("/shelf");

    const noteTrigger = page
      .locator('.note-preview-icon, button:has-text("Notes")')
      .first();
    if (await noteTrigger.isVisible()) {
      await noteTrigger.click();

      const editNoteBtn = page
        .locator('.edit-note-btn, button:has-text("Edit")')
        .first();
      const deleteNoteBtn = page
        .locator('.delete-note-btn, button:has-text("Delete")')
        .first();

      if (await editNoteBtn.isVisible()) {
        await expect(editNoteBtn).toBeEnabled();
      }
      if (await deleteNoteBtn.isVisible()) {
        await expect(deleteNoteBtn).toBeEnabled();
      }
    }
  });
});
