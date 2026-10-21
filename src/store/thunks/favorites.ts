import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Offer, DetailedOffer } from '../../types';
import { AxiosInstance, isAxiosError } from 'axios';
import { APIRoute } from '../../constants';
import { favoriteStatusChanged } from '../events/favorite';
import { StatusCodes } from 'http-status-codes';

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
  async ({ id, status }, { dispatch, extra: api, rejectWithValue }) => {
    const alreadyInRequestedStateStatus = status
      ? StatusCodes.CONFLICT
      : StatusCodes.NOT_FOUND;
    try {
      const { data } = await api.post<DetailedOffer>(
        APIRoute.setFavorite(id, status),
        undefined,
        {
          localErrorStatuses: [
            StatusCodes.UNAUTHORIZED,
            alreadyInRequestedStateStatus
          ]
        }
      );
      dispatch(favoriteStatusChanged({ id: data.id, isFavorite: data.isFavorite }));
      dispatch(fetchFavoritesAction());
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === alreadyInRequestedStateStatus) {
          const favorites = await dispatch(fetchFavoritesAction()).unwrap();
          dispatch(favoriteStatusChanged({
            id,
            isFavorite: favorites.some((favorite) => favorite.id === id),
          }));
          return;
        }
        return rejectWithValue(error.response?.status ?? 500);
      }
      throw error;
    }
  }
);
