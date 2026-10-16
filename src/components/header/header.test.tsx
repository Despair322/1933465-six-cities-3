import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthorizationStatus } from '../../constants';
import favoritesReducer from '../../store/slices/favorites';
import userReducer, { requireAuthorization } from '../../store/slices/user';
import Header from './header';

const createStore = () => configureStore({
  reducer: { favorites: favoritesReducer, user: userReducer },
});

describe('Header', () => {
  it('renders the logo without navigation when hasNavigation is false', () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <Header hasNavigation={false} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '6 cities logo' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders navigation when hasNavigation is true', () => {
    const store = createStore();
    store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header hasNavigation />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
