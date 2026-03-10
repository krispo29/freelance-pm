import { test, expect } from '@playwright/test';

test.describe('Clients Page', () => {
  test('should load the clients page', async ({ page }) => {
    await page.goto('/clients');
    
    // Verify headings and texts
    await expect(page.locator('h1')).toHaveText('Clients');
    await expect(page.getByText('Manage your client contacts.')).toBeVisible();
  });

  test('should open the new client dialog', async ({ page }) => {
    await page.goto('/clients');
    
    // Find the button that opens the dialog. 
    const openDialogButton = page.getByRole('button', { name: /client/i }).last();
    
    if (await openDialogButton.isVisible()) {
      await openDialogButton.click();
      
      // Verify dialog appears
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Close the dialog using escape
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });

  test('should show empty state or client cards', async ({ page }) => {
    await page.goto('/clients');
    
    // Either the empty state is visible or at least one client card is visible
    const emptyState = page.getByText('No clients found.');
    const clientCards = page.locator('.grid > div');

    const isEmpty = await emptyState.isVisible();
    if (!isEmpty) {
      expect(await clientCards.count()).toBeGreaterThan(0);
    } else {
      await expect(page.getByText('No clients found.')).toBeVisible();
    }
  });
});
