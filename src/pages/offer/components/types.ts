import { Host } from '../../../types/detailed-offer';
import { Review } from '../../../types/review';

export type StarProps = {
  rating: number;
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type ReviewsListProps = {
  reviews: Review[];
};

export type ReviewProps = {
  review: Review;
};

export type ImageProps = {
  src: string;
};

export type FormProps = {
  id: string;
};


export type HostProps = {
  host: Host;
  description: string;
}

export type GoodsProps = {
  goods: string[];
}
