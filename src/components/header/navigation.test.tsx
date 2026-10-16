import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, AppRoute, AuthorizationStatus } from '../../constants';
import type { StoredUserData } from '../../types/user-data';
import favoritesReducer from '../../store/slices/favorites';
import { fetchFavoritesAction } from '../../store/thunks/favorites';
import userReducer, {
  requireAuthorization,
  setUserData,
} from '../../store/slices/user';
import Navigation from './navigation';

describe('Navigation', () => {
  let api: ReturnType<typeof axios.create>;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createStore>;

  const userData: StoredUserData = {
    email: 'user@test.com',
    avatarUrl: 'avatar.jpg',
    isPro: true,
    name: 'Test User',
  };

  function createStore() {
    return configureStore({
      reducer: { favorites: favoritesReducer, user: userReducer },
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

  it('renders no navigation while authorization status is unknown', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows a sign-in link that redirects to the current path when the user is not authorized', () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/offer-1?tab=details']}>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Sign in').closest('a')).toHaveAttribute(
      'href',
      '/login?redirect=/offer/offer-1'
    );
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('shows user details, favorite count and a sign-out link when authorized', () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
    store.dispatch(setUserData(userData));
    store.dispatch(fetchFavoritesAction.fulfilled([], 'request-id', undefined));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/offer-1?tab=details#reviews']}>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('0')).toHaveClass('header__favorite-count');
    expect(screen.getByText('Test User').closest('a')).toHaveAttribute('href', '/favorites');
    expect(document.querySelector('.user__avatar-wrapper')).toHaveStyle({
      backgroundImage: 'url(avatar.jpg)',
    });
    expect(screen.getByText('Sign out').closest('a')).toHaveAttribute(
      'href',
      '/offer/offer-1?tab=details#reviews'
    );
  });

  it('dispatches logout and redirects from favorites to the main page', async () => {
    store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
    mockApi.onDelete(APIRoute.Logout).reply(StatusCodes.OK);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[AppRoute.Favorites]}>
          <Navigation />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Sign out'));

    await waitFor(() => {
      expect(mockApi.history.delete).toHaveLength(1);
    });
    expect(mockApi.history.delete[0].url).toBe(APIRoute.Logout);
    expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
    expect(screen.getByText('Sign in').closest('a')).toHaveAttribute('href', '/login?redirect=/');
  });
});
