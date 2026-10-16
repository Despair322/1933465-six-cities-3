import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APIRoute } from '../../../../constants';
import catalogReducer from '../../../../store/slices/catalog';
import favoritesReducer from '../../../../store/slices/favorites';
import detailedOfferReducer, { loadDetailedOffer } from '../../../../store/slices/detailedOffer';
import userReducer from '../../../../store/slices/user';
import Form from './form';

describe('Review Form', () => {
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
    store.dispatch(loadDetailedOffer({
      id: 'offer-1',
      title: 'Offer',
      description: '',
      type: 'apartment',
      price: 100,
      images: [],
      city: { name: 'Paris', location: { latitude: 48, longitude: 2, zoom: 13 } },
      location: { latitude: 48, longitude: 2, zoom: 13 },
      goods: [],
      host: { name: 'Host', avatarUrl: '', isPro: false },
      isFavorite: false,
      isPremium: false,
      rating: 4,
      bedrooms: 1,
      maxAdults: 2,
    }));
  });

  afterEach(() => {
    mockApi.restore();
  });

  it('keeps submit disabled until a rating and a valid review are provided', () => {
    render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const textarea = screen.getByRole('textbox', { name: 'Your review' });

    expect(submitButton).toBeDisabled();
    fireEvent.change(textarea, { target: { value: 'A'.repeat(50) } });
    expect(submitButton).toBeDisabled();
    fireEvent.click(screen.getByTitle('perfect'));
    expect(submitButton).toBeEnabled();

    fireEvent.change(textarea, { target: { value: 'A'.repeat(301) } });
    expect(submitButton).toBeDisabled();
  });

  it('submits the review, refreshes reviews and resets the form on success', async () => {
    const comment = 'This was a wonderful stay with everything we needed.';
    mockApi.onPost(APIRoute.Reviews('offer-1'), { comment, rating: 5 }).reply(201);
    mockApi.onGet(APIRoute.Reviews('offer-1')).reply(200, []);

    render(
      <Provider store={store}>
        <Form />
      </Provider>
    );

    fireEvent.click(screen.getByTitle('perfect'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your review' }), {
      target: { value: comment },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockApi.history.post).toHaveLength(1));
    expect(mockApi.history.post[0].url).toBe(APIRoute.Reviews('offer-1'));
    expect(mockApi.history.post[0].data).toBe(JSON.stringify({ comment, rating: 5 }));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Your review' })).toHaveValue('');
      expect(screen.getByTitle('perfect').previousElementSibling).not.toBeChecked();
    });
  });
});
