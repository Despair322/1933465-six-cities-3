import { AxiosError } from 'axios';

export const isHandledLocally = (error: AxiosError): boolean => {
  const status = error.response?.status;
  const localStatuses = error.config?.localErrorStatuses ?? [];

  return status !== undefined && localStatuses.includes(status);
};
