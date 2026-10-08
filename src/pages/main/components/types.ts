import { Offer } from '../../../types/offer';
import { CityName } from '../../../types/types';

export type PlacesListProps = {
  offers: Offer[];
  onHover?: (offerId: string | null) => void;
};

export type LocationProps = {
  city: CityName;
  isActive: boolean;
  onClick: (city: CityName) => void;
};

export type LocationListProps = {
  activeCity: CityName;
  onClick: (city: CityName) => void;
};
