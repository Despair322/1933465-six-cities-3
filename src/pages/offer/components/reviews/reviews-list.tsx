import ReviewComponent from './review';
import type { ReviewsListProps } from './reviews-list.types';

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => <ReviewComponent key={review.id} review={review} />)}
    </ul>
  );
}

export default ReviewsList;
