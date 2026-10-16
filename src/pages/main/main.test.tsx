import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APIRoute, DefaultCity } from '../../constants';
import type { Offer } from '../../types/offer';
import catalogReducer, { selectActiveCity } from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer from '../../store/slices/user';
import Main from './main';

vi.mock('../../components/cities-map', () => ({
  default: () => <div data-testid="cities-map" />,
}));

describe('Main', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createStore>;

  const makeOffer = (
    id: string,
    cityName: Offer['city']['name'],
    price: number
  ): Offer => ({
    id,
    title: `Offer ${id}`,
    type: 'apartment',
    price,
    previewImage: 'image.jpg',
    city: {
      name: cityName,
      location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    },
    location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    isFavorite: false,
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

  function renderMain() {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <HelmetProvider>
            <Main />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    store = createStore();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    mockApi.restore();
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
  });

  it('shows the loading indicator while offers are being fetched', () => {
    mockApi.onGet(APIRoute.Offers).reply(() => new Promise(() => undefined));

    renderMain();

    expect(screen.getByRole('status', { name: 'Loading offers' })).toBeInTheDocument();
  });

  it('renders available offers for the active city and filters out other cities', async () => {
    mockApi.onGet(APIRoute.Offers).reply(200, [
      makeOffer('paris-1', 'Paris', 200),
      makeOffer('paris-2', 'Paris', 100),
      makeOffer('cologne-1', 'Cologne', 80),
    ]);

    renderMain();

    expect(await screen.findByText('2 places to stay in Paris')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByTestId('cities-map')).toBeInTheDocument();
  });

  it('shows an empty state when the active city has no offers', async () => {
    mockApi.onGet(APIRoute.Offers).reply(200, [makeOffer('cologne-1', 'Cologne', 80)]);

    renderMain();

    expect(await screen.findByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(`We could not find any property available at the moment in ${DefaultCity}`)).toBeInTheDocument();
    expect(screen.queryByTestId('cities-map')).not.toBeInTheDocument();
  });

  it('shows an error when the offers request fails', async () => {
    mockApi.onGet(APIRoute.Offers).reply(500);

    renderMain();

    expect(await screen.findByText('Unable to load offers.')).toBeInTheDocument();
  });

  it('changes active city when a location is selected', async () => {
    mockApi.onGet(APIRoute.Offers).reply(200, [
      makeOffer('paris-1', 'Paris', 200),
      makeOffer('cologne-1', 'Cologne', 80),
    ]);

    renderMain();
    await screen.findByText('1 place to stay in Paris');

    fireEvent.click(screen.getByRole('link', { name: 'Cologne' }));

    await waitFor(() => expect(selectActiveCity(store.getState())).toBe('Cologne'));
    expect(screen.getByText('1 place to stay in Cologne')).toBeInTheDocument();
  });
});
