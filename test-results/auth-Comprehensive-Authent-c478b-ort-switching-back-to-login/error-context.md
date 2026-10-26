# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Comprehensive Authentication & Forms Suite >> Register page must render fields correctly and support switching back to login
- Location: tests\auth.spec.js:30:3

# Error details

```
Error: locator.isVisible: Error: strict mode violation: locator('a[href="/login"]') resolved to 2 elements:
    1) <a class="" href="/login" data-discover="true">Login</a> aka getByRole('link', { name: 'Login', exact: true })
    2) <a href="/login" data-discover="true">Login here</a> aka getByRole('link', { name: 'Login here' })

Call log:
    - checking visibility of locator('a[href="/login"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading "People's Library" [level=1] [ref=e6]
      - paragraph [ref=e7]: Personal Reading Space
    - navigation [ref=e8]:
      - generic [ref=e9]: 09:56 h
      - link "Home" [ref=e10] [cursor=pointer]:
        - /url: /
      - link "Catalog" [ref=e11] [cursor=pointer]:
        - /url: /catalog
      - generic [ref=e12]:
        - link "Login" [ref=e13] [cursor=pointer]:
          - /url: /login
        - link "Register" [ref=e14] [cursor=pointer]:
          - /url: /register
  - main [ref=e15]:
    - generic [ref=e17]:
      - heading "Register" [level=2] [ref=e18]
      - generic [ref=e19]:
        - generic [ref=e20]: USERNAME
        - textbox "USERNAME" [ref=e22]:
          - /placeholder: john_doe
      - generic [ref=e23]:
        - generic [ref=e24]: EMAIL
        - textbox "EMAIL" [ref=e26]:
          - /placeholder: john@example.com
      - generic [ref=e27]:
        - generic [ref=e28]: PASSWORD
        - textbox "PASSWORD" [ref=e30]:
          - /placeholder: "******"
      - generic [ref=e31]:
        - generic [ref=e32]: CONFIRM PASSWORD
        - textbox "CONFIRM PASSWORD" [ref=e34]:
          - /placeholder: "******"
      - button "Register" [ref=e35] [cursor=pointer]
      - paragraph [ref=e36]:
        - text: Already have an account?
        - link "Login here" [ref=e37] [cursor=pointer]:
          - /url: /login
  - contentinfo [ref=e38]:
    - generic [ref=e39]:
      - paragraph [ref=e40]: People's Library © 2026
      - generic [ref=e41]:
        - link "Facebook" [ref=e42] [cursor=pointer]:
          - /url: https://www.facebook.com/profile.php?id=100001440473524
        - link "Instagram" [ref=e45] [cursor=pointer]:
          - /url: https://www.instagram.com/v.hristov90/
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Comprehensive Authentication & Forms Suite", () => {
  4  |   test("Login page must validate elements, allow credential typing, and handle submission gracefully", async ({
  5  |     page,
  6  |   }) => {
  7  |     await page.goto("/login");
  8  | 
  9  |     const emailInput = page.locator('input[name="email"], input[type="email"]');
  10 |     const passwordInput = page.locator(
  11 |       'input[name="password"], input[type="password"]',
  12 |     );
  13 |     const submitBtn = page.locator('button[type="submit"]');
  14 | 
  15 |     await expect(emailInput).toBeVisible();
  16 |     await expect(passwordInput).toBeVisible();
  17 |     await expect(submitBtn).toBeVisible();
  18 |     await expect(submitBtn).toBeEnabled();
  19 | 
  20 |     await emailInput.fill("test-user@example.com");
  21 |     await passwordInput.fill("SecurePassword123!");
  22 | 
  23 |     await expect(emailInput).toHaveValue("test-user@example.com");
  24 |     await expect(passwordInput).toHaveValue("SecurePassword123!");
  25 | 
  26 |     await submitBtn.click();
  27 |     await expect(page).toHaveURL("/login");
  28 |   });
  29 | 
  30 |   test("Register page must render fields correctly and support switching back to login", async ({
  31 |     page,
  32 |   }) => {
  33 |     await page.goto("/register");
  34 | 
  35 |     const inputs = page.locator("input");
  36 |     const inputCount = await inputs.count();
  37 |     expect(inputCount).toBeGreaterThanOrEqual(2);
  38 | 
  39 |     const submitBtn = page.locator('button[type="submit"]').first();
  40 |     await expect(submitBtn).toBeVisible();
  41 | 
  42 |     const loginLink = page.locator('a[href="/login"]');
> 43 |     if (await loginLink.isVisible()) {
     |                         ^ Error: locator.isVisible: Error: strict mode violation: locator('a[href="/login"]') resolved to 2 elements:
  44 |       await loginLink.click();
  45 |       await expect(page).toHaveURL("/login");
  46 |     }
  47 |   });
  48 | 
  49 |   test("Logout action must clear localStorage session and redirect safely", async ({
  50 |     page,
  51 |   }) => {
  52 |     await page.goto("/");
  53 |     await page.evaluate(() => {
  54 |       localStorage.setItem(
  55 |         "auth",
  56 |         JSON.stringify({
  57 |           accessToken: "mock-token-xyz",
  58 |           email: "test@example.com",
  59 |         }),
  60 |       );
  61 |     });
  62 | 
  63 |     await page.reload();
  64 | 
  65 |     const logoutBtn = page
  66 |       .locator('button:has-text("Logout"), a:has-text("Logout"), .logout-btn')
  67 |       .first();
  68 | 
  69 |     if (await logoutBtn.isVisible()) {
  70 |       await logoutBtn.click();
  71 | 
  72 |       const authStorage = await page.evaluate(() =>
  73 |         localStorage.getItem("auth"),
  74 |       );
  75 |       expect(authStorage).toBeNull();
  76 |       await expect(page).toHaveURL("http://localhost:5173/");
  77 |     }
  78 |   });
  79 | });
  80 | 
```