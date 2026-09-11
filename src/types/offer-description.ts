import type { City, OfferLocation } from './offer';

type Host = {
  isPro: boolean;
  name: string;
  avatarUrl: string;
};

export type OfferDescription = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  images: string[];
  city: City;
  location: OfferLocation;
  goods: string[];
  host: Host;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  bedrooms: number;
  maxAdults: number;
};
