import { configureStore, type Middleware } from '@reduxjs/toolkit';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, RequestStatus } from '../../constants';
import type { DetailedOffer } from '../../types/detailed-offer';
import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';
import detailedOfferReducer, {
  loadDetailedOffer,
  loadNearbyOffers,
  loadReviews,
} from '../slices/detailedOffer';
import {
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
  postReviewAction,
} from './detailedOffer';

describe('Detailed offer thunks', () => {
  let api: AxiosInstance;
  let mockApi: MockAdapter;
  let actions: unknown[];
  let store: ReturnType<typeof createTestStore>;

  const makeOffer = (id: string): Offer => ({
    id,
    title: `Offer ${id}`,
    type: 'apartment',
    price: 100,
    previewImage: 'image.jpg',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
  });

  const makeDetailedOffer = (id: string): DetailedOffer => ({
    ...makeOffer(id),
    description: 'A comfortable place to stay.',
    images: ['image.jpg'],
    goods: ['Heating'],
    host: { isPro: true, name: 'Host', avatarUrl: 'avatar.jpg' },
    bedrooms: 1,
    maxAdults: 2,
  });

  const makeReview = (): Review => ({
    id: 'review-1',
    comment: 'A lovely place.',
    date: '2024-01-01T00:00:00.000Z',
    rating: 5,
    user: { name: 'Reviewer', avatarUrl: 'avatar.jpg', isPro: false },
  });

  function createTestStore(testApi: AxiosInstance) {
    const actionRecorder: Middleware = () => (next) => (action) => {
      actions.push(action);
      return next(action);
    };

    return configureStore({
      reducer: { detailedOffer: detailedOfferReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: testApi } }).concat(actionRecorder),
    });
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    actions = [];
    store = createTestStore(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  describe('fetchOfferAction', () => {
    it('should fetch and load the detailed offer', async () => {
      const offer = makeDetailedOffer('offer/1');
      mockApi.onGet(APIRoute.OfferById('offer/1')).reply(StatusCodes.OK, offer);

      const result = await store.dispatch(fetchOfferAction('offer/1'));

      expect(fetchOfferAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.get[0].url).toBe(APIRoute.OfferById('offer/1'));
      expect(store.getState().detailedOffer.detailedOffer).toEqual(offer);
      expect(store.getState().detailedOffer.loadingStatus.detailedOffer).toBe(RequestStatus.Succeeded);
      expect(actions.some((action) => loadDetailedOffer.match(action))).toBe(true);
    });

    it('should reject and set failed status when the request fails', async () => {
      mockApi.onGet(APIRoute.OfferById('offer-1')).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(fetchOfferAction('offer-1'));

      expect(fetchOfferAction.rejected.match(result)).toBe(true);
      expect(store.getState().detailedOffer.loadingStatus.detailedOffer).toBe(RequestStatus.Failed);
    });
  });

  describe('fetchNearbyOffersAction', () => {
    it('should fetch and load nearby offers', async () => {
      const offers = [makeOffer('offer-2')];
      mockApi.onGet(APIRoute.NearbyOffers('offer-1')).reply(StatusCodes.OK, offers);

      const result = await store.dispatch(fetchNearbyOffersAction('offer-1'));

      expect(fetchNearbyOffersAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.get[0].url).toBe(APIRoute.NearbyOffers('offer-1'));
      expect(store.getState().detailedOffer.nearbyOffers).toEqual(offers);
      expect(store.getState().detailedOffer.loadingStatus.nearbyOffers).toBe(RequestStatus.Succeeded);
      expect(actions.some((action) => loadNearbyOffers.match(action))).toBe(true);
    });

    it('should reject and set failed status when the request fails', async () => {
      mockApi.onGet(APIRoute.NearbyOffers('offer-1')).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(fetchNearbyOffersAction('offer-1'));

      expect(fetchNearbyOffersAction.rejected.match(result)).toBe(true);
      expect(store.getState().detailedOffer.loadingStatus.nearbyOffers).toBe(RequestStatus.Failed);
    });
  });

  describe('fetchReviewsAction', () => {
    it('should fetch and load reviews', async () => {
      const reviews = [makeReview()];
      mockApi.onGet(APIRoute.Reviews('offer-1')).reply(StatusCodes.OK, reviews);

      const result = await store.dispatch(fetchReviewsAction('offer-1'));

      expect(fetchReviewsAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.get[0].url).toBe(APIRoute.Reviews('offer-1'));
      expect(store.getState().detailedOffer.reviews).toEqual(reviews);
      expect(store.getState().detailedOffer.loadingStatus.reviews).toBe(RequestStatus.Succeeded);
      expect(actions.some((action) => loadReviews.match(action))).toBe(true);
    });

    it('should reject and set failed status when the request fails', async () => {
      mockApi.onGet(APIRoute.Reviews('offer-1')).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(fetchReviewsAction('offer-1'));

      expect(fetchReviewsAction.rejected.match(result)).toBe(true);
      expect(store.getState().detailedOffer.loadingStatus.reviews).toBe(RequestStatus.Failed);
    });
  });

  describe('postReviewAction', () => {
    it('should post a review and trigger reviews refresh', async () => {
      const reviewData = { id: 'offer-1', comment: 'A lovely place.', rating: 5 };
      mockApi.onPost(APIRoute.Reviews(reviewData.id), {
        comment: reviewData.comment,
        rating: reviewData.rating,
      }).reply(StatusCodes.CREATED);
      mockApi.onGet(APIRoute.Reviews(reviewData.id)).reply(StatusCodes.OK, [makeReview()]);

      const result = await store.dispatch(postReviewAction(reviewData));

      expect(postReviewAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.post).toHaveLength(1);
      expect(mockApi.history.post[0].url).toBe(APIRoute.Reviews(reviewData.id));
      expect(mockApi.history.post[0].data).toBe(JSON.stringify({
        comment: reviewData.comment,
        rating: reviewData.rating,
      }));
      expect(actions.some((action) => fetchReviewsAction.pending.match(action))).toBe(true);
    });

    it('should reject when posting the review fails', async () => {
      const reviewData = { id: 'offer-1', comment: 'A lovely place.', rating: 5 };
      mockApi.onPost(APIRoute.Reviews(reviewData.id)).reply(StatusCodes.BAD_REQUEST);

      const result = await store.dispatch(postReviewAction(reviewData));

      expect(postReviewAction.rejected.match(result)).toBe(true);
      expect(mockApi.history.get).toHaveLength(0);
    });
  });
});
