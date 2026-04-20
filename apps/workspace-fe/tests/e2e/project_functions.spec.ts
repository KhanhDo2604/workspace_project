import test, { expect, Page } from '@playwright/test';
import { getBaseUrl, TIMESTAMP } from './common';

const PROJECT_TITLE = `E2E Project ${TIMESTAMP}`;
const PROJECT_DESC = `Auto-generated description ${TIMESTAMP}`;

async function openCreateModal(page: Page) {
    await page.getByRole('button', { name: 'Create Project' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Create new project')).toBeVisible();
}

async function fillAndSubmitCreateForm(page: Page, title: string, description: string) {
    await page.getByLabel('Project Name').or(page.locator('input[name="name"]')).fill(title);
    await page.getByLabel('Description').or(page.locator('input[name="description"]')).fill(description);
    await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();
}

async function waitForModalClose(page: Page) {
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });
}

test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseUrl()}/`);
    await page.waitForLoadState('networkidle');
});

test.describe('Main Page / Dashboard', () => {
    test('display heading "For you" and button Create Project in Main page', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'For you' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Project' })).toBeVisible();
    });

    test('display heading "Recent projects"', async ({ page }) => {
        await expect(page.getByText('Recent projects')).toBeVisible();
    });
});

test.describe('CreateProjectModal – open/close', () => {
    test('click "Create Project" → modal open with correct title', async ({ page }) => {
        await openCreateModal(page);

        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('Create new project')).toBeVisible();
    });

    test('Check modal input', async ({ page }) => {
        await openCreateModal(page);

        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="description"]')).toBeVisible();
    });

    test('click Cancel → close modal, input reseted', async ({ page }) => {
        await openCreateModal(page);

        await page.locator('input[name="name"]').fill('should be discarded');
        await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

        await waitForModalClose(page);

        await openCreateModal(page);
        await expect(page.locator('input[name="name"]')).toHaveValue('');
    });

    test('press Escape -> close modal', async ({ page }) => {
        await openCreateModal(page);
        await page.keyboard.press('Escape');
        await waitForModalClose(page);
    });
});

test.describe('Create new project', () => {
    test('Create project successfully -> show in the list', async ({ page }) => {
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, PROJECT_TITLE, PROJECT_DESC);

        await waitForModalClose(page);

        const projectCard = page.locator('[data-testid="project-card"]');

        await expect(projectCard.filter({ hasText: PROJECT_TITLE })).toBeVisible();
    });

    test('submit without title -> modal stays open and shows validation', async ({ page }) => {
        await openCreateModal(page);

        await page.locator('input[name="description"]').fill('No title here');
        await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();

        const nameInput = page.locator('input[name="name"]');
        await expect(nameInput).toBeVisible();

        await expect(page.getByText(/Project name is required./i)).toBeVisible();
    });

    test('Check spinner loading while creating project', async ({ page }) => {
        await openCreateModal(page);

        await fillAndSubmitCreateForm(page, `Spinner Test ${TIMESTAMP}`, 'desc');

        const submitBtn = page.getByRole('dialog').getByRole('button', { name: /Create Project|spinner/i });

        await waitForModalClose(page);
    });

    test('Create multi projects -> all show in the list', async ({ page }) => {
        const titles = [`Multi A ${TIMESTAMP}`, `Multi B ${TIMESTAMP}`];

        for (const title of titles) {
            await openCreateModal(page);
            await fillAndSubmitCreateForm(page, title, 'batch test');
            await waitForModalClose(page);
        }

        const projectCard = page.locator('[data-testid="project-card"]');

        for (const title of titles) {
            await expect(projectCard.filter({ hasText: title })).toBeVisible({ timeout: 8_000 });
        }
    });
});

test.describe('update and delete project', () => {
    async function createProject(page: Page, title: string) {
        await page.getByRole('button', { name: 'Create Project' }).first().click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.locator('input[name="name"]').fill(title);
        await page.locator('input[name="description"]').fill('test description');
        await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });
        await expect(page.getByText(title)).toBeVisible({ timeout: 8000 });
    }

    async function openProjectDetail(page: Page, title: string) {
        const card = page.locator('button', { has: page.locator('p.text-gray-500', { hasText: title }) });
        await card.first().click();

        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
        await expect(page.getByText('Project Detail')).toBeVisible();
    }

    test('update project title and description -> show updated info in the list', async ({ page }) => {
        const originalTitle = `Update Target ${Date.now()}`;
        const updatedTitle = `Updated Title ${Date.now()}`;
        const updatedDesc = `Updated description ${Date.now()}`;

        await createProject(page, originalTitle);

        await openProjectDetail(page, originalTitle);

        const nameInput = page.locator('input[name="name"]');
        await nameInput.clear();
        await nameInput.fill(updatedTitle);

        const descInput = page.locator('input[name="description"]');
        await descInput.clear();
        await descInput.fill(updatedDesc);

        await page.getByRole('button', { name: 'Save Update' }).click();

        await expect(page.getByText('Are you sure you want to save the changes to this project?')).toBeVisible();

        await page.getByRole('button', { name: 'Confirm' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 8000 });

        await expect(page.getByText(originalTitle)).not.toBeVisible();
    });

    test('delete project -> project not visible in the list', async ({ page }) => {
        const titleToDelete = `To Be Deleted ${Date.now()}`;
        await createProject(page, titleToDelete);
        await openProjectDetail(page, titleToDelete);

        await page.getByRole('button', { name: 'Delete Project' }).click();
        await expect(page.getByText('Are you sure you want to delete this project?')).toBeVisible();

        await page.getByRole('button', { name: 'Confirm' }).click();
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });
        await expect(page.getByText(titleToDelete)).not.toBeVisible({ timeout: 8000 });
    });
});

test.describe('Project list', () => {
    test('Project cards title correct', async ({ page }) => {
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `List Check ${TIMESTAMP}`, 'verify list');
        await waitForModalClose(page);

        await expect(page.locator('p.text-gray-500', { hasText: `List Check ${TIMESTAMP}` })).toBeVisible({
            timeout: 8000,
        });
    });

    test('Click Project tasks header -> expand/collapse task list', async ({ page }) => {
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Expand Test ${TIMESTAMP}`, 'some descriptions');
        await waitForModalClose(page);

        const header = page.locator('span', { hasText: `#Expand Test ${TIMESTAMP} tasks` });
        await header.waitFor({ timeout: 8000 });

        await expect(page.getByText('NAME TASK')).not.toBeVisible();

        await header.click();
        await expect(page.getByText('NAME TASK')).toBeVisible();

        await header.click();
        await expect(page.getByText('NAME TASK')).not.toBeVisible();
    });
});

test.describe('ProjectTasks section', () => {
    test('each project displays task section with project name', async ({ page }) => {
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Task Section ${TIMESTAMP}`, 'with tasks');
        await waitForModalClose(page);

        await expect(page.getByText(`Task Section ${TIMESTAMP} tasks`)).toBeVisible({ timeout: 8_000 });
    });
});

test.describe('chat section in project detail', () => {
    test('displays chat section with correct project name', async ({ page }) => {});

    test('send message -> message appears in the chat list', async ({ page }) => {});
});

test.describe('Edge cases', () => {
    test('long title (255 characters) -> no crash UI', async ({ page }) => {
        const longTitle = 'A'.repeat(255);
        await openCreateModal(page);
        await page.locator('input[name="name"]').fill(longTitle);
        await page.locator('input[name="description"]').fill('long title test');
        await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();

        await expect(page.getByRole('heading', { name: 'For you' })).toBeVisible({ timeout: 8000 });
    });

    test('title contains special characters -> displays correctly', async ({ page }) => {
        const specialTitle = `Task Section ${TIMESTAMP} #$%^&*" ${TIMESTAMP}`;

        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Task Section ${TIMESTAMP} #$%^&*" ${TIMESTAMP}`, 'with tasks');
        await waitForModalClose(page);

        const projectCard = page.locator('[data-testid="project-card"]');

        await expect(projectCard.filter({ hasText: `${specialTitle} tasks` })).toBeVisible({ timeout: 8000 });
    });

    test('open modal → close → open again → form still oke', async ({ page }) => {
        await openCreateModal(page);
        await page.locator('input[name="name"]').fill('Temp input');
        await page.keyboard.press('Escape');
        await waitForModalClose(page);

        await openCreateModal(page);
        await expect(page.locator('input[name="name"]')).toHaveValue('');
        await expect(page.locator('input[name="description"]')).toHaveValue('');
    });
    test('main page is scrollable when content overflows vertically', async ({ page }) => {
        const projectCount = 8;
        for (let i = 0; i < projectCount; i++) {
            await openCreateModal(page);
            await fillAndSubmitCreateForm(page, `Scroll Test ${i} ${TIMESTAMP}`, 'something to scroll');
            await waitForModalClose(page);
        }

        const scrollContainer = page.locator('[data-testid="scrollable-content"]');

        const isScrollable = await scrollContainer.evaluate((el) => {
            return el.scrollHeight > el.clientHeight;
        });

        expect(isScrollable).toBe(true);

        await scrollContainer.evaluate((el) => {
            el.scrollTo(0, el.scrollHeight);
        });
    });

    test('project tag does not overflow outside viewport when title is very long', async ({ page }) => {
        const longTagTitle = `${'Very Long Project Title '.repeat(5)}${TIMESTAMP}`;

        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, longTagTitle, 'overflow width test');
        await waitForModalClose(page);

        const projectTag = page
            .locator('p.text-gray-500', { hasText: longTagTitle })
            .or(page.locator('[class*="project"]', { hasText: longTagTitle }))
            .first();

        await projectTag.waitFor({ timeout: 8000 });

        const overflowsViewport = await projectTag.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            return rect.right > viewportWidth + 1;
        });

        expect(overflowsViewport).toBe(false);

        const isClippedByParent = await projectTag.evaluate((el) => {
            let parent = el.parentElement;
            while (parent) {
                const style = window.getComputedStyle(parent);
                const overflow = style.overflow + style.overflowX;
                if (overflow.includes('hidden')) {
                    const parentRect = parent.getBoundingClientRect();
                    const elRect = el.getBoundingClientRect();

                    if (elRect.width > parentRect.width + 1) {
                        return true;
                    }
                }
                parent = parent.parentElement;
            }
            return false;
        });

        expect(isClippedByParent).toBe(false);
    });
});
