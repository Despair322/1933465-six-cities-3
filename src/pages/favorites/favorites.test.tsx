import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APIRoute } from '../../constants';
import type { Offer } from '../../types/offer';
import catalogReducer from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer from '../../store/slices/user';
import Favorites from './favorites';

describe('Favorites', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createStore>;

  const makeOffer = (id: string, cityName: Offer['city']['name']): Offer => ({
    id,
    title: `Offer ${id}`,
    type: 'apartment',
    price: 100,
    previewImage: 'image.jpg',
    city: {
      name: cityName,
      location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    },
    location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    isFavorite: true,
    isPremium: false,
    rating: 4,
  });

  function createStore() {
    return configureStore({
      reducer: {
        catalog: catalogReducer,
        favorites: favoritesReducer,
        detailedOffer: detailedOfferReducer,
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: api } }),
    });
  }

  function renderFavorites() {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <HelmetProvider>
            <Favorites />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    store = createStore();
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('shows a loading indicator while fetching favorites', () => {
    mockApi.onGet(APIRoute.Favorites).reply(() => new Promise(() => undefined));

    renderFavorites();

    expect(screen.getByRole('status', { name: 'Loading favorites' })).toBeInTheDocument();
  });

  it('renders the empty state when no favorites were fetched', async () => {
    mockApi.onGet(APIRoute.Favorites).reply(200, []);

    renderFavorites();

    expect(await screen.findByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Favorites (empty)' })).toBeInTheDocument();
  });

  it('groups fetched offers by city and renders their cards', async () => {
    mockApi.onGet(APIRoute.Favorites).reply(200, [
      makeOffer('paris-1', 'Paris'),
      makeOffer('paris-2', 'Paris'),
      makeOffer('cologne-1', 'Cologne'),
    ]);

    renderFavorites();

    expect(await screen.findByRole('heading', { name: 'Saved listing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Paris' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cologne' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    await waitFor(() => expect(mockApi.history.get).toHaveLength(1));
  });

  it('shows an error message if loading favorites fails', async () => {
    mockApi.onGet(APIRoute.Favorites).reply(500);

    renderFavorites();

    expect(await screen.findByText('Unable to load favorites.')).toBeInTheDocument();
  });
});
