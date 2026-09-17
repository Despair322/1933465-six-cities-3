import { Helmet } from 'react-helmet-async';
import { Fragment } from 'react';
import type { Offer } from '../../types/offer';
import { offerDescription } from '../../mocks/full-offer';
import { offers } from '../../mocks/offers';
import { reviews } from '../../mocks/reviews';
import Image from './components/image';
import classNames from 'classnames';
import Rating from '../../components/shared/rating';
import { CardVariants, MapVariants, RatingVariants } from '../../constants/app';
import Features from './components/featiures';
import Reviews from './components/reviews';
import Card from '../../components/shared/card';
import CitiesMap from '../../components/shared/cities-map';
import { mapToPoint } from '../../utils/common';

function Offer(): JSX.Element {
  const { title, description, type, price, images, goods, host, isFavorite, isPremium, rating, bedrooms, maxAdults, city, id } = offerDescription;
  const nearOffers = offers.slice(5, 8);
  const activePoint = mapToPoint(offerDescription);
  const nearPoints = mapToPoint(nearOffers);
  const allPoints = [...nearPoints, activePoint];

  return (
    <Fragment>

      <Helmet>
        <title>Offer</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images && images.length > 0
                && images.map((image) => <Image key={image} src={image} />)}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {title}
                </h1>
                <button className={classNames('offer__bookmark-button', 'button', { 'offer__bookmark-button--active': isFavorite })} type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <Rating rating={rating} variant={RatingVariants.Offer} />
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              {goods && goods.length > 0 && <Features goods={goods} />}
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="offer__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {host.name}
                  </span>
                  {host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {description}
                  </p>
                </div>
              </div>
              <Reviews reviews={reviews} />
            </div>
          </div>
          <CitiesMap city={city} points={allPoints} variant={MapVariants.Offer} selectedPoint={id} />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {nearOffers && nearOffers.map((offer) =>
                <Card key={offer.id} offer={offer} variant={CardVariants.Near} />)}
            </div>
          </section>
        </div>
      </main>
    </Fragment>
  );
}

export default Offer;
