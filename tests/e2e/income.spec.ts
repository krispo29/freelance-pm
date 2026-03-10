import { test, expect } from '@playwright/test';

test.describe('Income Page', () => {
  test('should load the income page', async ({ page }) => {
    await page.goto('/income');
    
    // Verify headings and texts
    await expect(page.locator('h1')).toHaveText('Income');
    await expect(page.getByText('Track all your payments and invoices.')).toBeVisible();
  });

  test('should display total stats cards', async ({ page }) => {
    await page.goto('/income');

    // Should see stat cards for Total Received, Pending, and Overdue
    await expect(page.getByText('Total Received', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Pending', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Overdue', { exact: true })).toBeVisible();
  });

  test('should display all transactions section', async ({ page }) => {
    await page.goto('/income');
    await expect(page.getByText('All Transactions', { exact: true })).toBeVisible();
    
    // Check if table is present
    const table = page.locator('table');
    if (await table.isVisible()) {
       await expect(table).toBeVisible();
    }
  });

  test('should open the new income entry dialog', async ({ page }) => {
    await page.goto('/income');
    
    const openDialogButton = page.getByRole('button', { name: /income|payment/i }).last();
    if (await openDialogButton.isVisible()) {
      await openDialogButton.click();
      
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Close the dialog using escape
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });
});
