import { sortOffers } from './sort-offers';
import type { Offer } from '../types';

const mockOffers = [
  { id: '1', title: 'Offer 1', price: 100, rating: 4.5 },
  { id: '2', title: 'Offer 2', price: 50, rating: 5.0 },
  { id: '3', title: 'Offer 3', price: 200, rating: 4.0 },
] as Offer[];

describe('Function sortOffers', () => {
  it('Should sort by price low-to-high', () => {
    const result = sortOffers(mockOffers, 'price');
    expect(result.map((offer) => offer.id)).toEqual(['2', '1', '3']);
  });

  it('Should sort by price high-to-low', () => {
    const result = sortOffers(mockOffers, 'price-high-to-low');
    expect(result.map((offer) => offer.id)).toEqual(['3', '1', '2']);
  });

  it('Should sort by top-rated', () => {
    const result = sortOffers(mockOffers, 'top-rated');
    expect(result.map((offer) => offer.id)).toEqual(['2', '1', '3']);
  });
});
