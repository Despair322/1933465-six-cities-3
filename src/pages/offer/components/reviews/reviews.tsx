import Form from './form';
import ReviewsList from './reviews-list';
import Spinner from '../../../../components/spinner';
import type { ReviewsProps } from './reviews.types';
import { useAppSelector } from '../../../../hooks';
import { AuthorizationStatus, RequestStatus } from '../../../../constants/app';
import { selectAuthorizationStatus } from '../../../../store/slices/user';
import { selectReviewsLoadingStatus } from '../../../../store/slices/detailedOffer';
import { memo } from 'react';

function Reviews({ reviews }: ReviewsProps): JSX.Element {
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
              ? <>Reviews &middot; <span className="reviews__amount">{reviews.length}</span></>
              : 'There are no reviews yet'}
          </h2>
          {hasReviews && <ReviewsList reviews={reviews} />}
        </>
      )}
      {isAuth && <Form/>}
    </section>
  );
}

const MemoizedReviews = memo(Reviews);

export default MemoizedReviews;
