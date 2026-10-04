import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { APIRoute } from '../../constants/app';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { loadDetailedOffer, loadNearbyOffers, loadReviews } from '../slices/detailedOffer';
import { DetailedOffer } from '../../types/detailed-offer';

export const fetchOfferAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchOffer',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<DetailedOffer>(APIRoute.OfferById(id));
    dispatch(loadDetailedOffer(data));
  }
);

export const fetchNearbyOffersAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchNearbyOffers',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.NearbyOffers(id));
    dispatch(loadNearbyOffers(data));
  }
);

export const fetchReviewsAction = createAsyncThunk<void, string, {
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (id, { dispatch, extra: api }) => {
    const { data } = await api.get<Review[]>(APIRoute.Reviews(id));
    dispatch(loadReviews(data));
  }
);

export const postReviewAction = createAsyncThunk<void, { id: string; comment: string; rating: number }, {
  extra: AxiosInstance;
}>(
  'data/postReview',
  async ({ id, comment, rating }, { dispatch, extra: api }) => {
    await api.post<Review>(APIRoute.Reviews(id), { comment, rating });
    dispatch(fetchReviewsAction(id));
  }
);
