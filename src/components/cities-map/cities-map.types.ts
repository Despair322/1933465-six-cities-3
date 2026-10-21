import type { Offer, Point } from '../../types';
import { MapVariants } from '../../constants';

export type MapVariant = (typeof MapVariants)[keyof typeof MapVariants];

export type MapProps = {
  city: Offer['city'];
  points: Point[];
  selectedPoint: string | null;
  variant?: MapVariant;
};
