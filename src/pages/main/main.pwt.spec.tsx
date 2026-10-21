import { test, expect } from '@playwright/experimental-ct-react';
import App from '../../components/app/app';
import { APIRoute, AuthorizationStatus, DEFAULT_CITY } from '../../constants';
import { makeFakeOffer } from '../../mocks/data/offer';

test.describe('Main page', () => {
  test('shows a loading indicator while offers are being fetched', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByRole('status', { name: 'Loading offers' })).toBeVisible();
  });

  test('shows only offers for the active city', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          makeFakeOffer({ id: 'paris-1', city: { ...makeFakeOffer().city, name: 'Paris' } }),
          makeFakeOffer({ id: 'paris-2', city: { ...makeFakeOffer().city, name: 'Paris' } }),
          makeFakeOffer({ id: 'cologne-1', city: { ...makeFakeOffer().city, name: 'Cologne' } }),
        ]),
      });
    });
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());
    await page.addStyleTag({ content: '.map { width: 600px; height: 400px; }' });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByText('2 places to stay in Paris')).toBeVisible();
    await expect(app.getByRole('article')).toHaveCount(2);
    await expect(app.locator('.cities__map')).toBeVisible();
  });

  test('shows an empty state when the active city has no offers', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          makeFakeOffer({ id: 'cologne-1', city: { ...makeFakeOffer().city, name: 'Cologne' } }),
        ]),
      });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByText('No places to stay available')).toBeVisible();
    await expect(app.getByText(`We could not find any property available at the moment in ${DEFAULT_CITY}`)).toBeVisible();
    await expect(app.locator('.cities__map')).toHaveCount(0);
  });

  test('shows an error when the offers request fails', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByText('Unable to load offers.')).toBeVisible();
  });

  test('changes the active city when a location is selected', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Offers}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          makeFakeOffer({ id: 'paris-1', city: { ...makeFakeOffer().city, name: 'Paris' } }),
          makeFakeOffer({ id: 'cologne-1', city: { ...makeFakeOffer().city, name: 'Cologne' } }),
        ]),
      });
    });
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByText('1 place to stay in Paris')).toBeVisible();
    await app.getByRole('link', { name: 'Cologne' }).click();
    await expect(app.getByText('1 place to stay in Cologne')).toBeVisible();
  });
});
