import { RatingVariants } from '../../constants';

export type RatingVariant = (typeof RatingVariants)[keyof typeof RatingVariants];

export type RatingProps = {
  rating: number;
  variant: RatingVariant;
};
