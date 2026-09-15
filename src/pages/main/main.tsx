import { Helmet } from 'react-helmet-async';
import { Fragment, useMemo, useState } from 'react';
import type { Offer } from '../../types/offer';
import { useSearchParams } from 'react-router-dom';
import { CityNames, CityParam, DefaultCity } from '../../constants/cities';
import type { CityName } from '../../constants/cities';
import PlacesList from './components/places-list';
import LocationsList from './components/locations-list';
import CitiesMap from './components/cities-map';
import SortForm from './components/sort-form';

type MainProps = {
  offers: Offer[];
};

function Main({ offers }: MainProps): JSX.Element {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get(CityParam);
  const activeCity: CityName = CityNames.includes(cityParam as CityName)
    ? cityParam as CityName
    : DefaultCity;
  const cityOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === activeCity),
    [offers, activeCity]
  );

  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);

  let mapComponent: JSX.Element;

  if (cityOffers.length === 0) {
    mapComponent = <section className="cities__map map"></section>;
  } else {
    const selectedPoint = cityOffers.find((point) => point.id === activeOffer?.id);
    mapComponent = <CitiesMap city={cityOffers[0].city} points={cityOffers} selectedPoint={selectedPoint} />;
  }

  function handleOfferHover(offer: Offer | null) {
    setActiveOffer(offer);
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
            <LocationsList activeCity={activeCity} />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length ? cityOffers.length : 'No'} places to stay in {activeCity}</b>

              {cityOffers.length > 0 && <SortForm />}
              {cityOffers.length > 0 && <PlacesList offers={cityOffers} onHover={handleOfferHover} />}
            </section>
            <div className="cities__right-section">
              {mapComponent}
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Main;
