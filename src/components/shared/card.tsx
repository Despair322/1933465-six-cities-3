import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AppRoute, CardVariants, RatingVariants } from '../../constants/app';
import type { CardVariant } from '../../types/types';
import type { Offer } from '../../types/offer';
import Rating from './rating';

type CardProps = {
  offer: Offer;
  onHover?: (offerId: Offer | null) => void;
  variant?: CardVariant;
};

function Card({ offer, onHover, variant = CardVariants.Main }: CardProps): JSX.Element {
  const { id, isPremium, previewImage, price, isFavorite, rating, title, type } = offer;
  const offerPath = AppRoute.OfferById(id);

  const isMain = variant === CardVariants.Main;
  const isNear = variant === CardVariants.Near;
  const isFavorites = variant === CardVariants.Favorites;
  const imageWidth = isFavorites ? 150 : 260;
  const imageHeight = isFavorites ? 110 : 200;

  return (
    <article
      className={classNames(
        { 'cities__card': isMain },
        { 'favorites__card': isFavorites },
        { 'near-places__card': isNear },
        'place-card')}
      onMouseEnter={onHover ? () => onHover(offer) : undefined}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={classNames(
        { 'cities__image-wrapper': isMain },
        { 'favorites__image-wrapper': isFavorites },
        { 'near-places__image-wrapper': isNear },
        'place-card__image-wrapper')}
      >
        <Link to={offerPath}>
          <img className="place-card__image" src={previewImage} width={imageWidth} height={imageHeight} alt="Place image" />
        </Link>
      </div>
      <div className={classNames(
        { 'favorites__card-info': isFavorites },
        'place-card__info')}
      >
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={classNames('place-card__bookmark-button button', {
              'place-card__bookmark-button--active': isFavorite,
            })}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <Rating rating={rating} variant={RatingVariants.Card} />
        <h2 className="place-card__name">
          <Link to={offerPath}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article >
  );
}

export default Card;
