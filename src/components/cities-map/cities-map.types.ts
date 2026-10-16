import type { Offer } from '../../types/offer';
import { MapVariants } from '../../constants';
import type { Point } from '../../types/types';

export type MapVariant = (typeof MapVariants)[keyof typeof MapVariants];

export type MapProps = {
  city: Offer['city'];
  points: Point[];
  selectedPoint: string | null;
  variant?: MapVariant;
};
