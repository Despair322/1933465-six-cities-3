import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { APIRoute } from '../constants/app';

export const isHandledLocally = (error: AxiosError): boolean => {
  const status = error.response?.status;
  const method = error.config?.method;
  const url = error.config?.url ?? '';

  if (
    status === StatusCodes.BAD_REQUEST &&
    method === 'post' &&
    url === APIRoute.Login
  ) {
    return true;
  }

  if (
    status === StatusCodes.UNAUTHORIZED &&
    method === 'get' &&
    url === APIRoute.Login
  ) {
    return true;
  }

  const isFavoriteMutation =
    method === 'post' &&
    url.startsWith(`${APIRoute.Favorites}/`);

  return isFavoriteMutation && (
    (status === StatusCodes.CONFLICT && url.endsWith('/1')) ||
    (status === StatusCodes.NOT_FOUND && url.endsWith('/0'))
  );
};

export const isAlreadyInRequestedState = (error: AxiosError, status?: boolean): boolean => {
  const responseStatus = error.response?.status;
  const alreadyInRequestedState =
    (status && responseStatus === 409) || (!status && responseStatus === 404);
  return alreadyInRequestedState;
};
