import classNames from 'classnames';
import type { RatingProps } from './rating.types';
import { RatingVariants } from '../../constants/app';
import { transformRatingToPercent } from '../../utils/common';
import { memo, useMemo } from 'react';

function Rating({ rating, variant }: RatingProps): JSX.Element {
  const isCard = variant === RatingVariants.Card;
  const isOffer = variant === RatingVariants.Offer;

  const ratingMemo = useMemo(() => transformRatingToPercent(rating), [rating]);

  return (
    <div className={classNames(
      { 'place-card__rating': isCard },
      { 'offer__rating': isOffer },
      'rating',)}
    >
      <div className={classNames(
        { 'place-card__stars': isCard },
        { 'offer__stars': isOffer },
        'rating__stars',)}
      >
        <span style={{ width: `${ratingMemo}%` }}></span>
        <span className="visually-hidden">Rating</span>
      </div>
    </div>
  );
}

const MemoizedRating = memo(Rating);

export default MemoizedRating;
