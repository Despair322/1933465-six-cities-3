import { createAction } from '@reduxjs/toolkit';
import type { AuthorizationStatusType, CityName, SortType } from '../types/types';
import { Offer } from '../types/offer';
import { OfferDescription } from '../types/offer-description';

export const setActiveCity = createAction<CityName>('main/setActiveCity');
export const setSortType = createAction<SortType>('main/setSortType');
export const loadOffers = createAction<Offer[]>('main/loadOffers');
export const loadFavorites = createAction<Offer[]>('favorites/loadFavorites');
export const loadOffer = createAction<OfferDescription>('offer/loadOffer');
export const loadNearby = createAction<Offer[]>('offer/loadNearby');
export const requireAuthorization = createAction<AuthorizationStatusType>('auth/requireAuthorization');
