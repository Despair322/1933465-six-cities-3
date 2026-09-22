import classNames from 'classnames';
import type { RatingProps } from '../../types/components';
import { RatingVariants } from '../../constants/app';
import { transformRatingToPercent } from '../../utils/common';

function Rating({ rating, variant }: RatingProps): JSX.Element {
  const isCard = variant === RatingVariants.Card;
  const isOffer = variant === RatingVariants.Offer;
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
        <span style={{ width: `${transformRatingToPercent(rating)}%` }}></span>
        <span className="visually-hidden">Rating</span>
      </div>
    </div>
  );
}

export default Rating;
