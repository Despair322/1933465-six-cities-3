import { createReducer } from '@reduxjs/toolkit';
import { loadFavorites, loadNearby, loadOffer, loadOffers, requireAuthorization, setActiveCity, setSortType } from './action';
import { DefaultCity } from '../constants/cities';
import type { AuthorizationStatusType, CityName, SortType } from '../types/types';
import { Offer } from '../types/offer';
import { OfferDescription } from '../types/offer-description';
import { AuthorizationStatus } from '../constants/app';

type State = {
  city: CityName;
  sortType: SortType;
  offers: Offer[];
  favorites: Offer[];
  offer: OfferDescription | null;
  nearby: Offer[];
  authorizationStatus: AuthorizationStatusType;
};


const initialState: State = {
  city: DefaultCity,
  sortType: 'popular',
  offers: [],
  favorites: [],
  offer: null,
  nearby: [],
  authorizationStatus: AuthorizationStatus.Unknown,
};

export const reducer = createReducer(initialState, (builder) =>
  builder
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
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
);
