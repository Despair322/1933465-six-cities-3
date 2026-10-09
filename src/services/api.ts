import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from './token';
import { StatusCodes } from 'http-status-codes';
import { isHandledLocally } from '../utils/api';
import { ShowErrorToast } from './notification';

const BACKEND_URL = 'https://15.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

type DetailMessageType = {
  type: string;
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL as string,
    timeout: REQUEST_TIMEOUT as number,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['x-token'] = token;
      }

      return config;
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (error.response && shouldDisplayError(error.response) && !isHandledLocally(error)) {
        if (error.response?.status as StatusCodes === StatusCodes.UNAUTHORIZED) {
          ShowErrorToast('Unauthorized access. Please log in.');
        } else {
          const detailMessage = (error.response.data);
          ShowErrorToast(detailMessage.message);
        }
      }
      throw error;
    }
  );

  return api;
};

