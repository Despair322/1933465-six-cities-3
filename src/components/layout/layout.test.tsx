import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthorizationStatus } from '../../constants';
import catalogReducer from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer, { requireAuthorization } from '../../store/slices/user';
import { fetchFavoritesAction } from '../../store/thunks/favorites';
import Layout from './layout';

function createStore() {
  return configureStore({
    reducer: {
      catalog: catalogReducer,
      detailedOffer: detailedOfferReducer,
      favorites: favoritesReducer,
      user: userReducer,
    },
  });
}

function renderLayout(path: string, store = createStore()) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="*" element={<h1>Route content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('Layout', () => {
  it('renders the main page modifier and route content', () => {
    const store = createStore();
    store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    const { container } = renderLayout('/', store);

    expect(container.querySelector('.page')).toHaveClass('page--gray', 'page--main');
    expect(screen.getByRole('heading', { name: 'Route content' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('renders login page modifier without header navigation', () => {
    const { container } = renderLayout('/login');

    expect(container.querySelector('.page')).toHaveClass('page--gray', 'page--login');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('adds empty favorites styling and footer when favorites are empty', () => {
    const { container } = renderLayout('/favorites');

    expect(container.querySelector('.page')).toHaveClass('page--favorites-empty');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Route content' })).toBeInTheDocument();
  });

  it('keeps favorites page styling when favorites exist and still renders the footer', () => {
    const store = createStore();
    store.dispatch(fetchFavoritesAction.fulfilled([{
      id: 'offer-1',
      title: 'Offer',
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
    }], 'request-id', undefined));
    const { container } = renderLayout('/favorites', store);

    expect(container.querySelector('.page')).not.toHaveClass('page--favorites-empty');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
