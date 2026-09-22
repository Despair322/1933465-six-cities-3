import { getAuthorizationStatus } from '../../../utils/common';
import Form from './form';
import ReviewsList from './reviews-list';
import type { ReviewsListProps } from '../../../types/components';

function Reviews({ reviews }: ReviewsListProps): JSX.Element {
  const isAuth = getAuthorizationStatus();
  const hasReviews = reviews && reviews.length > 0;
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        {hasReviews
          ? <>Reviews &middot; <span className="reviews__amount">{reviews.length}</span></>
          : 'There are no reviews yet'}
      </h2>
      {hasReviews && <ReviewsList reviews={reviews} />}
      {isAuth && <Form />}
    </section>
  );
}

export default Reviews;
