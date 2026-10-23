import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, isAxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { APIRoute } from '../../constants';
import { showErrorToast } from '../../services';
import type { Offer, Review, DetailedOffer } from '../../types';
import { loadDetailedOffer, loadNearbyOffers, loadReviews } from '../slices/detailed-offer';

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
    try {
      await api.post<Review>(
        APIRoute.Reviews(id),
        { comment, rating },
        { localErrorStatuses: [StatusCodes.BAD_REQUEST, StatusCodes.NOT_FOUND] }
      );
    } catch (error) {
      if (!isAxiosError(error) || error.response?.status !== StatusCodes.UNAUTHORIZED) {
        showErrorToast('Failed to send review.');
      }
      throw error;
    }
    dispatch(fetchReviewsAction(id));
  }
);
