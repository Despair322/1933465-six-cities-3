import { Helmet } from 'react-helmet-async';
import { Fragment, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import PlacesList from './components/places-list';
import LocationsList from './components/locations-list';
import CitiesMap from '../../components/shared/lazy-cities-map';
import SortForm from './components/sort-form';
import { MapVariants, RequestStatus } from '../../constants/app';
import { mapToPoint } from '../../utils/common';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { CityName } from '../../types/types';
import { sortOffers } from '../../utils/sort-offers';
import Spinner from '../../components/shared/spinner/spinner';
import { selectActiveCity, selectOffers, selectOffersLoadingStatus, selectSortType, setActiveCity } from '../../store/slices/catalog';
import { fetchOffersAction } from '../../store/thunks/catalog';

function Main(): JSX.Element {
  const offers = useAppSelector(selectOffers);
  const offersStatus = useAppSelector(selectOffersLoadingStatus);
  const activeCity = useAppSelector(selectActiveCity);
  const activeSortType = useAppSelector(selectSortType);
  const dispatch = useAppDispatch();

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const placesRef = useRef<HTMLElement | null>(null);
  const previousCityRef = useRef(activeCity);

  const cityOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === activeCity),
    [offers, activeCity]
  );

  const sortedOffers = useMemo(
    () => sortOffers(cityOffers, activeSortType),
    [cityOffers, activeSortType]
  );

  const sortedPoints = useMemo(
    () => mapToPoint(sortedOffers),
    [sortedOffers]
  );

  function handleOfferHover(id: string | null) {
    setActiveOfferId(id);
  }

  useEffect(() => {
    if (previousCityRef.current !== activeCity) {
      placesRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      previousCityRef.current = activeCity;
    }
  }, [activeCity]);

  useEffect(() => {
    dispatch(fetchOffersAction());
  }, [dispatch]);

  return (
    <Fragment>
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <LocationsList activeCity={activeCity} onClick={(city: CityName) => dispatch(setActiveCity(city))} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section ref={placesRef} className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              {(offersStatus === RequestStatus.Idle || offersStatus === RequestStatus.Loading) && <Spinner label="Loading offers" />}
              {offersStatus === RequestStatus.Failed && <p>Unable to load offers.</p>}
              {offersStatus === RequestStatus.Succeeded && (
                <>
                  <b className="places__found">{cityOffers.length ? cityOffers.length : 'No'} places to stay in {activeCity}</b>
                  {cityOffers.length > 0 && <SortForm />}
                  {cityOffers.length > 0 && <PlacesList offers={sortedOffers} onHover={handleOfferHover} />}
                </>
              )}
            </section>
            <div className="cities__right-section">
              {cityOffers.length > 0 ? (
                <Suspense fallback={<section className="cities__map map" />}>
                  <CitiesMap
                    city={cityOffers[0].city}
                    points={sortedPoints}
                    selectedPoint={activeOfferId}
                    variant={MapVariants.Main}
                  />
                </Suspense>
              ) : (
                <section className="cities__map map" />
              )}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Main;
