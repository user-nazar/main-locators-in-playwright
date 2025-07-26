const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
const getRandomInt = require('./utils'); // Adjust './utils' to the correct relative path

test.beforeEach(async ({ page }) => {
	await page.goto('https://demo.nopcommerce.com/');
});

test.describe.serial('locators demo project', () => {
	let email;
	test('register account using attribute css selectors', async ({ page }) => {
		// Expect a title "to contain" a substring.
		//await expect(page).toHaveTitle(/Playwright/);

		let firstName = faker.person.firstName();
		let lastName = faker.person.lastName();
		email = faker.internet.email({ firstName, lastName });

		await page.locator('.ico-register').click();
		await page.locator('#gender-male').click();
		await page.locator('#FirstName').fill(firstName);
		await page.locator('#LastName').fill(lastName);
		const day = getRandomInt(1, 30);
		await page.locator('[name*="BirthDay"]').selectOption(`${day}`);
		//$ selector that ends with Month
		await page.locator('[name$="Month"]').isVisible();

		await page.waitForSelector('[name$="Month"]', { timeout: 60000 });
		const monthLocator = page.locator('[name$="Month"]');
		let monthArr = [];

		const monthElements = await monthLocator.allInnerTexts();
		monthArr = monthElements[0].split('\n');

		const rand = getRandomInt(1, monthArr.length - 1);
		console.log(`Selecting month: *** N  ${rand} ${monthArr[rand]} `); // Log the option being selected

		await page.locator('[name$="Month"]').selectOption('May');
		//	.selectOption({ label: monthArr[rand] });
		await page.locator('[name="DateOfBirthYear"]').selectOption('2000');

		await page.locator('[data-val-required*="mail"]').fill(email);
		await page.locator('[name="Password"]').fill('Pass123');
		await page.locator('[name^="Confirm"]').fill('Pass123');
		await page.locator('#register-button').click();

		const registrationResult = page.locator('.page.registration-result-page');

		await expect(registrationResult).toContainText(
			'Your registration completed'
		);
	});

	test('login to app using basic css selectors', async ({ page }) => {
		await page.locator('.ico-login').click();
		expect(page.url()).toContain('login');
		await page.locator('[name="Email"]').fill('Enter Wrong email{enter}');
		await page.locator('[type="Submit"].login-button').click();

		await page.waitForTimeout(5000);

		console.log(await page.locator('#Email-error').textContent());

		const err = await page.locator('#Email-error').textContent();
		expect(err).toContain('Wrong email');

		await page.locator('#Email.email').fill(email);
		await page.locator('#Password').fill('Pass123');
		await page.locator('[type="Submit"].login-button').click();

		const acText = await page.locator('.ico-account').textContent();
		expect(acText).toContain('My account');
	});
});
