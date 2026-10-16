import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { Offer } from '../../../../types/offer';
import favoritesReducer from '../../../../store/slices/favorites';
import PlacesList from './places-list';

const makeOffer = (id: string): Offer => ({
  id,
  title: `Apartment ${id}`,
  type: 'apartment',
  price: 100,
  previewImage: 'image.jpg',
  city: { name: 'Paris', location: { latitude: 48.85, longitude: 2.35, zoom: 13 } },
  location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
});

describe('PlacesList', () => {
  it('renders a card for each offer and forwards hover events', () => {
    const onHover = vi.fn();
    const store = configureStore({ reducer: { favorites: favoritesReducer } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesList offers={[makeOffer('1'), makeOffer('2')]} onHover={onHover} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByRole('article')).toHaveLength(2);
    fireEvent.mouseEnter(screen.getAllByRole('article')[0]);
    expect(onHover).toHaveBeenCalledWith('1');
  });

  it('renders an empty list when there are no offers', () => {
    const store = configureStore({ reducer: { favorites: favoritesReducer } });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesList offers={[]} />
        </MemoryRouter>
      </Provider>
    );

    expect(container.querySelector('.cities__places-list')).toBeEmptyDOMElement();
  });
});
