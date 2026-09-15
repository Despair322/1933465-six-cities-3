export const numberOfStars = 5;

export const AppRoute = {
  Main: '/',
  CityByName: (city: string) => `/?city=${encodeURIComponent(city)}`,
  Login: '/login',
  Offer: '/offer/:id',
  OfferById: (id: string) => `/offer/${id}`,
  Favorites: '/favorites',
} as const;

export type StringRouteValues = Extract<
  (typeof AppRoute)[keyof typeof AppRoute],
  string
>;

export type StringRouteKeys = StringRouteValues | '*';

export const PageClassesMap: Partial<Record<StringRouteKeys, readonly string[] | string>> = {
  [AppRoute.Main]: ['page--gray', 'page--main'],
  [AppRoute.Login]: ['page--gray', 'page--login'],
};

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const CardVariants = {
  Main: 'main',
  Favorites: 'favorites',
  Near: 'near',
} as const;

export type CardVariant = (typeof CardVariants)[keyof typeof CardVariants];

export const RatingVariants = {
  Card: 'card',
  Offer: 'offer',
};

export type RatingVariant = (typeof RatingVariants)[keyof typeof RatingVariants];

export const URL_MARKER_DEFAULT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/pin.svg';

export const URL_MARKER_CURRENT =
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/demo/interactive-map/main-pin.svg';

export const MapVariants = {
  Main: 'main',
  Offer: 'offer',
};

export type MapVariant = (typeof MapVariants)[keyof typeof MapVariants];
