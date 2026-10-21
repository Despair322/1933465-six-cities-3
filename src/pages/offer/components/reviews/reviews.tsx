import Form from './form';
import Spinner from '../../../../components/spinner';
import ReviewComponent from './review';
import { useAppSelector } from '../../../../hooks';
import { AuthorizationStatus, RequestStatus } from '../../../../constants';
import { selectAuthorizationStatus } from '../../../../store/slices/user';
import { selectReviewsLoadingStatus } from '../../../../store/slices/detailedOffer';
import { memo } from 'react';
import type { Review } from '../../../../types';

type ReviewsProps = {
  reviews: Review[];
  reviewsCount: number;
};

function Reviews({ reviews, reviewsCount }: ReviewsProps): JSX.Element {
  const isAuth = useAppSelector(selectAuthorizationStatus) === AuthorizationStatus.Auth;
  const reviewsLoadingStatus = useAppSelector(selectReviewsLoadingStatus);
  const hasReviews = reviews && reviews.length > 0;
  const isLoading = reviewsLoadingStatus === RequestStatus.Idle || reviewsLoadingStatus === RequestStatus.Loading;
  return (
    <section className="offer__reviews reviews">
      {isLoading && <Spinner label="Loading reviews" />}
      {reviewsLoadingStatus === RequestStatus.Failed && <p>Unable to load reviews.</p>}
      {reviewsLoadingStatus === RequestStatus.Succeeded && (
        <>
          <h2 className="reviews__title">
            {hasReviews
              ? <>Reviews &middot; <span className="reviews__amount">{reviewsCount}</span></>
              : 'There are no reviews yet'}
          </h2>
          {hasReviews &&
            <ul className="reviews__list">
              {reviews.map((review) => <ReviewComponent key={review.id} review={review} />)}
            </ul>}
        </>
      )}
      {isAuth && <Form />}
    </section>
  );
}

const MemoizedReviews = memo(Reviews);

export default MemoizedReviews;
