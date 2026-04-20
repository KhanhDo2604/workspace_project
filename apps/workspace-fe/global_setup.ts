import { getBaseUrl } from './tests/e2e/common';
import dotenv from 'dotenv';

import { chromium } from '@playwright/test';

dotenv.config();

async function globalSetup() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(getBaseUrl() || 'http://localhost:5173');
    await page.waitForLoadState('networkidle');

    await page.fill('#username', process.env.TEST_EMAIL || '');
    await page.fill('#password', process.env.TEST_PASSWORD || '');
    await page.click('#kc-login');

    await page.waitForURL('http://localhost:5173/**');
    await page.waitForLoadState('networkidle');

    await page.context().storageState({ path: 'playwright/.auth/user.json' });

    await browser.close();
}

export default globalSetup;
