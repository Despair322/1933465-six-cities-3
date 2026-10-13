import { RatingVariants } from '../../constants/app';

export type RatingVariant = (typeof RatingVariants)[keyof typeof RatingVariants];

export type RatingProps = {
  rating: number;
  variant: RatingVariant;
};
