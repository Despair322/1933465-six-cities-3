import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APIRoute, AuthorizationStatus, CityNames } from '../../constants';
import catalogReducer from '../../store/slices/catalog';
import favoritesReducer from '../../store/slices/favorites';
import detailedOfferReducer from '../../store/slices/detailedOffer';
import userReducer, { requireAuthorization } from '../../store/slices/user';
import Login from './login';

describe('Login', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createStore>;

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

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    store = createStore();
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('renders required email/password fields and a valid random city link', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HelmetProvider>
            <Login />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeRequired();
    expect(screen.getByPlaceholderText('Password')).toBeRequired();
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('minLength', '2');
    expect(CityNames).toContain(screen.getByRole('link').textContent);
  });

  it('submits entered credentials to the login endpoint', async () => {
    mockApi.onPost(APIRoute.Login).reply(200, {
      email: 'guest@test.com',
      avatarUrl: 'avatar.jpg',
      isPro: false,
      name: 'Guest',
      token: 'token',
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HelmetProvider>
            <Login />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'guest@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(mockApi.history.post).toHaveLength(1));
    expect(mockApi.history.post[0].url).toBe(APIRoute.Login);
    expect(mockApi.history.post[0].data).toBe(JSON.stringify({
      email: 'guest@test.com',
      password: 'secret',
    }));
  });

  it('shows validation errors returned by the API', async () => {
    mockApi.onPost(APIRoute.Login).reply(400, {
      details: [{ messages: ['Password is invalid'] }],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <HelmetProvider>
            <Login />
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'guest@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'xx' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Password is invalid');
  });

  it('redirects an already authenticated user to the requested page', () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: { pathname: '/favorites' } } }]}>
          <HelmetProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/favorites" element={<h1>Favorites destination</h1>} />
            </Routes>
          </HelmetProvider>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: 'Favorites destination' })).toBeInTheDocument();
  });
});
