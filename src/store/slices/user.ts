import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../constants/app';
import { StoredUserData } from '../../types/user-data';
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
        state.userData = { email: action.payload.email };
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userData = null;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.userData = { email: action.payload.email };
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
