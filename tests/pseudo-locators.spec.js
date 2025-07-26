const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
import exp from 'constants';
const getRandomInt = require('./utils'); // Adjust './utils' to the correct relative path

test.beforeEach(async ({ page }) => {
	await page.goto('https://bstackdemo.com/signin');
});

test('test filter and pseudo locators', async ({ page }) => {
	await page
		.locator('div')
		.filter({ hasText: /^Select Username$/ })
		.nth(2)
		.click();
	await page.getByText('demouser', { exact: true }).click();
	await page
		.locator('div')
		.filter({ hasText: /^Select Password$/ })
		.nth(2)
		.click();
	await page.getByText('testingisfun99', { exact: true }).click();
	await page.getByRole('button', { name: 'Log In' }).click();
	await expect(page).toHaveURL(/signin=true/, { timeout: 60000 });

	// await page.getByRole('link', { name: 'Orders' }).click();
	// await expect(page).toHaveURL(/orders/, { timeout: 60000 });

	// await page.goBack();
	// await page.getByRole('link', { name: 'Offers' }).click();
	// await expect(page).toHaveURL(/offers/, { timeout: 1200000 });

	// await page.goBack();

	await page.getByRole('link').first().click();

	await page
		.getByText('Order bySelectLowest to highestHighest to lowest')
		.click();

	await page.getByRole('combobox').selectOption('lowestprice');
	//await page.waitForSelector('option[value="lowestprice"]:checked');

	const prod = page.locator('[id="\\31 1"]');
	prod.scrollIntoViewIfNeeded();
	await prod.getByText('Add to cart').click();

	await page.locator('[id="\\31 4"]').getByText('Add to cart').click();
	await page.locator('[id="\\31 9"]').getByText('Add to cart').click();
	await page.locator('[id="\\31 9"]').getByLabel('delete').click();

	const element = page.locator('.buy-btn');
	await element.scrollIntoViewIfNeeded();
	await element.click();
	await expect(page).toHaveURL(/checkout/, { timeout: 60000 });

	// await page.getByRole('link', { name: 'Favourites' }).click();
});
