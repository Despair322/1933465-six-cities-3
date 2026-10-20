import { test, expect } from '@playwright/experimental-ct-react';
import App from '../../components/app/app';
import { APIRoute, AppRoute, AuthorizationStatus } from '../../constants';
import { makeFakeOffer } from '../../mocks/data/offer';

test.describe('Favorites', () => {
  test('shows a loading indicator while favorites are being fetched', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [AppRoute.Favorites],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await expect(app.getByRole('status', { name: 'Loading favorites' })).toBeVisible();
    await expect(app.getByText('Nothing yet saved.')).toBeVisible();
  });

  test('renders the empty state when there are no favorites', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [AppRoute.Favorites],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await expect(app.getByRole('heading', { name: 'Favorites (empty)' })).toBeVisible();
    await expect(app.getByText('Nothing yet saved.')).toBeVisible();
  });

  test('groups fetched offers by city and renders their cards', async ({ mount, page }) => {
    const favorites = [
      makeFakeOffer({ id: 'paris-1', city: { ...makeFakeOffer().city, name: 'Paris' } }),
      makeFakeOffer({ id: 'paris-2', city: { ...makeFakeOffer().city, name: 'Paris' } }),
      makeFakeOffer({ id: 'cologne-1', city: { ...makeFakeOffer().city, name: 'Cologne' } }),
    ];
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(favorites),
      });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [AppRoute.Favorites],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await expect(app.getByRole('heading', { name: 'Saved listing' })).toBeVisible();
    await expect(app.getByRole('link', { name: 'Paris' })).toBeVisible();
    await expect(app.getByRole('link', { name: 'Cologne' })).toBeVisible();
    await expect(app.getByRole('article')).toHaveCount(3);
  });

  test('shows an error message if loading favorites fails', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [AppRoute.Favorites],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await expect(app.getByText('Unable to load favorites.')).toBeVisible();
  });

  test('selects a city from favorites and displays its offers on the main page', async ({ mount, page }) => {
    const favorites = [
      makeFakeOffer({ id: 'amsterdam-1', city: { ...makeFakeOffer().city, name: 'Amsterdam' } }),
    ];
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(favorites),
      });
    });
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(favorites),
      });
    });
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: [AppRoute.Favorites],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await app.getByRole('link', { name: 'Amsterdam' }).click();

    await expect(app.getByText('1 place to stay in Amsterdam')).toBeVisible();
  });
});
