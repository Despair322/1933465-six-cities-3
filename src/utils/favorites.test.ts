import type { Offer } from '../types/offer';
import type { CityName } from '../types/types';
import { CITY_NAMES } from '../constants';
import { groupFavoritesByCity } from './favorites';

const createMockOffer = (city: CityName, id: string) : Offer => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 100,
  previewImage: 'image.jpg',
  city: {
    name: city,
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  isFavorite: true,
  isPremium: false,
  rating: 4,
});

const mockOffers = [
  createMockOffer('Paris', '1'),
  createMockOffer('Amsterdam', '2'),
  createMockOffer('Cologne', '3'),
  createMockOffer('Paris', '4'),
];

describe('Function groupFavoritesByCity', () => {
  it('Should group offers by city', () => {
    const result = groupFavoritesByCity(mockOffers);
    expect(result.map((group) => group.city)).toEqual(CITY_NAMES);
  });

  it('Should sort offers by city', () => {
    const result = groupFavoritesByCity(mockOffers);
    expect(result[0].offers.map((o) => o.id)).toEqual(['1', '4']);
  });
});
