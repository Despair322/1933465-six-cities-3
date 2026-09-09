import { CityNames } from '../const';
import type { Offer } from '../types/offer';

export function groupFavoritesByCity(favorites: Offer[]) {
  return CityNames.map((city) => ({
    city,
    offers: favorites.filter((favorite) => favorite.city.name === city),
  }));
}
