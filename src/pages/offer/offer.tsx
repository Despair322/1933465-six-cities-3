import { Helmet } from 'react-helmet-async';
import { Fragment, Suspense, useEffect, useMemo, useRef } from 'react';
import Image from './components/image';
import Rating from '../../components/rating';
import Goods from './components/goods';
import Reviews from './components/reviews';
import Card from '../../components/card';
import CitiesMap from '../../components/cities-map';
import Spinner from '../../components/spinner';
import FavoriteButton from '../../components/favorite-button';
import OfferHost from './components/offer-host';
import { AppRoute, CardVariants, FavoriteButtonVariants, MapVariants, RatingVariants, RequestStatus } from '../../constants';
import { mapToPoint } from '../../utils/common';
import { Navigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectDetailedOffer, selectDetailedOfferLoadingStatus, selectNearbyOffers, selectNearbyOffersLoadingStatus, selectReviewsCount, selectTopTenRecentReviews } from '../../store/slices/detailedOffer';
import { fetchNearbyOffersAction, fetchOfferAction, fetchReviewsAction } from '../../store/thunks/detailedOffer';

const MAX_NEARBY_OFFERS = 3;
const MAX_IMAGES = 6;

function Offer(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const offerDescription = useAppSelector(selectDetailedOffer);
  const offerStatus = useAppSelector(selectDetailedOfferLoadingStatus);
  const allNearbyOffers = useAppSelector(selectNearbyOffers);
  const nearbyOffers = useMemo(() => allNearbyOffers.slice(0, MAX_NEARBY_OFFERS), [allNearbyOffers]);
  const nearbyOffersLoadingStatus = useAppSelector(selectNearbyOffersLoadingStatus);
  const reviews = useAppSelector(selectTopTenRecentReviews);
  const reviewsCount = useAppSelector(selectReviewsCount);
  const offerRef = useRef<HTMLElement | null>(null);

  const images = useMemo(() =>
    offerDescription?.images ?? [], [offerDescription?.images]
  );
  const slicedImages = useMemo(() =>
    images.slice(0, MAX_IMAGES), [images]
  );

  const activePoint = useMemo(() => {
    if (!offerDescription) {
      return null;
    }
    return mapToPoint(offerDescription);
  }, [offerDescription]);

  const nearPoints = useMemo(() =>
    Array.isArray(nearbyOffers) ? nearbyOffers.map(mapToPoint) : [], [nearbyOffers]);

  const allPoints = useMemo(
    () => activePoint ? [...nearPoints, activePoint] : nearPoints,
    [nearPoints, activePoint]
  );

  useEffect(() => {
    if (id) {
      let isActive = true;
      const loadOfferData = async () => {
        const result = await dispatch(fetchOfferAction(id));

        if (isActive && fetchOfferAction.fulfilled.match(result)) {
          dispatch(fetchReviewsAction(id));
          dispatch(fetchNearbyOffersAction(id));
        }
      };

      void loadOfferData();

      offerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return () => {
        isActive = false;
      };
    }
    offerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [dispatch, id]);

  if (offerStatus === RequestStatus.Failed) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (offerStatus === RequestStatus.Idle || !offerDescription) {
    return <Spinner label="Loading offer" />;
  }

  const isBackgroundLoading = offerDescription.id !== id || offerStatus === RequestStatus.Loading;


  const { title, description, type, price, goods, host, isFavorite, isPremium, rating, bedrooms, maxAdults, city } = offerDescription;

  return (
    <Fragment>

      <Helmet>
        <title>Offer</title>
      </Helmet>

      <main className="page__main page__main--offer"
        style={{
          opacity: isBackgroundLoading ? 0.5 : 1,
          transition: 'opacity 0.2s ease-in-out',
          pointerEvents: isBackgroundLoading ? 'none' : 'auto'
        }}
      >
        <section ref={offerRef} className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {slicedImages.length > 0
                && slicedImages.map((image) => <Image key={image} src={image} />)}
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
                <FavoriteButton isFavorite={isFavorite} id={id as string} variant={FavoriteButtonVariants.Offer} />
              </div>
              <Rating rating={rating} variant={RatingVariants.Offer} />
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} {maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              {goods && goods.length > 0 && <Goods goods={goods} />}
              <OfferHost host={host} description={description} />
              <Reviews reviews={reviews} reviewsCount={reviewsCount} />
            </div>
          </div>
          <Suspense fallback={<section className="offer__map map" />}>
            <CitiesMap city={city} points={allPoints} variant={MapVariants.Offer} selectedPoint={offerDescription.id === id ? id : null} />
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
