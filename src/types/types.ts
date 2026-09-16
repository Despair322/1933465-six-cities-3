import { AppRoute, CardVariants, MapVariants, RatingVariants } from '../constants/app';


export type StringRouteValues = Extract<
  (typeof AppRoute)[keyof typeof AppRoute],
  string
>;

export type StringRouteKeys = StringRouteValues | '*';

export type CardVariant = (typeof CardVariants)[keyof typeof CardVariants];

export type RatingVariant = (typeof RatingVariants)[keyof typeof RatingVariants];

export type MapVariant = (typeof MapVariants)[keyof typeof MapVariants];
