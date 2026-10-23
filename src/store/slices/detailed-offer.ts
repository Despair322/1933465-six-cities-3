import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestStatus } from '../../constants';
import type { Offer, Review, DetailedOffer } from '../../types';
import { fetchNearbyOffersAction, fetchOfferAction, fetchReviewsAction } from '../thunks/detailed-offer';
import { favoriteStatusChanged } from '../events/favorite';


interface DetailedOfferState {
  detailedOffer: DetailedOffer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  loadingStatus: { detailedOffer: RequestStatus; nearbyOffers: RequestStatus; reviews: RequestStatus };
}

const initialState: DetailedOfferState = {
  detailedOffer: null,
  nearbyOffers: [],
  reviews: [],
  loadingStatus: { detailedOffer: RequestStatus.Idle, nearbyOffers: RequestStatus.Idle, reviews: RequestStatus.Idle },
};

const MAX_RECENT_REVIEWS = 10;

const detailedOfferSlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.loadingStatus.detailedOffer = RequestStatus.Loading;
      })
      .addCase(fetchOfferAction.fulfilled, (state) => {
        state.loadingStatus.detailedOffer = RequestStatus.Succeeded;
      })
      .addCase(fetchOfferAction.rejected, (state) => {
        state.loadingStatus.detailedOffer = RequestStatus.Failed;
      })
      .addCase(fetchNearbyOffersAction.pending, (state) => {
        state.loadingStatus.nearbyOffers = RequestStatus.Loading;
      })
      .addCase(fetchNearbyOffersAction.fulfilled, (state) => {
        state.loadingStatus.nearbyOffers = RequestStatus.Succeeded;
      })
      .addCase(fetchNearbyOffersAction.rejected, (state) => {
        state.loadingStatus.nearbyOffers = RequestStatus.Failed;
      })
      .addCase(fetchReviewsAction.pending, (state) => {
        state.loadingStatus.reviews = RequestStatus.Loading;
      })
      .addCase(fetchReviewsAction.fulfilled, (state) => {
        state.loadingStatus.reviews = RequestStatus.Succeeded;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.loadingStatus.reviews = RequestStatus.Failed;
      })
      .addCase(favoriteStatusChanged, (state, action: PayloadAction<{ id: string; isFavorite: boolean }>) => {
        const { id, isFavorite } = action.payload;
        if (state.detailedOffer && state.detailedOffer.id === id) {
          state.detailedOffer.isFavorite = isFavorite;
        } else {
          state.nearbyOffers.forEach((offer) => {
            if (offer.id === id) {
              offer.isFavorite = isFavorite;
            }
          });
        }
      }),
  initialState,
  name: 'detailedOffer',
  reducers: {
    loadDetailedOffer: (state, action: PayloadAction<DetailedOffer>) => {
      state.detailedOffer = action.payload;
    },
    loadNearbyOffers: (state, action: PayloadAction<Offer[]>) => {
      state.nearbyOffers = action.payload;
    },
    loadReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
  },
  selectors: {
    selectDetailedOffer: (state) => state.detailedOffer,
    selectDetailedOfferId: (state) => state.detailedOffer?.id,
    selectNearbyOffers: (state) => state.nearbyOffers,
    selectReviews: (state) => state.reviews,
    selectReviewsCount: (state) => state.reviews.length,
    selectDetailedOfferLoadingStatus: (state) => state.loadingStatus.detailedOffer,
    selectNearbyOffersLoadingStatus: (state) => state.loadingStatus.nearbyOffers,
    selectReviewsLoadingStatus: (state) => state.loadingStatus.reviews,
  }
});

export const { loadDetailedOffer, loadNearbyOffers, loadReviews } = detailedOfferSlice.actions;
export const { selectDetailedOffer, selectDetailedOfferId, selectDetailedOfferLoadingStatus,
  selectNearbyOffers, selectNearbyOffersLoadingStatus,
  selectReviews, selectReviewsCount, selectReviewsLoadingStatus } = detailedOfferSlice.selectors;

export const selectTopTenRecentReviews = createSelector(
  [selectReviews],
  (reviews) => [...reviews]
    .sort((firstReview, secondReview) => new Date(secondReview.date).getTime() - new Date(firstReview.date).getTime())
    .slice(0, MAX_RECENT_REVIEWS)
);

export default detailedOfferSlice.reducer;
