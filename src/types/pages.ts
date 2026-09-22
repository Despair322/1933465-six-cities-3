import type { Offer } from './offer';

export type AppProps = {
  offers: Offer[];
  favorites: Offer[];
};

export type FavoritesProps = {
  favorites: Offer[];
};

export type MainProps = {
  offers: Offer[];
};
