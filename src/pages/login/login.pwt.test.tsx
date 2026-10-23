import { test, expect } from '@playwright/experimental-ct-react';
import App from '../../components/app/app';
import { APIRoute, AppRoute, AuthorizationStatus, CITY_NAMES } from '../../constants';
import { makeFakeUserData } from '../../mocks';

test.describe('Login', () => {
  test('renders required credential fields and a link for a random city', async ({ mount }) => {
    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [APIRoute.Login],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(app.getByPlaceholder('Email')).toHaveAttribute('required', '');
    await expect(app.getByPlaceholder('Password')).toHaveAttribute('required', '');
    await expect(app.getByPlaceholder('Password')).toHaveAttribute('minlength', '2');

    const cityLink = app.getByRole('link').filter({ hasText: new RegExp(CITY_NAMES.join('|')) });
    await expect(cityLink).toHaveAttribute('href', '/');
    expect(CITY_NAMES).toContain(await cityLink.innerText());
  });

  test('submits credentials and redirects after successful login', async ({ mount, page }) => {
    let submittedCredentials: unknown;
    await page.route(`**${APIRoute.Login}`, async (route) => {
      submittedCredentials = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(makeFakeUserData()),
      });
    });
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [`${AppRoute.Login}?redirect=${AppRoute.Favorites}`],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await app.getByPlaceholder('Email').fill('guest@test.com');
    await app.getByPlaceholder('Password').fill('secret');
    await app.getByRole('button', { name: 'Sign in' }).click();

    await expect.poll(() => submittedCredentials).toEqual({
      email: 'guest@test.com',
      password: 'secret',
    });
    await expect(app.getByText('Nothing yet saved.')).toBeVisible();
  });

  test('shows the validation message returned by the API', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Login}`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ details: [{ messages: ['Password is invalid'] }] }),
      });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [APIRoute.Login],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await app.getByPlaceholder('Email').fill('guest@test.com');
    await app.getByPlaceholder('Password').fill('xx');
    await app.getByRole('button', { name: 'Sign in' }).click();

    await expect(app.getByRole('alert')).toHaveText('Password is invalid');
  });
});
