const { test, expect } = require('@playwright/test');
import { faker } from '@faker-js/faker';
const getRandomInt = require('./utils'); // Adjust './utils' to the correct relative path

test.beforeEach(async ({ page }) => {
	await page.goto('https://demo.nopcommerce.com/');
});

test.describe.serial('locators demo project', () => {
	let email;
	test('register account using attribute css selectors', async ({ page }) => {
		let firstName = faker.person.firstName();
		let lastName = faker.person.lastName();
		email = faker.internet.email({ firstName, lastName });

		await page.getByRole('link', { name: 'Register' }).click();
		await page.getByLabel('Female').check();
		await page.getByLabel('First name:').fill(firstName);
		await page.getByLabel('Last name:').fill(lastName);
		const day = getRandomInt(1, 30);
		await page.locator('[name*="BirthDay"]').selectOption(`${day}`);
		const monthLocator = page.locator('[name$="Month"]');
		let monthArr = [];

		const monthElements = await monthLocator.allInnerTexts();
		monthArr = monthElements[0].split('\n');

		const rand = getRandomInt(1, monthArr.length - 1);
		console.log(`Selecting month: *** N  ${rand} ${monthArr[rand]} `); // Log the option being selected

		await page.locator('[name$="Month"]').selectOption('May');
		//	.selectOption({ label: monthArr[rand] });
		await page.locator('[name="DateOfBirthYear"]').selectOption('2000');

		await page.getByLabel('Email:').fill(email);
		await page.getByLabel('Password:', { exact: true }).fill('Pass123');
		await page.getByLabel('Confirm password:').fill('Pass123');
		await page.getByRole('button', { name: 'Register' }).click();
		const truth = await page
			.getByText('Your registration completed')
			.isVisible();

		expect(truth).toBeTruthy();
	});

	test('login to app using basic css selectors', async ({ page }) => {
		await page.getByRole('link', { name: 'Log in' }).click();
		expect(page.url()).toContain('login');
		await page.getByLabel('Email:').fill('Enter Wrong email{enter}');
		await page.getByLabel('Password:').fill('Pass123');
		await page.getByRole('button', { name: 'Log in' }).click();

		const err = await page.getByText('Wrong email').isVisible();

		expect(err).toBeTruthy();

		await page.getByLabel('Email:').fill(email);
		await page.getByLabel('Password:').fill('Pass123');
		await page.getByRole('button', { name: 'Log in' }).click();

		// const acText = await page.locator('.ico-account').textContent();
		// expect(acText).toContain('My account');
	});
});
