import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import type { Offer } from '../../types/offer';
import favoritesReducer from '../../store/slices/favorites';
import { fetchFavoritesAction } from '../../store/thunks/favorites';
import FavoriteCount from './favorite-count';

const makeOffer = (id: string): Offer => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 100,
  previewImage: 'image.jpg',
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  isFavorite: true,
  isPremium: false,
  rating: 4,
});

describe('FavoriteCount', () => {
  it('renders the number of favorite offers from the store', () => {
    const store = configureStore({ reducer: { favorites: favoritesReducer } });
    store.dispatch(fetchFavoritesAction.fulfilled(
      [makeOffer('offer-1'), makeOffer('offer-2')],
      'request-id',
      undefined
    ));

    render(
      <Provider store={store}>
        <FavoriteCount />
      </Provider>
    );

    expect(screen.getByText('2')).toHaveClass('header__favorite-count');
  });

  it('renders zero when there are no favorite offers', () => {
    const store = configureStore({ reducer: { favorites: favoritesReducer } });

    render(
      <Provider store={store}>
        <FavoriteCount />
      </Provider>
    );

    expect(screen.getByText('0')).toHaveClass('header__favorite-count');
  });
});
