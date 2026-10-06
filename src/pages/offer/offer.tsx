import { Helmet } from 'react-helmet-async';
import { Fragment, Suspense, useEffect, useRef } from 'react';
import Image from './components/image';
import Rating from '../../components/shared/rating';
import { AppRoute, CardVariants, FavoriteButtonVariants, MapVariants, RatingVariants, RequestStatus } from '../../constants/app';
import Features from './components/featiures';
import Reviews from './components/reviews';
import Card from '../../components/shared/card';
import CitiesMap from '../../components/shared/lazy-cities-map';
import { mapToPoint } from '../../utils/common';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Spinner from '../../components/shared/spinner/spinner';
import { selectDetailedOffer, selectDetailedOfferLoadingStatus, selectNearbyOffers, selectNearbyOffersLoadingStatus, selectReviews } from '../../store/slices/detailedOffer';
import { fetchNearbyOffersAction, fetchOfferAction, fetchReviewsAction } from '../../store/thunks/detailedOffer';

import FavoriteisButton from '../../components/shared/favorite-button';

function Offer(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const offerDescription = useAppSelector(selectDetailedOffer);
  const offerStatus = useAppSelector(selectDetailedOfferLoadingStatus);
  const nearbyOffers = useAppSelector(selectNearbyOffers).slice(0, 3);
  const nearbyOffersLoadingStatus = useAppSelector(selectNearbyOffersLoadingStatus);
  const reviews = useAppSelector(selectReviews);

  const offerRef = useRef<HTMLElement | null>(null);
  const previousOfferRef = useRef(id);

  useEffect(() => {
    if (previousOfferRef.current !== id) {
      offerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      previousOfferRef.current = id;
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [dispatch, id]);

  if (offerStatus === RequestStatus.Failed) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (offerStatus === RequestStatus.Idle || offerStatus === RequestStatus.Loading || !offerDescription) {
    return <Spinner label="Loading offer" />;
  }

  const { title, description, type, price, images, goods, host, isFavorite, isPremium, rating, bedrooms, maxAdults, city } = offerDescription;
  const activePoint = mapToPoint(offerDescription);
  const nearPoints = mapToPoint(nearbyOffers);
  const allPoints = [...nearPoints, activePoint];

  return (
    <Fragment>

      <Helmet>
        <title>Offer</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section ref={offerRef} className="offer">
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
                <FavoriteisButton isFavorite={isFavorite} id={id as string} variant={FavoriteButtonVariants.Offer} />
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
          <Suspense fallback={<section className="offer__map map" />}>
            <CitiesMap city={city} points={allPoints} variant={MapVariants.Offer} selectedPoint={id ?? null} />
          </Suspense>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              {(nearbyOffersLoadingStatus === RequestStatus.Idle || nearbyOffersLoadingStatus === RequestStatus.Loading) && <Spinner label="Loading nearby places" />}
              {nearbyOffersLoadingStatus === RequestStatus.Failed && <p>Unable to load nearby places.</p>}
              {nearbyOffersLoadingStatus === RequestStatus.Succeeded && nearbyOffers.map((offer) =>
                <Card key={offer.id} offer={offer} variant={CardVariants.Near} />)}
            </div>
          </section>
        </div>
      </main>
    </Fragment>
  );
}

export default Offer;
