import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus } from '../../constants/app';
import { Offer } from '../../types/offer';
import { fetchFavoritesAction } from '../thunks/favorites';
import { favoriteStatusChanged } from '../events/favorite';

interface FavoritesState {
  favorites: Offer[];
  oldFavorites: Offer[];
  loadingStatus: { favorites: RequestStatus };
  favoritesCount: number;
}

const initialState: FavoritesState = {
  favorites: [],
  oldFavorites: [],
  loadingStatus: { favorites: RequestStatus.Idle },
  favoritesCount: 0,
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
        state.favoritesCount = action.payload.length;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.loadingStatus = { favorites: RequestStatus.Failed };
      })
      .addCase(favoriteStatusChanged, (state, action: PayloadAction<{ id: string; isFavorite: boolean }>) => {
        const { id, isFavorite } = action.payload;
        state.oldFavorites.forEach((offer) => {
          if (offer.id === id) {
            offer.isFavorite = isFavorite;
          }
        });
      }),
  initialState,
  name: 'favorites', reducers: {
    setOldFavorites: (state, action: PayloadAction<Offer[]>) => {
      state.oldFavorites = action.payload;
    }
  },
  selectors: {
    selectFavorites: (state) => state.favorites,
    selectOldFavorites: (state) => state.oldFavorites,
    selectFavoritesLoadingStatus: (state) => state.loadingStatus.favorites,
    selectFavoritesCount: (state) => state.favoritesCount,
  }
});

export const { selectFavorites, selectOldFavorites, selectFavoritesLoadingStatus, selectFavoritesCount } = favoritesSlice.selectors;
export const { setOldFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
