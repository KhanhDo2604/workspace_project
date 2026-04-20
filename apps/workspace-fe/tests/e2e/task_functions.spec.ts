import test, { expect, Page } from '@playwright/test';
import { createProject, getBaseUrl, TIMESTAMP } from './common';

async function navigateToTaskBoard(page: Page, title: string) {
    const sidebarProject = page.locator('[data-testid="sidebar-project-item"]', { hasText: title }).first();
    await sidebarProject.waitFor({ timeout: 10000 });
    await sidebarProject.click();

    const taskBoardLink = page
        .locator('a', {
            has: page.locator('p.text-2xl', { hasText: 'Task board' }),
        })
        .first();
    await taskBoardLink.waitFor({ state: 'visible', timeout: 8000 });
    await taskBoardLink.click();

    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Task Board' })).toBeVisible({ timeout: 8000 });
}

async function selectDate(page: Page, sectionTitle: string, cellSelector: 'first' | 'last') {
    const section = page.getByRole('dialog').locator('div', { has: page.locator('h1', { hasText: sectionTitle }) });

    const button = section.locator('button').first();

    const beforeText = await button.textContent();

    await button.click();

    const popover = page.locator('[data-radix-popper-content-wrapper]').last();
    await popover.waitFor({ state: 'visible', timeout: 5000 });

    const cell = popover.locator('[role="gridcell"]:not([disabled])');
    if (cellSelector === 'first') {
        await cell.first().click();
    } else {
        await cell.last().click();
    }

    await expect(button).not.toHaveText('Select date', { timeout: 3000 });
    const afterText = await button.textContent();
    expect(afterText).not.toBe(beforeText);

    await expect(popover).not.toBeVisible({ timeout: 3000 });
}

async function clickDropdownItem(page: Page, triggerTestId: string, menuTestId: string, itemTestId: string) {
    // Click trigger bằng JS dispatch — không trigger focus management
    await page.evaluate((id) => {
        const el = document.querySelector(`[data-testid="${id}"]`) as HTMLElement;
        el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, triggerTestId);

    const menu = page.locator(`[data-testid="${menuTestId}"]`);
    await menu.waitFor({ state: 'visible', timeout: 5000 });

    // Click item
    const item = menu.locator(`[data-testid="${itemTestId}"]`).first();
    await item.click();

    // Đóng menu bằng JS — không trigger focus return
    await page.evaluate(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    await menu.waitFor({ state: 'hidden', timeout: 3000 });
}

async function createTask(page: Page, title: string, description: string) {
    await page.locator('[data-testid="task-create-btn"]').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.locator('input[name="name"]').fill(title);
    await page.locator('input[name="description"]').fill(description);

    // Chọn assignee bằng JS dispatch — không trigger Radix focus management
    await clickDropdownItem(page, 'assignees-trigger', 'assignees-menu', 'assignees-menu-item');

    // Chọn type
    await clickDropdownItem(page, 'types-trigger', 'types-menu', 'types-menu-item');

    await selectDate(page, 'Start Date', 'first');
    await selectDate(page, 'Due Date', 'last');

    await page.getByRole('dialog').getByRole('button', { name: 'Create Task' }).click();

    page.on('dialog', async (dialog) => {
        console.error('Validation failed:', dialog.message());
        await dialog.accept();
    });

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });
}

function getTaskCard(page: Page, title: string) {
    return page.locator('.cursor-grab', { hasText: title });
}

async function openTaskDetail(page: Page, taskTitle: string) {
    const card = getTaskCard(page, taskTitle);
    await card.waitFor({ timeout: 8000 });

    await card.locator('button[variant="icon"], button').last().click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 8000 });
    await expect(page.getByText('Task #')).toBeVisible();
}

//set up
const PROJECT_TITLE = `Project test task ${TIMESTAMP}`;

test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${getBaseUrl()}/`);
    await page.waitForLoadState('networkidle');
    await createProject(page, PROJECT_TITLE, 'test description');
    await page.close();
});

test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseUrl()}/`);
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="sidebar-project-item"]', { hasText: PROJECT_TITLE }).waitFor({ timeout: 10000 });

    await navigateToTaskBoard(page, PROJECT_TITLE);
});

test.describe('CRUD task', () => {
    test('create task -> task appears in the task list', async ({ page }) => {
        const taskTitle = `New task ${TIMESTAMP}`;

        await createTask(page, taskTitle, 'description');

        const toDoColumn = page.locator('div', { has: page.locator('h2, h3', { hasText: 'To Do' }) });
        await expect(toDoColumn.locator('.cursor-grab', { hasText: taskTitle })).toBeVisible({ timeout: 8000 });
    });

    test('edit task title and description -> task is updated in the task list', async ({ page }) => {
        const originalTitle = `Edit Me ${TIMESTAMP}`;
        const updatedTitle = `Edited Task ${TIMESTAMP}`;
        const updatedDesc = `Updated description ${TIMESTAMP}`;

        await createTask(page, originalTitle, 'description');

        await openTaskDetail(page, originalTitle);

        const nameInput = page.locator('input[name="name"]');
        await nameInput.clear();
        await nameInput.fill(updatedTitle);

        const descInput = page.locator('input[name="description"]');
        await descInput.clear();
        await descInput.fill(updatedDesc);

        await page.getByRole('button', { name: 'Update Task' }).click();
        await expect(page.getByText('Are you sure you want to save the changes to this project?')).toBeVisible();
        await page.getByRole('button', { name: 'Confirm' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        await expect(getTaskCard(page, updatedTitle)).toBeVisible({ timeout: 8000 });

        await expect(getTaskCard(page, originalTitle)).not.toBeVisible();
    });

    test('edit task by assigning to different user -> task is updated in the task list', async ({ page }) => {
        const taskTitle = `Assign Test ${TIMESTAMP}`;

        await createTask(page, taskTitle, 'description');

        await openTaskDetail(page, taskTitle);

        const assigneeSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Assignees' }),
        });
        await assigneeSection.locator('button').first().click();

        const firstMember = page.locator('[role="menuitem"]').first();
        const memberName = await firstMember.textContent();
        await firstMember.click();

        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'Update Task' }).click();
        await expect(page.getByText('Are you sure you want to save')).toBeVisible();
        await page.getByRole('button', { name: 'Confirm' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        const taskCard = getTaskCard(page, taskTitle);
        await expect(taskCard.locator('img')).toBeVisible({ timeout: 8000 });
    });

    test('delete task -> task is removed from the task list', async ({ page }) => {
        const taskTitle = `Delete Me ${TIMESTAMP}`;

        await createTask(page, taskTitle, 'to be deleted');

        await expect(getTaskCard(page, taskTitle)).toBeVisible({ timeout: 8000 });

        await openTaskDetail(page, taskTitle);

        await page.getByRole('button', { name: 'Delete Task' }).click();
        await expect(page.getByText('Are you sure you want to delete this task?')).toBeVisible();
        await page.getByRole('button', { name: 'Confirm' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        await expect(getTaskCard(page, taskTitle)).not.toBeVisible({ timeout: 8000 });
    });

    test('change task status by dragging to different column -> task status is updated', async ({ page }) => {
        const taskTitle = `Drag Me ${TIMESTAMP}`;

        await createTask(page, taskTitle, 'drag test');

        const taskCard = getTaskCard(page, taskTitle);
        await taskCard.waitFor({ timeout: 8000 });

        const inProgressColumn = page.locator('div', {
            has: page.locator('h2, h3', { hasText: 'In Progress' }),
        });

        const cardBox = await taskCard.boundingBox();
        const targetBox = await inProgressColumn.boundingBox();

        if (!cardBox || !targetBox) throw new Error('Could not get bounding boxes');

        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();

        await page.mouse.move(cardBox.x + cardBox.width / 2 + 15, cardBox.y + cardBox.height / 2, { steps: 5 });
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
        await page.mouse.up();

        await page.waitForTimeout(500);

        await expect(inProgressColumn.locator('.cursor-grab', { hasText: taskTitle })).toBeVisible({ timeout: 8000 });
    });
});

test.describe('Edge cases', () => {
    test('create task without title -> modal stays open', async ({ page }) => {
        // await page.getByRole('button', { name: 'Create' }).click();
        await page.locator('[data-testid="task-create-btn"]', { hasText: 'Create' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="description"]').fill('no title');
        await page.getByRole('dialog').getByRole('button', { name: 'Create Task' }).click();

        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain('required');
            await dialog.accept();
        });

        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('create task with start date after due date -> alert shown', async ({ page }) => {
        // await page.getByRole('button', { name: 'Create' }).click();
        await page.locator('[data-testid="task-create-btn"]', { hasText: 'Create' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="name"]').fill(`Date Validation ${TIMESTAMP}`);
        await page.locator('input[name="description"]').fill('date test');

        const alertMessages: string[] = [];
        page.on('dialog', async (dialog) => {
            alertMessages.push(dialog.message());
            await dialog.accept();
        });

        const dueDateSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Due Date' }),
        });
        await dueDateSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').first().click();

        const startDateSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Start Date' }),
        });
        await startDateSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').last().click();

        await page.waitForTimeout(300);
        expect(alertMessages.some((m) => m.toLowerCase().includes('start date'))).toBe(true);
    });

    test('update task without changes -> Update Task button is disabled', async ({ page }) => {
        const taskTitle = `No Change ${TIMESTAMP}`;
        await createTask(page, taskTitle, 'no change test');

        await openTaskDetail(page, taskTitle);

        const updateBtn = page.getByRole('button', { name: 'Update Task' });
        await expect(updateBtn).toBeDisabled();
    });

    test('task title is too long (255 chars) -> UI does not crash', async ({ page }) => {
        const longTitle = 'T'.repeat(255);

        // await page.getByRole('button', { name: 'Create' }).click();
        await page.locator('[data-testid="task-create-btn"]', { hasText: 'Create' }).click();

        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('input[name="name"]').fill(longTitle);
        await page.locator('input[name="description"]').fill('long title test');

        const startSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Start Date' }),
        });
        await startSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').first().click();

        const dueSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Due Date' }),
        });
        await dueSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').last().click();

        await page.getByRole('dialog').getByRole('button', { name: 'Create Task' }).click();
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        await expect(page.getByRole('heading', { name: 'Task Board' })).toBeVisible();

        const taskCard = getTaskCard(page, longTitle.substring(0, 20));
        await expect(taskCard).toBeVisible({ timeout: 8000 });
    });

    test('cancel edit task -> original data is preserved', async ({ page }) => {
        const taskTitle = `Cancel Edit ${TIMESTAMP}`;
        await createTask(page, taskTitle, 'cancel test');

        await openTaskDetail(page, taskTitle);

        const nameInput = page.locator('input[name="name"]');
        await nameInput.clear();
        await nameInput.fill('This should not be saved');

        // await page.getByRole('button', { name: 'Cancel' }).click();
        await page.locator('[data-testid="task-create-btn"]', { hasText: 'Create' }).click();
        await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8000 });

        await expect(getTaskCard(page, taskTitle)).toBeVisible({ timeout: 8000 });
        await expect(getTaskCard(page, 'This should not be saved')).not.toBeVisible();
    });
});
