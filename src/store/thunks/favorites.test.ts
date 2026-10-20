import { configureStore, type Middleware } from '@reduxjs/toolkit';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, RequestStatus } from '../../constants';
import { makeFakeOffer, makeFakeDetailedOffer } from '../../mocks/data/offer';
import { favoriteStatusChanged } from '../events/favorite';
import favoritesReducer, { setOldFavorites } from '../slices/favorites';
import { fetchFavoritesAction, postFavoriteAction } from './favorites';

describe('Favorites thunks', () => {
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
      reducer: { favorites: favoritesReducer },
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
    vi.restoreAllMocks();
  });

  describe('fetchFavoritesAction', () => {
    it('should return favorites received from the API', async () => {
      const favorites = [makeFakeOffer({ id: 'offer-1' }), makeFakeOffer({ id: 'offer-2' })];
      mockApi.onGet(APIRoute.Favorites).reply(StatusCodes.OK, favorites);

      const result = await store.dispatch(fetchFavoritesAction());

      expect(fetchFavoritesAction.fulfilled.match(result)).toBe(true);
      if (fetchFavoritesAction.fulfilled.match(result)) {
        expect(result.payload).toEqual(favorites);
      }
      expect(mockApi.history.get).toHaveLength(1);
      expect(mockApi.history.get[0].url).toBe(APIRoute.Favorites);
      expect(store.getState().favorites.favorites).toEqual(favorites);
    });

    it('should reject when the API request fails', async () => {
      mockApi.onGet(APIRoute.Favorites).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(fetchFavoritesAction());

      expect(fetchFavoritesAction.rejected.match(result)).toBe(true);
      expect(store.getState().favorites.loadingStatus.favorites).toBe(RequestStatus.Failed);
    });
  });

  describe('postFavoriteAction', () => {
    it('should post the favorite status and dispatch status change and favorites refresh on success', async () => {
      const offerId = 'offer-1';
      const detailedOffer = makeFakeDetailedOffer({ id: offerId, isFavorite: true });
      mockApi.onPost(APIRoute.setFavorite(offerId, true)).reply(StatusCodes.OK, detailedOffer);
      mockApi.onGet(APIRoute.Favorites).reply(StatusCodes.OK, [makeFakeOffer({ id: offerId })]);
      store.dispatch(setOldFavorites([makeFakeOffer({ id: offerId, isFavorite: false })]));

      const result = await store.dispatch(postFavoriteAction({ id: offerId, status: true }));
      await store.dispatch(fetchFavoritesAction());

      expect(postFavoriteAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.post[0].url).toBe(APIRoute.setFavorite(offerId, true));
      expect(actions.some((action) => favoriteStatusChanged.match(action))).toBe(true);
      expect(actions.some((action) => fetchFavoritesAction.pending.match(action))).toBe(true);
      expect(store.getState().favorites.oldFavorites[0].isFavorite).toBe(true);
      expect(store.getState().favorites.favorites).toEqual([makeFakeOffer({ id: offerId })]);
    });

    it('should refresh favorites and reconcile status after a conflict response', async () => {
      const offerId = 'offer-1';
      mockApi.onPost(APIRoute.setFavorite(offerId, true)).reply(StatusCodes.CONFLICT);
      mockApi.onGet(APIRoute.Favorites).reply(StatusCodes.OK, [makeFakeOffer({ id: offerId })]);
      store.dispatch(setOldFavorites([makeFakeOffer({ id: offerId, isFavorite: false })]));

      const result = await store.dispatch(postFavoriteAction({ id: offerId, status: true }));

      expect(postFavoriteAction.fulfilled.match(result)).toBe(true);
      expect(store.getState().favorites.favorites).toEqual([makeFakeOffer({ id: offerId })]);
      expect(store.getState().favorites.oldFavorites[0].isFavorite).toBe(true);
      expect(actions.some((action) => favoriteStatusChanged.match(action))).toBe(true);
      expect(mockApi.history.get).toHaveLength(1);
    });

    it('should mark the offer as not favorite after a not-found response when it is absent from refreshed favorites', async () => {
      const offerId = 'offer-1';
      mockApi.onPost(APIRoute.setFavorite(offerId, false)).reply(StatusCodes.NOT_FOUND);
      mockApi.onGet(APIRoute.Favorites).reply(StatusCodes.OK, []);
      store.dispatch(setOldFavorites([makeFakeOffer({ id: offerId })]));

      const result = await store.dispatch(postFavoriteAction({ id: offerId, status: false }));

      expect(postFavoriteAction.fulfilled.match(result)).toBe(true);
      expect(store.getState().favorites.favorites).toEqual([]);
      expect(store.getState().favorites.oldFavorites[0].isFavorite).toBe(false);
    });

    it('should reject with the HTTP status for other API errors', async () => {
      mockApi.onPost(APIRoute.setFavorite('offer-1', true)).reply(StatusCodes.UNAUTHORIZED);

      const result = await store.dispatch(
        postFavoriteAction({ id: 'offer-1', status: true })
      );

      expect(postFavoriteAction.rejected.match(result)).toBe(true);
      if (postFavoriteAction.rejected.match(result)) {
        expect(result.payload).toBe(StatusCodes.UNAUTHORIZED);
      }
      expect(mockApi.history.get).toHaveLength(0);
    });

    it('should use 500 as the rejection payload when the error has no HTTP response', async () => {
      mockApi.onPost(APIRoute.setFavorite('offer-1', true)).networkError();

      const result = await store.dispatch(
        postFavoriteAction({ id: 'offer-1', status: true })
      );

      expect(postFavoriteAction.rejected.match(result)).toBe(true);
      if (postFavoriteAction.rejected.match(result)) {
        expect(result.payload).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });

    it('should rethrow non-Axios errors', async () => {
      const unexpectedError = new Error('Unexpected failure');
      vi.spyOn(api, 'post').mockRejectedValue(unexpectedError);

      const result = await store.dispatch(
        postFavoriteAction({ id: 'offer-1', status: true })
      );

      expect(postFavoriteAction.rejected.match(result)).toBe(true);
      if (postFavoriteAction.rejected.match(result)) {
        expect(result.error.message).toBe(unexpectedError.message);
        expect(result.payload).toBeUndefined();
      }
    });
  });
});
