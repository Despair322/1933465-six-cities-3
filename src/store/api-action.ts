import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/store';
import { AxiosInstance } from 'axios';
import { loadComments, loadFavorites, loadNearby, loadOffer, loadOffers, postComment, requireAuthorization } from './action';
import { Offer } from '../types/offer';
import { APIRoute, AuthorizationStatus } from '../constants/app';
import { OfferDescription } from '../types/offer-description';
import { Review } from '../types/review';
import { removeToken, saveToken } from '../services/token';
import { UserData } from '../types/user-data';
import { AuthData } from '../types/auth-data';


export const fetchOffersAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async(_arg, {dispatch, extra: api}) => {
    const {data} = await api.get<Offer[]>(APIRoute.Offers);
    dispatch(loadOffers(data));
  }
);

export const fetchFavoritesAction = createAsyncThunk<void, undefined,{
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFavorites',
  async(_arg, {dispatch, extra: api}) => {
    const {data} = await api.get<Offer[]>(APIRoute.Favorites);
    dispatch(loadFavorites(data));
  }
);

export const fetchOfferAction = createAsyncThunk<void, string,{
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffer',
  async(id, {dispatch, extra: api}) => {
    const {data} = await api.get<OfferDescription>(APIRoute.OfferById(id));
    dispatch(loadOffer(data));
  }
);

export const fetchNearbyOffersAction = createAsyncThunk<void, string,{
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchNearbyOffers',
  async(id, {dispatch, extra: api}) => {
    const {data} = await api.get<Offer[]>(APIRoute.NearbyOffers(id));
    dispatch(loadNearby(data));
  }
);

export const fetchCommentsAction = createAsyncThunk<void, string,{
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchComments',
  async(id, {dispatch, extra: api}) => {
    const {data} = await api.get<Review[]>(APIRoute.Comments(id));
    dispatch(loadComments(data));
  }
);

export const postCommentAction = createAsyncThunk<void, { id: string; comment: string; rating: number }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/postComment',
  async ({ id, comment, rating }, { dispatch, extra: api }) => {
    const { data } = await api.post<Review>(APIRoute.Comments(id), { comment, rating });
    dispatch(postComment(data));
  }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    try {
      await api.get(APIRoute.Login);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    const {data: {token}} = await api.post<UserData>(APIRoute.Login, {email, password});
    saveToken(token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, {dispatch, extra: api}) => {
    await api.delete(APIRoute.Logout);
    removeToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  },
);
