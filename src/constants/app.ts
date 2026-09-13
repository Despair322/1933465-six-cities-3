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
