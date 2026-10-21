import { configureStore, type Middleware } from '@reduxjs/toolkit';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, RequestStatus } from '../../constants';
import { makeFakeOffer, makeFakeDetailedOffer, makeFakeReview } from '../../mocks';
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
      const offer = makeFakeDetailedOffer({ id: 'offer/1' });
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
      const offers = [makeFakeOffer({ id: 'offer-2' })];
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
      const reviews = [makeFakeReview()];
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
      const review = makeFakeReview();
      const reviewData = { id: 'offer-1', comment: review.comment, rating: review.rating };
      mockApi.onPost(APIRoute.Reviews(reviewData.id), {
        comment: reviewData.comment,
        rating: reviewData.rating,
      }).reply(StatusCodes.CREATED);
      mockApi.onGet(APIRoute.Reviews(reviewData.id)).reply(StatusCodes.OK, [review]);

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
      const review = makeFakeReview();
      const reviewData = { id: 'offer-1', comment: review.comment, rating: review.rating };
      mockApi.onPost(APIRoute.Reviews(reviewData.id)).reply(StatusCodes.BAD_REQUEST);

      const result = await store.dispatch(postReviewAction(reviewData));

      expect(postReviewAction.rejected.match(result)).toBe(true);
      expect(mockApi.history.get).toHaveLength(0);
    });
  });
});
