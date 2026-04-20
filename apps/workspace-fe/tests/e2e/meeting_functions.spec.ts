import test, { expect, Page } from '@playwright/test';
import { getBaseUrl, createProject, navigateToTaskBoard, TIMESTAMP } from './common';

const PROJECT_TITLE = `Meeting Test Project ${TIMESTAMP}`;

async function openScheduledMeetingModal(page: Page) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await page.locator('[data-testid="create-meeting-trigger"]').click();
    await page.getByText('Scheduled meeting').click();
    await expect(page.locator('[data-testid="create-meeting-modal"]')).toBeVisible({ timeout: 8000 });
}

async function fillMeetingForm(page: Page, title: string, startDayOffset: number = 0, endDayOffset: number = 1) {
    const titleInput = page.getByRole('dialog').locator('input[placeholder="Title"]');
    await titleInput.fill(title);

    const startSection = page.getByRole('dialog').locator('[data-testid="start-date-input"]');
    const startBtn = startSection.locator('button').first();
    await startBtn.click();

    const startPopover = page.locator('[data-radix-popper-content-wrapper]').last();
    await startPopover.waitFor({ state: 'visible', timeout: 5000 });
    await startPopover.locator('[role="gridcell"]:not([disabled])').nth(startDayOffset).click();

    await titleInput.click();
    await expect(startBtn).not.toHaveText(/Select date/, { timeout: 3000 });

    const endSection = page.getByRole('dialog').locator('[data-testid="end-date-input"]');
    const endBtn = endSection.locator('button').first();
    await endBtn.click();

    const endPopover = page.locator('[data-radix-popper-content-wrapper]').last();
    await endPopover.waitFor({ state: 'visible', timeout: 5000 });
    await endPopover.locator('[role="gridcell"]:not([disabled])').nth(endDayOffset).click();

    await titleInput.click();
    await expect(endBtn).not.toHaveText(/Select date/, { timeout: 3000 });
}

async function submitMeetingForm(page: Page) {
    const meetingModal = page.locator('[data-testid="create-meeting-modal"]');
    await meetingModal.locator('[data-testid="create-meeting-save-btn"]').click();
    await expect(meetingModal).not.toBeVisible({ timeout: 8000 });
}

function getMeetingCard(page: Page, title: string) {
    return page.locator('[class*="truncate"], p', { hasText: title }).first();
}

async function switchToMonthView(page: Page) {
    await page.locator('button', { hasText: /^month$/i }).click();
    await page.waitForTimeout(300);
}

async function navigateToCalendar(page: Page) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await page.locator('a[href*="/calendar/"]').click();

    await page.waitForLoadState('networkidle');
    await expect(page.locator('button', { hasText: /month|week|day/i }).first()).toBeVisible({ timeout: 8000 });
}

//set up
test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(`${getBaseUrl()}/`);
    await page.waitForLoadState('networkidle');
    await createProject(page, PROJECT_TITLE, 'Meeting description');
    await page.close();
});

test.beforeEach(async ({ page }) => {
    await page.goto(`${getBaseUrl()}/`);
    await page.waitForLoadState('networkidle');
    await navigateToTaskBoard(page, PROJECT_TITLE);
});

test.describe('CRUD meeting', () => {
    test('create meeting -> meeting appears in the Calendar', async ({ page }) => {
        const meetingTitle = `New Meeting ${TIMESTAMP}`;

        await openScheduledMeetingModal(page);
        await fillMeetingForm(page, meetingTitle, 0, 1);
        await submitMeetingForm(page);

        await navigateToCalendar(page);
        await switchToMonthView(page);

        await expect(getMeetingCard(page, meetingTitle)).toBeVisible({ timeout: 8000 });
    });

    test('edit meeting -> meeting is updated in the Calendar', async ({ page }) => {
        const originalTitle = `Edit Meeting ${TIMESTAMP}`;
        const updatedTitle = `Updated Meeting ${TIMESTAMP}`;
        const meetingModal = page.locator('[data-testid="create-meeting-modal"]');

        await openScheduledMeetingModal(page);
        await fillMeetingForm(page, originalTitle, 0, 1);
        await submitMeetingForm(page);

        await navigateToCalendar(page);
        await switchToMonthView(page);

        await getMeetingCard(page, originalTitle).click();
        await expect(meetingModal).toBeVisible({ timeout: 8000 });
        await expect(meetingModal.getByRole('heading', { name: 'Edit Meeting' })).toBeVisible();

        const titleInput = meetingModal.locator('input[placeholder="Title"]');
        await titleInput.clear();
        await titleInput.fill(updatedTitle);

        await submitMeetingForm(page);

        await expect(getMeetingCard(page, updatedTitle)).toBeVisible({ timeout: 8000 });

        await expect(getMeetingCard(page, originalTitle)).not.toBeVisible();
    });

    test('delete meeting -> meeting is removed from the Calendar', async ({ page }) => {
        const meetingTitle = `Delete Meeting ${TIMESTAMP}`;
        const meetingModal = page.locator('[data-testid="create-meeting-modal"]');

        await openScheduledMeetingModal(page);
        await fillMeetingForm(page, meetingTitle, 2, 3);
        await submitMeetingForm(page);

        await navigateToCalendar(page);
        await switchToMonthView(page);

        await expect(getMeetingCard(page, meetingTitle)).toBeVisible({ timeout: 8000 });

        await getMeetingCard(page, meetingTitle).click();
        await expect(meetingModal).toBeVisible({ timeout: 8000 });
        await expect(page.getByText('Edit Meeting')).toBeVisible();

        await meetingModal.getByRole('button', { name: 'Delete Meeting' }).click();
        await expect(page.getByText('Are you sure you want to delete this meeting?')).toBeVisible();
        await page.getByRole('button', { name: 'Confirm' }).click();

        await expect(meetingModal).not.toBeVisible({ timeout: 8000 });

        await expect(getMeetingCard(page, meetingTitle)).not.toBeVisible({ timeout: 8000 });
    });

    test('change meeting time -> meeting time is updated in the Calendar', async ({ page }) => {
        const meetingTitle = `Time Change Meeting ${TIMESTAMP}`;

        await openScheduledMeetingModal(page);
        await fillMeetingForm(page, meetingTitle, 0, 1);
        await submitMeetingForm(page);

        await navigateToCalendar(page);

        await page.locator('button', { hasText: /^week$/i }).click();
        await page.waitForTimeout(300);

        await getMeetingCard(page, meetingTitle).click();
        await expect(page.locator('[data-testid="create-meeting-modal"]')).toBeVisible({ timeout: 8000 });

        const startSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'Start Date' }),
        });
        await startSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').nth(2).click();

        const endSection = page.getByRole('dialog').locator('div', {
            has: page.locator('h1', { hasText: 'End Date' }),
        });
        await endSection.locator('button').first().click();
        await page.locator('[role="gridcell"]:not([disabled])').nth(4).click();

        await submitMeetingForm(page);

        await switchToMonthView(page);
        await expect(getMeetingCard(page, meetingTitle)).toBeVisible({ timeout: 8000 });
    });
});

test.describe('Edge cases', () => {
    test('long title (255 characters) -> no crash UI in Calendar', async ({ page }) => {
        const longTitle = 'C'.repeat(255);

        await openScheduledMeetingModal(page);
        await fillMeetingForm(page, longTitle, 0, 1);
        await submitMeetingForm(page);

        await navigateToCalendar(page);
        await switchToMonthView(page);

        await expect(page.locator('button', { hasText: /^month$/i })).toBeVisible();

        const eventCard = page.locator('p.line-clamp-1').filter({ hasText: longTitle.substring(0, 10) });
        if ((await eventCard.count()) > 0) {
            const box = await eventCard.first().boundingBox();
            const parentBox = await eventCard.first().locator('..').boundingBox();
            if (box && parentBox) {
                expect(box.width).toBeLessThanOrEqual(parentBox.width + 1);
            }
        }
    });

    test('long description form field (1000 characters) -> no crash UI in Calendar', async ({ page }) => {
        const longTitle = 'D'.repeat(1000);

        await openScheduledMeetingModal(page);

        await page.getByRole('dialog').locator('input[placeholder="Title"]').fill(longTitle);
        await fillMeetingForm(page, longTitle, 0, 1);

        page.on('dialog', async (dialog) => await dialog.accept());

        await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
        await page.waitForTimeout(500);

        await navigateToCalendar(page);

        await expect(getMeetingCard(page, longTitle)).toBeVisible({ timeout: 8000 });
    });

    test('multiple meetings at the same time -> all displayed in Calendar and scrollable', async ({ page }) => {
        const meetingCount = 4;
        const meetingTitles: string[] = [];

        for (let i = 0; i < meetingCount; i++) {
            const title = `Overlap Meeting ${i} ${TIMESTAMP}`;
            meetingTitles.push(title);

            await openScheduledMeetingModal(page);
            await fillMeetingForm(page, title, 0, 1);
            await submitMeetingForm(page);
        }

        await navigateToCalendar(page);
        await switchToMonthView(page);

        for (const title of meetingTitles) {
            await expect(getMeetingCard(page, title)).toBeVisible({ timeout: 8000 });
        }

        await page.locator('button', { hasText: /^day$/i }).click();
        await page.waitForTimeout(300);

        const isScrollable = await page.evaluate(() => {
            const scrollableEl = document.querySelector('.overflow-y-scroll, .overflow-y-auto');
            return scrollableEl ? scrollableEl.scrollHeight > scrollableEl.clientHeight : false;
        });

        expect(isScrollable).toBe(true);

        await page.evaluate(() => {
            const el = document.querySelector('.overflow-y-scroll, .overflow-y-auto');
            if (el) el.scrollTo(0, el.scrollHeight);
        });

        await page.waitForTimeout(300);

        await expect(page.locator('button', { hasText: /^day$/i })).toBeVisible();
    });
});
