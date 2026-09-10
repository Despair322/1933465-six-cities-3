import { City, Location } from './offer';

type host = {
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
  location: Location;
  goods: string[];
  host: host;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  bedrooms: number;
  maxAdults: number;
};
