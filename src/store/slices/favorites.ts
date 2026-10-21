import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

const favoritesSlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(fetchFavoritesAction.pending, (state) => {
        state.loadingStatus = { favorites: RequestStatus.Loading };
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.loadingStatus = { favorites: RequestStatus.Succeeded };
        state.favorites = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.loadingStatus = { favorites: RequestStatus.Failed };
      })
      .addCase(favoriteStatusChanged, (state, action: PayloadAction<{ id: string; isFavorite: boolean }>) => {
        const { id, isFavorite } = action.payload;
        if (!isFavorite) {
          state.favorites = state.favorites.filter((offer) => offer.id !== id);
        }
      }),
  initialState,
  name: 'favorites',
  reducers: {
  },
  selectors: {
    selectFavorites: (state) => state.favorites,
    selectFavoritesLoadingStatus: (state) => state.loadingStatus.favorites,
    selectFavoritesCount: (state) => state.favorites.length,
  }
});

export const { selectFavorites, selectFavoritesLoadingStatus, selectFavoritesCount } = favoritesSlice.selectors;


export default favoritesSlice.reducer;
