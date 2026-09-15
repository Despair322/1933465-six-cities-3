import type { Review } from '../../../types/review';
import ReviewComponent from './review';

type ReviewsListProps = {
  reviews: Review[];
};

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => <ReviewComponent key={review.id} review={review} />)}
    </ul>
  );
}

export default ReviewsList;
