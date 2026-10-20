import type { DetailedOffer } from '../../types/detailed-offer';
import type { Offer } from '../../types/offer';

export const makeFakeDetailedOffer = (overrides?: Partial<DetailedOffer>): DetailedOffer => ({
  id: 'offer-1',
  title: 'Nice apartment',
  description: 'A quiet cozy place in the center of the city.',
  type: 'apartment',
  price: 120,
  images: ['img/apartment-01.jpg'],
  goods: ['Wi-Fi', 'Heating', 'Kitchen'],
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  bedrooms: 2,
  maxAdults: 4,
  host: {
    name: 'Angelina',
    avatarUrl: 'img/avatar-angelina.jpg',
    isPro: true
  },
  city: {
    name: 'Paris',
    location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 }
  },
  location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
  ...overrides,
});

export const makeFakeOffer = (overrides?: Partial<Offer>): Offer => ({
  id: 'offer-1',
  title: 'Nice apartment',
  type: 'apartment',
  price: 120,
  previewImage: 'img/apartment-01.jpg',
  city: {
    name: 'Paris',
    location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 }
  },
  location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  ...overrides,
});
