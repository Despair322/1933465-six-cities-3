import { createReducer } from '@reduxjs/toolkit';
import { decrementFavoritesCount, incrementFavoritesCount, loadComments, loadFavorites, loadNearby, loadOffer, loadOffers, postComment, requireAuthorization, setActiveCity, setError, setFavorite, setFavoritesCount, setSortType, setUserData } from './action';
import { fetchCommentsAction, fetchFavoritesAction, fetchNearbyOffersAction, fetchOfferAction, fetchOffersAction } from './api-action';
import { DefaultCity } from '../constants/cities';
import type { AuthorizationStatusType, CityName, SortType } from '../types/types';
import { Offer } from '../types/offer';
import { OfferDescription } from '../types/offer-description';
import { Review } from '../types/review';
import { AuthorizationStatus } from '../constants/app';
import { StoredUserData } from '../types/user-data';
import type { RequestStatus } from '../types/types';

type State = {
  city: CityName;
  sortType: SortType;
  offers: Offer[];
  favorites: Offer[];
  favoritesCount: number;
  offer: OfferDescription | null;
  nearby: Offer[];
  comments: Review[];
  authorizationStatus: AuthorizationStatusType;
  userData: StoredUserData | null;
  error: string | null;
  loadingStatus: {
    offers: RequestStatus;
    favorites: RequestStatus;
    offer: RequestStatus;
    nearby: RequestStatus;
    comments: RequestStatus;
  };
};

const initialState: State = {
  city: DefaultCity,
  sortType: 'popular',
  offers: [],
  favorites: [],
  favoritesCount: 0,
  offer: null,
  nearby: [],
  comments: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: null,
  error: null,
  loadingStatus: {
    offers: 'idle',
    favorites: 'idle',
    offer: 'idle',
    nearby: 'idle',
    comments: 'idle',
  },
};

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(fetchOffersAction.pending, (state) => {
      state.loadingStatus.offers = 'loading';
    })
    .addCase(fetchOffersAction.fulfilled, (state) => {
      state.loadingStatus.offers = 'succeeded';
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.loadingStatus.offers = 'failed';
    })
    .addCase(fetchFavoritesAction.pending, (state) => {
      state.loadingStatus.favorites = 'loading';
    })
    .addCase(fetchFavoritesAction.fulfilled, (state) => {
      state.loadingStatus.favorites = 'succeeded';
    })
    .addCase(fetchFavoritesAction.rejected, (state) => {
      state.loadingStatus.favorites = 'failed';
    })
    .addCase(fetchOfferAction.pending, (state) => {
      state.loadingStatus.offer = 'loading';
    })
    .addCase(fetchOfferAction.fulfilled, (state) => {
      state.loadingStatus.offer = 'succeeded';
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.loadingStatus.offer = 'failed';
    })
    .addCase(fetchNearbyOffersAction.pending, (state) => {
      state.loadingStatus.nearby = 'loading';
    })
    .addCase(fetchNearbyOffersAction.fulfilled, (state) => {
      state.loadingStatus.nearby = 'succeeded';
    })
    .addCase(fetchNearbyOffersAction.rejected, (state) => {
      state.loadingStatus.nearby = 'failed';
    })
    .addCase(fetchCommentsAction.pending, (state) => {
      state.loadingStatus.comments = 'loading';
    })
    .addCase(fetchCommentsAction.fulfilled, (state) => {
      state.loadingStatus.comments = 'succeeded';
    })
    .addCase(fetchCommentsAction.rejected, (state) => {
      state.loadingStatus.comments = 'failed';
    })
    .addCase(setActiveCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setSortType, (state, action) => {
      state.sortType = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(loadFavorites, (state, action) => {
      state.favorites = action.payload;
    })
    .addCase(loadOffer, (state, action) => {
      state.offer = action.payload;
    })
    .addCase(loadNearby, (state, action) => {
      state.nearby = action.payload;
    })
    .addCase(loadComments, (state, action) => {
      state.comments = action.payload;
    })
    .addCase(postComment, (state, action) => {
      state.comments.push(action.payload);
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserData, (state, action) => {
      state.userData = action.payload;
    })
    .addCase(setFavorite, (state, action) => {
      const { id, status } = action.payload;

      state.offers.forEach((offer) => {
        if (offer.id === id) {
          offer.isFavorite = status;
        }
      });

      if (!status) {
        state.favorites = state.favorites.filter((favorite) => favorite.id !== id);
      }

      if (state.offer?.id === id) {
        state.offer.isFavorite = status;
      }

      state.nearby.forEach((offer) => {
        if (offer.id === id) {
          offer.isFavorite = status;
        }
      });
    })
    .addCase(setFavoritesCount, (state, action) => {
      state.favoritesCount = action.payload;
    })
    .addCase(incrementFavoritesCount, (state) => {
      state.favoritesCount += 1;
    })
    .addCase(decrementFavoritesCount, (state) => {
      state.favoritesCount -= 1;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
);
