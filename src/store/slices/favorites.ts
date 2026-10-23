import { createReducer } from '@reduxjs/toolkit';
import { RequestStatus } from '../../constants';
import type { Offer } from '../../types';
import { fetchFavoritesAction } from '../thunks/favorites';
import { favoriteStatusChanged } from '../events/favorite';

interface FavoritesState {
  favorites: Offer[];
  loadingStatus: { favorites: RequestStatus };
}

const initialState: FavoritesState = {
  favorites: [],
  loadingStatus: { favorites: RequestStatus.Idle },
};

const favoritesReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(fetchFavoritesAction.pending, (state) => {
      state.loadingStatus = { favorites: RequestStatus.Loading };
    })
    .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
      state.loadingStatus = { favorites: RequestStatus.Succeeded };
      state.favorites = action.payload;
    })
    .addCase(fetchFavoritesAction.rejected, (state) => {
      state.loadingStatus = { favorites: RequestStatus.Failed };
    })
    .addCase(favoriteStatusChanged, (state, action) => {
      const { id, isFavorite } = action.payload;
      if (!isFavorite) {
        state.favorites = state.favorites.filter((offer) => offer.id !== id);
      }
    })
);

type FavoritesRootState = { favorites: FavoritesState };

export const selectFavorites = (state: FavoritesRootState) => state.favorites.favorites;
export const selectFavoritesLoadingStatus = (state: FavoritesRootState) => state.favorites.loadingStatus.favorites;
export const selectFavoritesCount = (state: FavoritesRootState) => state.favorites.favorites.length;

export default favoritesReducer;
