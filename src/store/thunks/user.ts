import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, isAxiosError } from 'axios';
import { UserData } from '../../types/user-data';
import { APIRoute } from '../../constants/app';
import { removeToken, saveToken } from '../../services/token';
import { AuthData } from '../../types/auth-data';
import { StatusCodes } from 'http-status-codes';

export const checkAuthAction = createAsyncThunk<{ email: string }, undefined, {
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    try {
      const { data: { email } } = await api.get<UserData>(APIRoute.Login,
        { localErrorStatuses: [StatusCodes.BAD_REQUEST] },
      );
      return { email };
    } catch (error) {
      removeToken();
      throw error;
    }
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, {
  extra: AxiosInstance;
  rejectValue: string;
}>(
  'user/login',
  async ({ login: email, password }, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login,
        { email, password },
        {
          localErrorStatuses: [
            StatusCodes.UNAUTHORIZED,
            StatusCodes.BAD_REQUEST,
          ]
        },
      );
      saveToken(data.token);
      return data;
    } catch (error) {
      if (isAxiosError<{ details?: { messages?: string[] }[] }>(error)) {
        const validationMessage = error.response?.data.details?.[0]?.messages?.[0];

        if (validationMessage) {
          return rejectWithValue(validationMessage);
        }
      }
      throw error;
    }
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);
    removeToken();
  },
);
