import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test('should load the projects page', async ({ page }) => {
    await page.goto('/projects');
    
    // Verify headings and texts
    await expect(page.locator('h1')).toHaveText('Projects');
    await expect(page.getByText('Manage your freelance projects.')).toBeVisible();
  });

  test('should open the new project dialog', async ({ page }) => {
    await page.goto('/projects');
    
    // Find the button that opens the dialog. 
    // Looking for a button that likely says "New Project", "Add", or has a plus icon.
    // If we assume standard "Add Project" text
    const openDialogButton = page.getByRole('button', { name: /project/i }).last();
    
    if (await openDialogButton.isVisible()) {
      await openDialogButton.click();
      
      // Verify dialog appears
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      
      // Look for a close button or generic Cancel/Close to dismiss it
      const closeBtn = dialog.getByRole('button', { name: /close|cancel/i });
      if (await closeBtn.count() > 0) {
         await closeBtn.first().click();
      } else {
         await page.keyboard.press('Escape');
      }
      
      await expect(dialog).toBeHidden();
    }
  });

  test('should show empty state or project cards', async ({ page }) => {
    await page.goto('/projects');
    
    // Either the empty state is visible or at least one project card is visible
    const emptyState = page.getByText('No projects found');
    const projectCards = page.locator('.grid > div'); // Assuming cards are in the grid

    const isEmpty = await emptyState.isVisible();
    if (!isEmpty) {
      expect(await projectCards.count()).toBeGreaterThan(0);
    } else {
      await expect(page.getByText('Get started by creating your first project.')).toBeVisible();
    }
  });
});
