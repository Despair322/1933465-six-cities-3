import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    localErrorStatuses?: number[];
  }
}
