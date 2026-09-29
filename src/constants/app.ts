import type { StringRouteKeys } from '../types/types';


export const numberOfStars = 5;

export const AppRoute = {
  Main: '/',
  Login: '/login',
  Offer: '/offer/:id',
  OfferById: (id: string) => `/offer/${id}`,
  Favorites: '/favorites',
  NotFound: '/404',
} as const;

export const PageClassesMap: Partial<Record<StringRouteKeys, readonly string[] | string>> = {
  [AppRoute.Main]: ['page--gray', 'page--main'],
  [AppRoute.Login]: ['page--gray', 'page--login'],
};

export const AuthorizationStatus = {
  Auth: 'AUTH',
  NoAuth: 'NO_AUTH',
  Unknown: 'UNKNOWN',
} as const;

export const CardVariants = {
  Main: 'main',
  Favorites: 'favorites',
  Near: 'near',
} as const;


export const RatingVariants = {
  Card: 'card',
  Offer: 'offer',
} as const;

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

export const MapVariants = {
  Main: 'main',
  Offer: 'offer',
} as const;

export const SORT_OPTIONS = [
  { value: 'popular', title: 'Popular' },
  { value: 'price', title: 'Price: low to high' },
  { value: 'price-high-to-low', title: 'Price: high to low' },
  { value: 'top-rated', title: 'Top rated first' },
] as const;

export const APIRoute = {
  Offers: '/offers',
  OfferById: (id: string) => `/offers/${encodeURIComponent(id)}`,
  NearbyOffers: (id: string) =>
    `/offers/${encodeURIComponent(id)}/nearby`,
  Favorites: '/favorite',
  setFavorite: (id: string, status: boolean) => `/favorite/${encodeURIComponent(id)}/${status ? 1 : 0}`,
  Comments: (id: string) => `/comments/${encodeURIComponent(id)}`,
  Login: '/login',
  Logout: '/logout',
} as const;

export const TIMEOUT_SHOW_ERROR = 2000;
