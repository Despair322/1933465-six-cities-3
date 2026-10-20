import { test, expect } from '@playwright/experimental-ct-react';
import FavoriteButton from './favorite-button';
import { AuthorizationStatus, FavoriteButtonVariants } from '../../constants';

test.describe('FavoriteButton', () => {

  test('renders inactive card button and triggers network request after debounce', async ({ mount, page }) => {
    await page.route('**/favorite/offer-1/1', async (route) => {
      await route.fulfill({ status: 200 });
    });

    await page.clock.install();

    const component = await mount(
      <FavoriteButton id="offer-1" isFavorite={false} variant={FavoriteButtonVariants.Card} />,
      {
        hooksConfig: {
          initialState: {
            user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
          },
        },
      }
    );

    await expect(component).toHaveClass(/place-card__bookmark-button/);
    await expect(component).not.toHaveClass(/place-card__bookmark-button--active/);
    await expect(component.getByText('To bookmarks')).toBeVisible();

    await component.click();

    const requestPromise = page.waitForRequest('**/favorite/offer-1/1');

    await page.clock.fastForward(300);

    const request = await requestPromise;
    expect(request.url()).toContain('/favorite/offer-1/1');
  });

  test('does not show a favorite as active when the user is signed out', async ({ mount }) => {
    const component = await mount(
      <FavoriteButton id="offer-2" isFavorite variant={FavoriteButtonVariants.Offer} />
    );

    await expect(component).toHaveClass(/offer__bookmark-button/);
    await expect(component).not.toHaveClass(/offer__bookmark-button--active/);
    await expect(component.getByText('To bookmarks')).toBeVisible();
  });

  test('renders an active offer button for an authenticated user when bookmarked', async ({ mount }) => {
    const component = await mount(
      <FavoriteButton id="offer-2" isFavorite variant={FavoriteButtonVariants.Offer} />,
      {
        hooksConfig: {
          initialState: {
            user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
          },
        },
      }
    );

    await expect(component).toHaveClass(/offer__bookmark-button/);
    await expect(component).toHaveClass(/offer__bookmark-button--active/);
    await expect(component.getByText('In bookmarks')).toBeVisible();
  });
});
