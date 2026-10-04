import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Offer } from '../../types/offer';
import { AxiosInstance, isAxiosError } from 'axios';
import { APIRoute } from '../../constants/app';
import { isAlreadyInRequestedState } from '../../utils/api';
import { favoriteStatusChanged } from '../events/favorite';
import { DetailedOffer } from '../../types/detailed-offer';

export const fetchFavoritesAction = createAsyncThunk<Offer[], undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchFavorites',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorites);
    return data;
  }
);

export const postFavoriteAction = createAsyncThunk<void, { id: string; status: boolean }, {
  extra: AxiosInstance;
}>(
  'data/postFavorites',
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<DetailedOffer>(APIRoute.setFavorite(id, status));
      dispatch(favoriteStatusChanged({ id: data.id, isFavorite: data.isFavorite }));
      dispatch(fetchFavoritesAction());
    } catch (error) {
      if (isAxiosError(error)) {
        const alreadyInRequestedState = isAlreadyInRequestedState(error, status);
        if (alreadyInRequestedState) {
          const favorites = await dispatch(fetchFavoritesAction()).unwrap();
          dispatch(favoriteStatusChanged({
            id,
            isFavorite: favorites.some((favorite) => favorite.id === id),
          }));
          return;
        }

        throw error;
      }
    }
  }
);
