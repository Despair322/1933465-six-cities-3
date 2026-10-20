import { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosResponse } from 'axios';
import { isHandledLocally } from './api';

function createAxiosError(status?: number, localErrorStatuses?: number[]): AxiosError {
  const headers = new AxiosHeaders();
  const error = new AxiosError('Request failed', undefined, { headers, localErrorStatuses });

  if (status !== undefined) {
    error.response = {
      data: null,
      status,
      statusText: 'Request failed',
      headers,
      config: { headers },
    } satisfies AxiosResponse;
  }

  return error;
}

describe('isHandledLocally', () => {
  it('returns true when the response status is listed as locally handled', () => {
    expect(isHandledLocally(createAxiosError(401, [400, 401]))).toBe(true);
  });

  it('returns false when the response status is not listed', () => {
    expect(isHandledLocally(createAxiosError(500, [400, 401]))).toBe(false);
  });

  it('returns false when there is no response status', () => {
    expect(isHandledLocally(createAxiosError(undefined, [401]))).toBe(false);
  });

  it('returns false when no local statuses are configured', () => {
    expect(isHandledLocally(createAxiosError(401))).toBe(false);
  });
});
