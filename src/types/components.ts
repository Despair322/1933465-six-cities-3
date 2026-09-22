import type { Offer } from './offer';
import type { CityName, CardVariant, MapVariant, Point, RatingVariant } from './types';
import type { Review } from './review';

export type PrivateRouteProps = {
  children: JSX.Element;
  isAuthorizationRequired?: boolean;
};

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

export type LocationProps = {
  city: CityName;
  isActive: boolean;
  onClick: (city: CityName) => void;
};

export type LocationListProps = {
  activeCity: CityName;
  onClick: (city: CityName) => void;
};

export type PlacesListProps = {
  offers: Offer[];
  onHover?: (offerId: string | null) => void;
};

export type FeatureProps = {
  goods: string[];
};

export type ImageProps = {
  src: string;
};

export type ReviewProps = {
  review: Review;
};

export type ReviewsListProps = {
  reviews: Review[];
};

export type StarProps = {
  rating: number;
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
