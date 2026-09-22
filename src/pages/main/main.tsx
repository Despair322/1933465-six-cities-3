import { Helmet } from 'react-helmet-async';
import { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import type { MainProps } from '../../types/pages';
import PlacesList from './components/places-list';
import LocationsList from './components/locations-list';
import CitiesMap from '../../components/shared/lazy-cities-map';
import SortForm from './components/sort-form';
import { MapVariants } from '../../constants/app';
import { mapToPoint } from '../../utils/common';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { CityName } from '../../types/types';
import { changeCity, resetCity, resetSortType } from '../../store/action';
import { sortOffers } from '../../utils/sort-offers';

function Main({ offers }: MainProps): JSX.Element {
  const activeCity = useAppSelector((state) => state.city);
  const activeSortType = useAppSelector((state) => state.sortType);
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    dispatch(resetSortType());
    dispatch(resetCity());
  }, [dispatch]);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  function handleOfferHover(id: string | null) {
    setActiveOfferId(id);
  }

  return (
    <Fragment>
      <Helmet>
        <title>6 Cities</title>
      </Helmet>
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <LocationsList activeCity={activeCity} onClick={(city: CityName) => dispatch(changeCity(city))} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length ? cityOffers.length : 'No'} places to stay in {activeCity}</b>

              {cityOffers.length > 0 && <SortForm />}
              {cityOffers.length > 0 && <PlacesList offers={sortedOffers} onHover={handleOfferHover} />}
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
