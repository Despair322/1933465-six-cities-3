import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APIRoute } from '../../constants';
import type { DetailedOffer } from '../../types/detailed-offer';
import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';
import catalogReducer from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer from '../../store/slices/user';
import OfferPage from './offer';

vi.mock('../../components/cities-map', () => ({
  default: () => <div data-testid="offer-map" />,
}));

describe('Offer page', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createStore>;

  const offerId = 'offer-1';
  const offer: DetailedOffer = {
    id: offerId,
    title: 'Sunny apartment',
    description: 'A lovely apartment in the city center.',
    type: 'apartment',
    price: 150,
    images: ['one.jpg', 'two.jpg'],
    city: {
      name: 'Paris',
      location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    },
    location: { latitude: 48.85, longitude: 2.35, zoom: 13 },
    goods: ['Wi-Fi', 'Kitchen'],
    host: { name: 'Alex', avatarUrl: 'alex.jpg', isPro: true },
    isFavorite: false,
    isPremium: true,
    rating: 4.5,
    bedrooms: 1,
    maxAdults: 2,
  };

  const makeNearbyOffer = (id: string): Offer => ({
    id,
    title: `Nearby ${id}`,
    type: 'apartment',
    price: 100,
    previewImage: 'nearby.jpg',
    city: offer.city,
    location: offer.location,
    isFavorite: false,
    isPremium: false,
    rating: 4,
  });

  const review: Review = {
    id: 'review-1',
    comment: 'A very pleasant stay.',
    date: '2024-01-01T00:00:00.000Z',
    rating: 5,
    user: { name: 'Jamie', avatarUrl: 'jamie.jpg', isPro: false },
  };

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

  function renderOffer(path = `/offer/${offerId}`) {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <HelmetProvider>
            <Routes>
              <Route path="/offer/:id" element={<OfferPage />} />
              <Route path="/404" element={<h1>Not found destination</h1>} />
            </Routes>
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

  it('shows an offer loading indicator while the offer request is pending', () => {
    mockApi.onGet(APIRoute.OfferById(offerId)).reply(() => new Promise(() => undefined));
    mockApi.onGet(APIRoute.NearbyOffers(offerId)).reply(200, []);
    mockApi.onGet(APIRoute.Reviews(offerId)).reply(200, []);

    renderOffer();

    expect(screen.getByRole('status', { name: 'Loading offer' })).toBeInTheDocument();
  });

  it('renders the offer details, reviews, nearby places and map after loading', async () => {
    mockApi.onGet(APIRoute.OfferById(offerId)).reply(200, offer);
    mockApi.onGet(APIRoute.NearbyOffers(offerId)).reply(200, [
      makeNearbyOffer('near-1'),
      makeNearbyOffer('near-2'),
    ]);
    mockApi.onGet(APIRoute.Reviews(offerId)).reply(200, [review]);

    renderOffer();

    expect(await screen.findByRole('heading', { name: 'Sunny apartment' })).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Max 2 adults')).toBeInTheDocument();
    expect(screen.getByText('€150')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'Place' })).toHaveLength(2);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(await screen.findByText('A very pleasant stay.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Other places in the neighbourhood' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByTestId('offer-map')).toBeInTheDocument();
  });

  it('redirects to not found when the offer request fails', async () => {
    mockApi.onGet(APIRoute.OfferById(offerId)).reply(500);
    mockApi.onGet(APIRoute.NearbyOffers(offerId)).reply(200, []);
    mockApi.onGet(APIRoute.Reviews(offerId)).reply(200, []);

    renderOffer();

    expect(await screen.findByRole('heading', { name: 'Not found destination' })).toBeInTheDocument();
  });
});
