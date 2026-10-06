import type { Offer } from './offer';
import type { CityName, CardVariant, MapVariant, Point, RatingVariant, FavoriteButtonVariant } from './types';
import type { Review } from './review';
import { Host } from './detailed-offer';

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

export type GoodsProps = {
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

export type FormProps = {
  id: string;
};

export type FavoriteButtonProps = {
  isFavorite: boolean;
  id: string;
  variant?: FavoriteButtonVariant;
};

export type LocationItemProps = {
  city: CityName;
};

export type HostProps = {
  host: Host;
  description: string;
}
