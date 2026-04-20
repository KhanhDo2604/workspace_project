import { expect, Page } from '@playwright/test';

export function getBaseUrl() {
    return process.env.BASE_URL;
}

export const TIMESTAMP = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export async function createProject(page: Page, title: string, description: string) {
    await page.getByRole('button', { name: 'Create Project' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible;
    await page.locator('input[name=name]').fill(title);
    await page.locator('input[name=description]').fill(description);
    await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });
    await expect(page.locator('[data-testid="project-card-title"]', { hasText: title }).first()).toBeVisible({
        timeout: 8000,
    });
}

export async function navigateToTaskBoard(page: Page, title: string) {
    const sidebarProject = page.locator('p.truncate', { hasText: title }).first();
    await sidebarProject.waitFor({ timeout: 8000 });
    await sidebarProject.click();

    await page.getByRole('link', { name: 'Task board' }).first().click();
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Task Board' })).toBeVisible({ timeout: 8000 });
}
