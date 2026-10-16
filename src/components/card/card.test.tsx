import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CardVariants } from '../../constants';
import type { Offer } from '../../types/offer';
import favoritesReducer from '../../store/slices/favorites';
import Card from './card';

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: 'offer-1',
  title: 'Central apartment',
  type: 'apartment',
  price: 120,
  previewImage: 'apartment.jpg',
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  ...overrides,
});

function renderCard(offer: Offer, variant?: typeof CardVariants[keyof typeof CardVariants], onHover?: (id: string | null) => void) {
  const store = configureStore({ reducer: { favorites: favoritesReducer } });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Card offer={offer} variant={variant} onHover={onHover} />
      </MemoryRouter>
    </Provider>
  );
}

describe('Card', () => {
  it('renders offer details, links and premium badge', () => {
    renderCard(makeOffer({ isPremium: true }));

    expect(screen.getByRole('article')).toHaveClass('cities__card');
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Central apartment' })).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Place image' })).toHaveAttribute('src', 'apartment.jpg');
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/offer/offer-1',
      '/offer/offer-1',
    ]);
  });

  it('uses favorites layout dimensions for the favorites variant', () => {
    renderCard(makeOffer(), CardVariants.Favorites);

    expect(screen.getByRole('article')).toHaveClass('favorites__card');
    expect(screen.getByRole('img', { name: 'Place image' })).toHaveAttribute('width', '150');
    expect(screen.getByRole('img', { name: 'Place image' })).toHaveAttribute('height', '110');
    expect(screen.getByRole('article').querySelector('.favorites__card-info')).toBeInTheDocument();
  });

  it('calls onHover with the offer id when the pointer enters the card', () => {
    const onHover = vi.fn();
    renderCard(makeOffer(), CardVariants.Near, onHover);

    fireEvent.mouseEnter(screen.getByRole('article'));

    expect(onHover).toHaveBeenCalledWith('offer-1');
    expect(screen.getByRole('article')).toHaveClass('near-places__card');
  });
});
