import { CardVariants, FavoriteButtonVariants, MapVariants, RatingVariants } from '../../constants/app';
import { Offer } from '../../types/offer';
import { Point } from '../../types/types';

export type CardVariant = (typeof CardVariants)[keyof typeof CardVariants];

export type RatingVariant = (typeof RatingVariants)[keyof typeof RatingVariants];

export type MapVariant = (typeof MapVariants)[keyof typeof MapVariants];

export type FavoriteButtonVariant = typeof FavoriteButtonVariants[keyof typeof FavoriteButtonVariants];


export type CardProps = {
  offer: Offer;
  onHover?: (offerId: string | null) => void;
  variant?: CardVariant;
};

export type MapProps = {
  city: Offer['city'];
  points: Point[];
  selectedPoint: string | null;
  variant?: MapVariant;
};

export type RatingProps = {
  rating: number;
  variant: RatingVariant;
};

export type FavoriteButtonProps = {
  isFavorite: boolean;
  id: string;
  variant?: FavoriteButtonVariant;
};
