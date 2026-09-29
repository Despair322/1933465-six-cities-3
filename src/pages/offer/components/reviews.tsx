import Form from './form';
import ReviewsList from './reviews-list';
import type { ReviewsListProps } from '../../../types/components';
import { useAppSelector } from '../../../hooks';
import { AuthorizationStatus } from '../../../constants/app';
import Spinner from '../../../components/shared/spinner/spinner';

function Reviews({ reviews }: ReviewsListProps): JSX.Element {
  const isAuth = useAppSelector((state) => state.authorizationStatus) === AuthorizationStatus.Auth;
  const commentsStatus = useAppSelector((state) => state.loadingStatus.comments);
  const hasReviews = reviews && reviews.length > 0;
  const isLoading = commentsStatus === 'idle' || commentsStatus === 'loading';
  return (
    <section className="offer__reviews reviews">
      {isLoading && <Spinner label="Loading reviews" />}
      {commentsStatus === 'failed' && <p>Unable to load reviews.</p>}
      {commentsStatus === 'succeeded' && (
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

export default Reviews;
