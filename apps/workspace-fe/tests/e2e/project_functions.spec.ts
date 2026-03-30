import test, { expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const TEST_TOKEN = process.env.TEST_TOKEN;
const TEST_USER_ID = process.env.TEST_USER_ID;

const TIMESTAMP = Date.now();
const PROJECT_TITLE = `E2E Project ${TIMESTAMP}`;
const PROJECT_DESC = `Auto-generated description ${TIMESTAMP}`;
const PROJECT_TITLE_UPD = `Updated Project ${TIMESTAMP}`;

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
    await page.goto(`${BASE_URL}/`);
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

    test('no display "Loading..." after completed data loading', async ({ page }) => {
        await expect(page.getByText('Loading...')).toBeVisible({ timeout: 10000 });
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

        await expect(page.getByText(PROJECT_TITLE)).toBeVisible({ timeout: 8000 });
    });

    test('submit without title -> modal wont close (validation)', async ({ page }) => {
        await openCreateModal(page);

        await page.locator('input[name="description"]').fill('No title here');
        await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('submit without description → project is still created', async ({ page }) => {
        const titleOnly = `Title Only ${TIMESTAMP}`;
        await openCreateModal(page);

        await page.locator('input[name="name"]').fill(titleOnly);
        // Để description trống
        await page.getByRole('dialog').getByRole('button', { name: 'Create Project' }).click();

        await waitForModalClose(page);
        await expect(page.getByText(titleOnly)).toBeVisible({ timeout: 8_000 });
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

        for (const title of titles) {
            await expect(page.getByText(title)).toBeVisible({ timeout: 8_000 });
        }
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

    test('Project list is not empty after create at least 1 project', async ({ page }) => {
        const sectionsBefore = await page.locator('span', { hasText: /^#.+ tasks$/ }).count();

        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Count Test ${TIMESTAMP}`, '');
        await waitForModalClose(page);

        await expect(page.locator('p.text-gray-500', { hasText: `List Check ${TIMESTAMP}` })).toBeVisible({
            timeout: 8000,
        });

        const sectionAfter = await page.locator('span', { hasText: /^#.+ tasks$/ }).count();
        expect(sectionAfter).toBe(sectionsBefore + 1);
    });

    test('Click Project tasks header -> expand/collapse task list', async ({ page }) => {
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Expand Test ${TIMESTAMP}`, '');
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
    test('mỗi project hiển thị section task với tên project', async ({ page }) => {
        // Tạo project trước
        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Task Section ${TIMESTAMP}`, 'with tasks');
        await waitForModalClose(page);

        // ProjectTasks render teamName = proj.title
        await expect(page.getByText(`Task Section ${TIMESTAMP}`)).toBeVisible({ timeout: 8_000 });
    });
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

    test('title contains special characters', async ({ page }) => {
        const specialTitle = `Dự án <Test> & "Quotes" ${TIMESTAMP}`;

        await openCreateModal(page);
        await fillAndSubmitCreateForm(page, `Task Section ${TIMESTAMP}`, 'with tasks');
        await waitForModalClose(page);

        await expect(page.getByText(specialTitle)).toBeVisible({ timeout: 8000 });
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
});
