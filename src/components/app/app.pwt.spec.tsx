import { test, expect } from '@playwright/experimental-ct-react';
import { AuthorizationStatus, APIRoute } from '../../constants';
import App from './app';
import { mockOfferPageRequests } from '../../mocks/network/offer-page';

test.describe('App Routes', () => {

  test('renders the main page route', async ({ mount }) => {
    const component = await mount(<App />);

    await expect(component.getByRole('heading', { name: 'Cities' })).toBeVisible();
  });

  test('renders the offer page route', async ({ mount, page }) => {

    const mockOffer = await mockOfferPageRequests(page);

    const component = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1'],
      },
    });

    await expect(component.getByRole('heading', { name: mockOffer.title })).toBeVisible();
  });

  test('renders not found page for unknown routes', async ({ mount }) => {
    const component = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/unknown'],
      },
    });

    await expect(component.getByRole('heading', { name: '404 Not found' })).toBeVisible();
  });

  test('redirects an unauthorized user from favorites to login with a return path', async ({ mount }) => {
    const component = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/favorites'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null }
        }
      },
    });

    await expect(component.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('redirects an authorized user from login to the requested path', async ({ mount, page }) => {
    let favoritesCalled = false;

    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      favoritesCalled = true;
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    const mockOffer = await mockOfferPageRequests(page);
    const component = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/login?redirect=/offer/offer-1'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null }
        }
      },
    });

    await expect(component.getByRole('heading', { name: mockOffer.title })).toBeVisible();
    expect(favoritesCalled).toBe(true);
  });

  test('renders favorites page for an authorized user', async ({ mount, page }) => {
    await page.route(`**${APIRoute.Favorites}`, async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    const component = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/favorites'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null }
        }
      },
    });

    await expect(component.getByText('Nothing yet saved.')).toBeVisible();
  });
});
