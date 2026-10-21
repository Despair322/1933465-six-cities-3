import type { Page } from 'playwright';
import { makeFakeDetailedOffer } from '../data';
import type { DetailedOffer, Offer, Review } from '../../types';

interface MockOfferPageOptions {
  offerOverrides?: Partial<DetailedOffer>;
  nearbyOffers?: Offer[];
  reviews?: Review[];
}

export async function mockOfferPageRequests(
  page: Page,
  options: MockOfferPageOptions = {}
): Promise<DetailedOffer> {
  const offer = makeFakeDetailedOffer(options.offerOverrides);
  const nearby = options.nearbyOffers ?? [];
  const reviews = options.reviews ?? [];

  await page.route('**/*offer-1', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(offer) });
  });

  await page.route('**/offer-1/nearby', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(nearby) });
  });

  await page.route('**/comments/offer-1', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(reviews) });
  });

  return offer;
}
