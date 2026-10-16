import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import catalogReducer from '../../../../store/slices/catalog';
import favoritesReducer from '../../../../store/slices/favorites';
import detailedOfferReducer from '../../../../store/slices/detailedOffer';
import userReducer from '../../../../store/slices/user';
import { selectActiveCity } from '../../../../store/slices/catalog';
import LocationItem from './location-item';

describe('Favorites LocationItem', () => {
  it('renders a link to the main page and selects its city on click', () => {
    const store = configureStore({
      reducer: {
        catalog: catalogReducer,
        favorites: favoritesReducer,
        detailedOffer: detailedOfferReducer,
        user: userReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LocationItem city="Amsterdam" />
        </MemoryRouter>
      </Provider>
    );

    const link = screen.getByRole('link', { name: 'Amsterdam' });
    expect(link).toHaveAttribute('href', '/');

    fireEvent.click(link);

    expect(selectActiveCity(store.getState())).toBe('Amsterdam');
  });
});
