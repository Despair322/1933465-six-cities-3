import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute } from '../../constants/app';
import type { Offer } from '../../types/offer';
import { AxiosInstance } from 'axios';

export const fetchOffersAction = createAsyncThunk<Offer[], undefined, {
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);
    return data;
  }
);
