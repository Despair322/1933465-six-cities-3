import { Offer } from '../../../../types/offer';

export type PlacesListProps = {
  offers: Offer[];
  onHover?: (offerId: string | null) => void;
};
