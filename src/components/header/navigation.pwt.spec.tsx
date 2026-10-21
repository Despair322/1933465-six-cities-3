import { test, expect } from '@playwright/experimental-ct-react';
import { AuthorizationStatus, RequestStatus, APIRoute } from '../../constants';
import { makeFakeOffer } from '../../mocks/data/offer';
import { makeFakeStoredUserData } from '../../mocks/data/user';
import Navigation from './navigation';

const userData = makeFakeStoredUserData();

test.describe('Navigation', () => {
  test('does not render while authorization status is unknown', async ({ mount }) => {
    const navigation = await mount(<Navigation />);

    await expect(navigation.getByRole('navigation')).toHaveCount(0);
  });

  test('links a signed-out user back to the current path', async ({ mount }) => {
    const navigation = await mount(<Navigation />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1?tab=details'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(navigation.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login?redirect=/offer/offer-1'
    );
    await expect(navigation.getByText('Sign out')).toHaveCount(0);
  });

  test('shows user details, favorite count and sign-out destination when authorized', async ({ mount }) => {
    const navigation = await mount(<Navigation />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1?tab=details#reviews'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData },
          favorites: {
            favorites: [makeFakeOffer({ id: 'offer-1' }), makeFakeOffer({ id: 'offer-2' })],
            loadingStatus: { favorites: RequestStatus.Succeeded },
          },
        },
      },
    });

    await expect(navigation.getByText('Test User')).toBeVisible();
    await expect(navigation.getByText('2')).toHaveClass(/header__favorite-count/);
    await expect(navigation.getByRole('link', { name: /Test User/ })).toHaveAttribute('href', '/favorites');
    await expect(navigation.getByRole('link', { name: 'Sign out' })).toHaveAttribute(
      'href',
      '/offer/offer-1?tab=details#reviews'
    );
  });

  test('logs out and links to the main page from favorites', async ({ mount, page }) => {
    let logoutRequested = false;
    await page.route(`**${APIRoute.Logout}`, async (route) => {
      logoutRequested = route.request().method() === 'DELETE';
      await route.fulfill({ status: 200 });
    });

    const navigation = await mount(<Navigation />, {
      hooksConfig: {
        initialEntries: ['/favorites'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.Auth, userData },
        },
      },
    });

    await navigation.getByRole('link', { name: 'Sign out' }).click();

    await expect.poll(() => logoutRequested).toBe(true);
    await expect(navigation.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?redirect=/');
  });
});
