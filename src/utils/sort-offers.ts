import type { SortType, Offer } from '../types';

export function sortOffers(offers: Offer[], sortType: SortType): Offer[] {
  return [...offers].sort((firstOffer, secondOffer) => {
    switch (sortType) {
      case 'price':
        return firstOffer.price - secondOffer.price;
      case 'price-high-to-low':
        return secondOffer.price - firstOffer.price;
      case 'top-rated':
        return secondOffer.rating - firstOffer.rating;
      case 'popular':
      default:
        return 0;
    }
  });
}
