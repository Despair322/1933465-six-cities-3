import { CardVariants } from '../../constants';
import type { Offer } from '../../types/offer';

export type CardVariant = (typeof CardVariants)[keyof typeof CardVariants];

export type CardProps = {
  offer: Offer;
  onMouseEnter?: (offerId: string | null) => void;
  onMouseLeave?: () => void;
  variant?: CardVariant;
};
