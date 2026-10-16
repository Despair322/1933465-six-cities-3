import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { AuthorizationStatus } from '../../../../constants';
import type { Review } from '../../../../types/review';
import detailedOfferReducer, {
  loadDetailedOffer,
  loadReviews,
} from '../../../../store/slices/detailedOffer';
import { fetchReviewsAction } from '../../../../store/thunks/detailedOffer';
import favoritesReducer from '../../../../store/slices/favorites';
import userReducer, { requireAuthorization } from '../../../../store/slices/user';
import Reviews from './reviews';

const review: Review = {
  id: 'review-1',
  comment: 'A comfortable place to stay.',
  date: '2024-03-15T00:00:00.000Z',
  rating: 4,
  user: { name: 'Taylor', avatarUrl: 'taylor.jpg', isPro: false },
};

const makeStore = () => configureStore({
  reducer: {
    detailedOffer: detailedOfferReducer,
    favorites: favoritesReducer,
    user: userReducer,
  },
});

describe('Reviews', () => {
  it('shows a loading indicator while reviews are pending', () => {
    const store = makeStore();
    store.dispatch(fetchReviewsAction.pending('request-id', 'offer-1'));

    render(
      <Provider store={store}>
        <Reviews reviews={[]} reviewsCount={0} />
      </Provider>
    );

    expect(screen.getByRole('status', { name: 'Loading reviews' })).toBeInTheDocument();
  });

  it('renders the empty reviews message after a successful empty response', () => {
    const store = makeStore();
    store.dispatch(fetchReviewsAction.fulfilled(undefined, 'request-id', 'offer-1'));

    render(
      <Provider store={store}>
        <Reviews reviews={[]} reviewsCount={0} />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'There are no reviews yet' })).toBeInTheDocument();
  });

  it('renders reviews and their total count when loaded', () => {
    const store = makeStore();
    store.dispatch(loadReviews([review]));
    store.dispatch(fetchReviewsAction.fulfilled(undefined, 'request-id', 'offer-1'));

    render(
      <Provider store={store}>
        <Reviews reviews={[review]} reviewsCount={12} />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'Reviews · 12' })).toBeInTheDocument();
    expect(screen.getByText('A comfortable place to stay.')).toBeInTheDocument();
  });

  it('shows an error if loading reviews fails', () => {
    const store = makeStore();
    store.dispatch(fetchReviewsAction.rejected(new Error('failed'), 'request-id', 'offer-1'));

    render(
      <Provider store={store}>
        <Reviews reviews={[]} reviewsCount={0} />
      </Provider>
    );

    expect(screen.getByText('Unable to load reviews.')).toBeInTheDocument();
  });

  it('shows the review form only for authenticated users', () => {
    const store = makeStore();
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
    store.dispatch(loadDetailedOffer({
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
    }));
    store.dispatch(fetchReviewsAction.fulfilled(undefined, 'request-id', 'offer-1'));

    render(
      <Provider store={store}>
        <Reviews reviews={[]} reviewsCount={0} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
