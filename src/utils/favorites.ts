import { CITY_NAMES } from '../constants';
import type { Offer } from '../types/offer';

export function groupFavoritesByCity(favorites: Offer[]) {
  return CITY_NAMES.map((city) => ({
    city,
    offers: favorites.filter((favorite) => favorite.city.name === city),
  }));
}
