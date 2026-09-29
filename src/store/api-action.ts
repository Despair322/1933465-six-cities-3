import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { decrementFavoritesCount, incrementFavoritesCount, loadComments, loadFavorites, loadNearby, loadOffer, loadOffers, postComment, requireAuthorization, setError, setFavorite, setFavoritesCount, setUserData } from './action';
import { Offer } from '../types/offer';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../constants/app';
import { OfferDescription } from '../types/offer-description';
import { Review } from '../types/review';
import { removeToken, saveToken } from '../services/token';
import { UserData } from '../types/user-data';
import { AuthData } from '../types/auth-data';


export const fetchOffersAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    dispatch(loadOffers(data));
  }
);

export const fetchFavoritesAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchFavorites',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorites);
    dispatch(loadFavorites(data));
    dispatch(setFavoritesCount(data.length));
  }
);

export const postFavoriteAction = createAsyncThunk<void, { id: string; status: boolean }, {
  extra: AxiosInstance;
}>(
  'data/postFavorites',
  async ({ id, status }, { dispatch, extra: api }) => {
    const { data } = await api.post<OfferDescription>(APIRoute.setFavorite(id, status));
    dispatch(setFavorite({ id: data.id, status: data.isFavorite }));
    if(status) {
      dispatch(incrementFavoritesCount());
    } else {
      dispatch(decrementFavoritesCount());
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
    const { data } = await api.post<Review>(APIRoute.Comments(id), { comment, rating });
    dispatch(postComment(data));
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
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  extra: AxiosInstance;
}>(
  'user/login',
  async ({ login: email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    saveToken(data.token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(setUserData({ email: data.email }));
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
