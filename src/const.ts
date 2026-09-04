export const Setting = {
  CardsCount: 6,
};

export const AppRoute = {
  Main: '/',
  Login: '/login',
  Offer: '/offer/:id',
  OfferById: (id: string) => `/offer/${id}`,
  Favorites: '/favorites',
};

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
