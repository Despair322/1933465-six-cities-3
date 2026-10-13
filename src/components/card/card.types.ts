import { CardVariants } from '../../constants/app';
import type { Offer } from '../../types/offer';

export type CardVariant = (typeof CardVariants)[keyof typeof CardVariants];

export type CardProps = {
  offer: Offer;
  onHover?: (offerId: string | null) => void;
  variant?: CardVariant;
};
