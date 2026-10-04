import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CityName, SortType } from '../../types/types';
import { fetchOffersAction } from '../thunks/catalog';
import type { Offer } from '../../types/offer';
import { DefaultCity } from '../../constants/cities';
import { RequestStatus } from '../../constants/app';
import { favoriteStatusChanged } from '../events/favorite';

interface CatalogState {
  city: CityName;
  sortType: SortType;
  offers: Offer[];
  loadingStatus: {offers: RequestStatus};
}

const initialState: CatalogState = {
  city: DefaultCity,
  sortType: 'popular',
  offers: [],
  loadingStatus: {offers: RequestStatus.Idle},
};


const catalogSlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.loadingStatus = {offers: RequestStatus.Loading};
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.loadingStatus = {offers: RequestStatus.Succeeded};
        state.offers = action.payload;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.loadingStatus = {offers: RequestStatus.Failed};
      })
      .addCase(favoriteStatusChanged, (state, action: PayloadAction<{ id: string; isFavorite: boolean }>) => {
        const { id, isFavorite } = action.payload;
        state.offers.forEach((offer) => {
          if (offer.id === id) {
            offer.isFavorite = isFavorite;
          }
        });
      }),
  initialState,
  name: 'catalog',
  reducers: {
    setActiveCity: (state, action: PayloadAction<CityName>) => {
      state.city = action.payload;
    },
    setSortType: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
    }
  },
  selectors: {
    selectActiveCity: (state) => state.city,
    selectOffers: (state) => state.offers,
    selectOffersLoadingStatus: (state) => state.loadingStatus.offers,
    selectSortType: (state) => state.sortType,
  }
});

export const { setActiveCity, setSortType } = catalogSlice.actions;
export const { selectActiveCity, selectOffers, selectOffersLoadingStatus, selectSortType } = catalogSlice.selectors;

export default catalogSlice.reducer;
