import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../constants';
import type { StoredUserData } from '../../types';
import { checkAuthAction, loginAction, logoutAction } from '../thunks/user';


interface UserState {
  userData: StoredUserData | null;
  authorizationStatus: AuthorizationStatus;
}

const initialState: UserState = {
  userData: null,
  authorizationStatus: AuthorizationStatus.Unknown,
};

const userSlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        const { email, avatarUrl, isPro, name } = action.payload;
        state.userData = { email, avatarUrl, isPro, name };
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        const { email, avatarUrl, isPro, name } = action.payload;
        state.userData = { email, avatarUrl, isPro, name };
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.userData = null;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      }),
  initialState,
  name: 'user',
  reducers: {
    setUserData: (state, action: PayloadAction<StoredUserData>) => {
      state.userData = action.payload;
    },
    requireAuthorization: (state, action: PayloadAction<AuthorizationStatus>) => {
      state.authorizationStatus = action.payload;
    }
  },
  selectors: {
    selectUserData: (state) => state.userData,
    selectAuthorizationStatus: (state) => state.authorizationStatus,
  }
});

export const { setUserData, requireAuthorization } = userSlice.actions;
export const { selectUserData, selectAuthorizationStatus } = userSlice.selectors;

export default userSlice.reducer;
