import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, isAxiosError } from 'axios';
import { loadComments, loadFavorites, loadNearby, loadOffer, loadOffers, requireAuthorization, setError, setFavorite, setFavoritesCount, setUserData } from './action';
import { Offer } from '../types/offer';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../constants/app';
import { OfferDescription } from '../types/offer-description';
import { Review } from '../types/review';
import { removeToken, saveToken } from '../services/token';
import { UserData } from '../types/user-data';
import { AuthData } from '../types/auth-data';
import { isAlreadyInRequestedState } from '../utils/api';

export const fetchOffersAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    dispatch(loadOffers(data));
  }
);

export const fetchFavoritesAction = createAsyncThunk<Offer[], undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchFavorites',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorites);
    dispatch(loadFavorites(data));
    dispatch(setFavoritesCount(data.length));
    return data;
  }
);

export const postFavoriteAction = createAsyncThunk<void, { id: string; status: boolean }, {
  extra: AxiosInstance;
}>(
  'data/postFavorites',
  async ({ id, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<OfferDescription>(APIRoute.setFavorite(id, status));
      dispatch(setFavorite({ id: data.id, status: data.isFavorite }));
      dispatch(fetchFavoritesAction());
    } catch (error) {
      if (isAxiosError(error)) {
        const alreadyInRequestedState = isAlreadyInRequestedState(error, status);
        if (alreadyInRequestedState) {
          const favorites = await dispatch(fetchFavoritesAction()).unwrap();
          dispatch(setFavorite({
            id,
            status: favorites.some((favorite) => favorite.id === id),
          }));
          return;
        }

        throw error;
      }
    }
  }
);

export const fetchOfferAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchOffer',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<OfferDescription>(APIRoute.OfferById(id));
    dispatch(loadOffer(data));
  }
);

export const fetchNearbyOffersAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchNearbyOffers',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.NearbyOffers(id));
    dispatch(loadNearby(data));
  }
);

export const fetchCommentsAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchComments',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<Review[]>(APIRoute.Comments(id));
    dispatch(loadComments(data));
  }
);

export const postCommentAction = createAsyncThunk<void, { id: string; comment: string; rating: number }, {
  extra: AxiosInstance;
}>(
  'data/postComment',
  async ({ id, comment, rating }, { dispatch, extra: api }) => {
    await api.post<Review>(APIRoute.Comments(id), { comment, rating });
    dispatch(fetchCommentsAction(id));
  }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      const { data: { email } } = await api.get<UserData>(APIRoute.Login);
      dispatch(setUserData({ email }));
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      removeToken();
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  extra: AxiosInstance;
  rejectValue: string;
}>(
  'user/login',
  async ({ login: email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      dispatch(setUserData({ email: data.email }));
    } catch (error) {
      if (isAxiosError<{ details?: { messages?: string[] }[] }>(error)) {
        const validationMessage = error.response?.data.details?.[0]?.messages?.[0];

        if (validationMessage) {
          return rejectWithValue(validationMessage);
        }
      }
      throw error;
    }
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    removeToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  },
);

export const clearErrorAction = createAsyncThunk(
  'global/clearError',
  (_arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR,
    );
  },
);
