import { test, expect } from '@playwright/experimental-ct-react';
import App from '../../components/app/app';
import { APIRoute, AuthorizationStatus } from '../../constants';
import { makeFakeOffer } from '../../mocks/data/offer';
import { makeFakeReview } from '../../mocks/data/review';
import { mockOfferPageRequests } from '../../mocks/network/offer-page';

test.describe('Offer page', () => {
  test('shows a loading indicator while the offer is being fetched', async ({ mount, page }) => {
    await page.route(`**${APIRoute.OfferById('offer-1')}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.route(`**${APIRoute.NearbyOffers('offer-1')}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route(`**${APIRoute.Reviews('offer-1')}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByRole('status', { name: 'Loading offer' })).toBeVisible();
  });

  test('renders offer details, reviews, nearby places and map after loading', async ({ mount, page }) => {
    await mockOfferPageRequests(page, {
      offerOverrides: {
        title: 'Sunny apartment',
        description: 'A lovely apartment in the city center.',
        images: ['one.jpg', 'two.jpg'],
        goods: ['Wi-Fi', 'Kitchen'],
        host: { name: 'Alex', avatarUrl: 'alex.jpg', isPro: true },
        isPremium: true,
        bedrooms: 1,
        maxAdults: 2,
        price: 150,
      },
      nearbyOffers: [
        makeFakeOffer({ id: 'near-1', title: 'Nearby one' }),
        makeFakeOffer({ id: 'near-2', title: 'Nearby two' }),
      ],
      reviews: [makeFakeReview({ comment: 'A very pleasant stay.' })],
    });
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());
    await page.addStyleTag({ content: '.map { width: 600px; height: 400px; }' });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByRole('heading', { name: 'Sunny apartment' })).toBeVisible();
    await expect(app.locator('.offer__mark').getByText('Premium', { exact: true })).toBeVisible();
    await expect(app.getByText('1 Bedroom')).toBeVisible();
    await expect(app.getByText('Max 2 adults')).toBeVisible();
    await expect(app.getByText('€150')).toBeVisible();
    await expect(app.locator('.offer__gallery').getByRole('img', { name: 'Place' })).toHaveCount(2);
    await expect(app.getByText('Wi-Fi')).toBeVisible();
    await expect(app.getByText('Alex')).toBeVisible();
    await expect(app.getByText('A very pleasant stay.')).toBeVisible();
    await expect(app.getByRole('heading', { name: 'Other places in the neighbourhood' })).toBeVisible();
    await expect(app.getByRole('article')).toHaveCount(2);
    await expect(app.locator('.offer__map')).toBeVisible();
  });

  test('redirects to not found when the offer request fails', async ({ mount, page }) => {
    await page.route(`**${APIRoute.OfferById('offer-1')}`, async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });
    await page.route(`**${APIRoute.NearbyOffers('offer-1')}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.route(`**${APIRoute.Reviews('offer-1')}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const app = await mount(<App />, {
      hooksConfig: {
        initialEntries: ['/offer/offer-1'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(app.getByRole('heading', { name: '404 Not found' })).toBeVisible();
  });
});
