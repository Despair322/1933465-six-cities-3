import { configureStore } from '@reduxjs/toolkit';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, RequestStatus } from '../../constants';
import { makeFakeOffer } from '../../mocks';
import catalogReducer from '../slices/catalog';
import { fetchOffersAction } from './catalog';

describe('Catalog thunks', () => {
  let api: AxiosInstance;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createTestStore>;

  function createTestStore(testApi: AxiosInstance) {
    return configureStore({
      reducer: { catalog: catalogReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: testApi } }),
    });
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    store = createTestStore(api);
  });

  afterEach(() => {
    mockApi.restore();
  });

  describe('fetchOffersAction', () => {
    it('should return offers received from the API', async () => {
      const offers = [makeFakeOffer({ id: 'offer-1' }), makeFakeOffer({ id: 'offer-2' })];
      mockApi.onGet(APIRoute.Offers).reply(StatusCodes.OK, offers);

      const result = await store.dispatch(fetchOffersAction());

      expect(fetchOffersAction.fulfilled.match(result)).toBe(true);
      if (fetchOffersAction.fulfilled.match(result)) {
        expect(result.payload).toEqual(offers);
      }
      expect(mockApi.history.get).toHaveLength(1);
      expect(mockApi.history.get[0].url).toBe(APIRoute.Offers);
      expect(store.getState().catalog.offers).toEqual(offers);
      expect(store.getState().catalog.loadingStatus.offers).toBe(RequestStatus.Succeeded);
    });

    it('should reject and set failed loading status when the API request fails', async () => {
      mockApi.onGet(APIRoute.Offers).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(fetchOffersAction());

      expect(fetchOffersAction.rejected.match(result)).toBe(true);
      expect(store.getState().catalog.loadingStatus.offers).toBe(RequestStatus.Failed);
    });
  });
});
