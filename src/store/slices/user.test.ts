import { AuthorizationStatus } from '../../constants';
import type { StoredUserData, UserData } from '../../types/user-data';
import { checkAuthAction, loginAction, logoutAction } from '../thunks/user';
import userSlice, {
  requireAuthorization,
  selectAuthorizationStatus,
  selectUserData,
  setUserData,
} from './user';

describe('User Slice', () => {
  const initialState = userSlice(undefined, { type: '' });
  const mockUserData: UserData = {
    email: 'user@test.com',
    token: 'user-token',
    avatarUrl: 'avatar.jpg',
    isPro: true,
    name: 'Test User',
  };
  const storedUserData: StoredUserData = {
    email: mockUserData.email,
    avatarUrl: mockUserData.avatarUrl,
    isPro: mockUserData.isPro,
    name: mockUserData.name,
  };

  it('should return initial state', () => {
    expect(initialState).toEqual({
      userData: null,
      authorizationStatus: AuthorizationStatus.Unknown,
    });
  });

  it('should preserve the state for an unknown action', () => {
    const state = userSlice(undefined, setUserData(storedUserData));

    expect(userSlice(state, { type: '' })).toEqual(state);
  });

  describe('checkAuthAction', () => {
    it('should set Auth and userData when checkAuthAction.fulfilled', () => {
      const action = checkAuthAction.fulfilled(
        mockUserData,
        'request-id',
        undefined
      );
      const result = userSlice(initialState, action);

      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(result.userData).toEqual(storedUserData);
    });

    it('should set NoAuth and clear userData when checkAuthAction.rejected', () => {
      const stateWithUser = userSlice(initialState, setUserData({
        ...storedUserData,
        email: 'old@test.com',
      }));
      const action = checkAuthAction.rejected(new Error('Request failed'), 'request-id', undefined);
      const result = userSlice(stateWithUser, action);

      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.userData).toBeNull();
    });
  });

  describe('loginAction', () => {
    it('should set Auth and userData when loginAction.fulfilled', () => {
      const action = loginAction.fulfilled(
        mockUserData,
        'request-id',
        { login: mockUserData.email, password: 'password' }
      );
      const result = userSlice(initialState, action);

      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(result.userData).toEqual(storedUserData);
    });
  });

  describe('logoutAction', () => {
    it('should set NoAuth and clear userData when logoutAction.fulfilled', () => {
      const stateWithUser = userSlice(initialState, setUserData(storedUserData));
      const action = logoutAction.fulfilled(undefined, 'request-id', undefined);
      const result = userSlice(stateWithUser, action);

      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.userData).toBeNull();
    });
  });

  describe('setUserData', () => {
    it('should replace userData with the action payload', () => {
      const result = userSlice(initialState, setUserData(storedUserData));

      expect(result.userData).toEqual(storedUserData);
    });
  });

  describe('requireAuthorization', () => {
    it('should update the authorization status', () => {
      const result = userSlice(initialState, requireAuthorization(AuthorizationStatus.Auth));

      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
    });
  });

  describe('selectors', () => {
    it('should select user data and authorization status', () => {
      const state = userSlice(
        userSlice(initialState, setUserData(storedUserData)),
        requireAuthorization(AuthorizationStatus.Auth)
      );
      const rootState = { user: state };

      expect(selectUserData(rootState)).toEqual(storedUserData);
      expect(selectAuthorizationStatus(rootState)).toBe(AuthorizationStatus.Auth);
    });
  });
});
