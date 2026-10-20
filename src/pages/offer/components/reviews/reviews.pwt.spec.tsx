import { test, expect } from '@playwright/experimental-ct-react';
import { AuthorizationStatus, RequestStatus } from '../../../../constants';
import { makeFakeReview } from '../../../../mocks/data/review';
import Reviews from './reviews';

const loadedReview = makeFakeReview({
  comment: 'A comfortable place to stay.',
  user: { name: 'Taylor', avatarUrl: 'taylor.jpg', isPro: false },
});

const loadedReviewsState = {
  detailedOffer: {
    detailedOffer: null,
    nearbyOffers: [],
    reviews: [],
    loadingStatus: {
      detailedOffer: RequestStatus.Idle,
      nearbyOffers: RequestStatus.Idle,
      reviews: RequestStatus.Succeeded,
    },
  },
};

test.describe('Reviews', () => {
  test('shows a loading indicator while reviews are pending', async ({ mount }) => {
    const reviews = await mount(<Reviews reviews={[]} reviewsCount={0} />);

    await expect(reviews.getByRole('status', { name: 'Loading reviews' })).toBeVisible();
  });

  test('shows the empty reviews message after a successful empty response', async ({ mount }) => {
    const reviews = await mount(<Reviews reviews={[]} reviewsCount={0} />, {
      hooksConfig: { initialState: loadedReviewsState },
    });

    await expect(reviews.getByRole('heading', { name: 'There are no reviews yet' })).toBeVisible();
  });

  test('renders reviews and their total count when loaded', async ({ mount }) => {
    const reviews = await mount(<Reviews reviews={[loadedReview]} reviewsCount={12} />, {
      hooksConfig: { initialState: loadedReviewsState },
    });

    await expect(reviews.getByRole('heading', { name: 'Reviews · 12' })).toBeVisible();
    await expect(reviews.getByText('A comfortable place to stay.')).toBeVisible();
  });

  test('shows an error if loading reviews fails', async ({ mount }) => {
    const reviews = await mount(<Reviews reviews={[]} reviewsCount={0} />, {
      hooksConfig: {
        initialState: {
          detailedOffer: {
            ...loadedReviewsState.detailedOffer,
            loadingStatus: {
              ...loadedReviewsState.detailedOffer.loadingStatus,
              reviews: RequestStatus.Failed,
            },
          },
        },
      },
    });

    await expect(reviews.getByText('Unable to load reviews.')).toBeVisible();
  });

  test('shows the review form only for authenticated users', async ({ mount }) => {
    const reviews = await mount(<Reviews reviews={[]} reviewsCount={0} />, {
      hooksConfig: {
        initialState: {
          ...loadedReviewsState,
          detailedOffer: {
            ...loadedReviewsState.detailedOffer,
            detailedOffer: {
              id: 'offer-1',
              title: 'Offer',
              description: '',
              type: 'apartment',
              price: 100,
              images: [],
              city: { name: 'Paris', location: { latitude: 48, longitude: 2, zoom: 13 } },
              location: { latitude: 48, longitude: 2, zoom: 13 },
              goods: [],
              host: { name: 'Host', avatarUrl: '', isPro: false },
              isFavorite: false,
              isPremium: false,
              rating: 4,
              bedrooms: 1,
              maxAdults: 2,
            },
          },
          user: { authorizationStatus: AuthorizationStatus.Auth, userData: null },
        },
      },
    });

    await expect(reviews.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
