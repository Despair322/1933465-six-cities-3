import { configureStore } from '@reduxjs/toolkit';
import axios, { type AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { APIRoute, AuthorizationStatus } from '../../constants';
import { makeFakeUserData } from '../../mocks/data/user';
import { getToken, saveToken } from '../../services/token';
import userReducer from '../slices/user';
import { checkAuthAction, loginAction, logoutAction } from './user';

describe('User thunks', () => {
  let api: AxiosInstance;
  let mockApi: MockAdapter;
  let store: ReturnType<typeof createTestStore>;

  const userData = makeFakeUserData();

  function createTestStore(testApi: AxiosInstance) {
    return configureStore({
      reducer: { user: userReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: { extraArgument: testApi } }),
    });
  }

  beforeEach(() => {
    api = axios.create();
    mockApi = new MockAdapter(api);
    localStorage.clear();
    store = createTestStore(api);
  });

  afterEach(() => {
    mockApi.restore();
    localStorage.clear();
  });

  describe('checkAuthAction', () => {
    it('should return user data from the API and set authenticated state', async () => {
      mockApi.onGet(APIRoute.Login).reply(StatusCodes.OK, userData);

      const result = await store.dispatch(checkAuthAction());

      expect(checkAuthAction.fulfilled.match(result)).toBe(true);
      if (checkAuthAction.fulfilled.match(result)) {
        expect(result.payload).toEqual(userData);
      }
      expect(mockApi.history.get).toHaveLength(1);
      expect(mockApi.history.get[0].url).toBe(APIRoute.Login);
      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(store.getState().user.userData).toEqual({
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        isPro: userData.isPro,
        name: userData.name,
      });
    });

    it('should reject and remove the saved token when the API request fails', async () => {
      saveToken('expired-token');
      mockApi.onGet(APIRoute.Login).reply(StatusCodes.UNAUTHORIZED);

      const result = await store.dispatch(checkAuthAction());

      expect(checkAuthAction.rejected.match(result)).toBe(true);
      expect(getToken()).toBe('');
      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(store.getState().user.userData).toBeNull();
    });
  });

  describe('loginAction', () => {
    it('should send credentials, save token and set authenticated state', async () => {
      mockApi.onPost(APIRoute.Login, {
        email: userData.email,
        password: 'password',
      }).reply(StatusCodes.OK, userData);

      const result = await store.dispatch(loginAction({
        login: userData.email,
        password: 'password',
      }));

      expect(loginAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.post).toHaveLength(1);
      expect(mockApi.history.post[0].url).toBe(APIRoute.Login);
      expect(mockApi.history.post[0].data).toBe(JSON.stringify({
        email: userData.email,
        password: 'password',
      }));
      expect(getToken()).toBe(userData.token);
      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(store.getState().user.userData).toEqual({
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        isPro: userData.isPro,
        name: userData.name,
      });
    });

    it('should reject with the validation message returned by the API', async () => {
      const validationMessage = 'Password is too short';
      mockApi.onPost(APIRoute.Login).reply(StatusCodes.BAD_REQUEST, {
        details: [{ messages: [validationMessage] }],
      });

      const result = await store.dispatch(loginAction({
        login: userData.email,
        password: 'x',
      }));

      expect(loginAction.rejected.match(result)).toBe(true);
      if (loginAction.rejected.match(result)) {
        expect(result.payload).toBe(validationMessage);
      }
      expect(getToken()).toBe('');
    });

    it('should preserve the error for an API failure without a validation message', async () => {
      mockApi.onPost(APIRoute.Login).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(loginAction({
        login: userData.email,
        password: 'password',
      }));

      expect(loginAction.rejected.match(result)).toBe(true);
      if (loginAction.rejected.match(result)) {
        expect(result.payload).toBeUndefined();
        expect(result.error.message).toBe('Request failed with status code 500');
      }
    });
  });

  describe('logoutAction', () => {
    it('should send logout request and remove the saved token', async () => {
      saveToken(userData.token);
      mockApi.onDelete(APIRoute.Logout).reply(StatusCodes.OK);

      const result = await store.dispatch(logoutAction());

      expect(logoutAction.fulfilled.match(result)).toBe(true);
      expect(mockApi.history.delete).toHaveLength(1);
      expect(mockApi.history.delete[0].url).toBe(APIRoute.Logout);
      expect(getToken()).toBe('');
      expect(store.getState().user.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(store.getState().user.userData).toBeNull();
    });

    it('should keep the saved token when the logout request fails', async () => {
      saveToken(userData.token);
      mockApi.onDelete(APIRoute.Logout).reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const result = await store.dispatch(logoutAction());

      expect(logoutAction.rejected.match(result)).toBe(true);
      expect(getToken()).toBe(userData.token);
    });
  });
});
