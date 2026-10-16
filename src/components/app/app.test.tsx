import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APIRoute, AuthorizationStatus } from '../../constants';
import catalogReducer from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer, { requireAuthorization } from '../../store/slices/user';
import App from './app';

vi.mock('../../pages/main/main', () => ({
  default: () => <h1>Main page</h1>,
}));

vi.mock('../../pages/favorites/favorites', () => ({
  default: () => <h1>Favorites page</h1>,
}));

vi.mock('../../pages/offer/offer', () => ({
  default: () => <h1>Offer page</h1>,
}));

vi.mock('../../pages/not-found/not-found', () => ({
  default: () => <h1>Not found page</h1>,
}));

vi.mock('../../pages/login/login', () => ({
  default: () => <h1>Login page</h1>,
}));

describe('App', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createTestStore>;

  function createTestStore() {
    return configureStore({
      reducer: {
        catalog: catalogReducer,
        detailedOffer: detailedOfferReducer,
        favorites: favoritesReducer,
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: api } }),
    });
  }

  function renderApp(path: string) {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    store = createTestStore();
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('renders the main page route', async () => {
    renderApp('/');

    expect(await screen.findByRole('heading', { name: 'Main page' })).toBeInTheDocument();
  });

  it('renders the offer page route', async () => {
    renderApp('/offer/offer-1');

    expect(await screen.findByRole('heading', { name: 'Offer page' })).toBeInTheDocument();
  });

  it('renders not found page for unknown routes', async () => {
    renderApp('/unknown');

    expect(await screen.findByRole('heading', { name: 'Not found page' })).toBeInTheDocument();
  });

  it('redirects an unauthorized user from favorites to login with a return path', async () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));

    renderApp('/favorites');

    expect(await screen.findByRole('heading', { name: 'Login page' })).toBeInTheDocument();
  });

  it('redirects an authorized user from login to the requested path', async () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
    mockApi.onGet(APIRoute.Favorites).reply(200, []);

    renderApp('/login?redirect=/offer/offer-1');

    expect(await screen.findByRole('heading', { name: 'Offer page' })).toBeInTheDocument();
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });
    expect(mockApi.history.get[0].url).toBe(APIRoute.Favorites);
  });

  it('renders favorites page for an authorized user', async () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
    mockApi.onGet(APIRoute.Favorites).reply(200, []);

    renderApp('/favorites');

    expect(await screen.findByRole('heading', { name: 'Favorites page' })).toBeInTheDocument();
  });
});
