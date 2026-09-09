import { Helmet } from 'react-helmet-async';
import Card from './components/card';
import { Fragment, useState } from 'react';
import type { Offer } from '../../types/offer';
import { useSearchParams } from 'react-router-dom';
import { CityName, CityNames } from '../../const';
import LocationItem from './components/location-item';

type MainProps = {
  offers: Offer[];
};


function Main({ offers }: MainProps): JSX.Element {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city');
  const activeCity: CityName = CityNames.includes(cityParam as CityName)
    ? cityParam as CityName
    : 'Amsterdam';
  const cityOffers = offers.filter((offer) => offer.city.name === activeCity);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  function handleOfferHover(offerId: string | null) {
    setActiveOfferId(offerId);
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
            <ul className="locations__list tabs__list">
              {CityNames.map((city) => (
                <LocationItem key={city} city={city} isActive={city === activeCity} />
              ))}
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{cityOffers.length} places to stay in {activeCity}</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li className="places__option places__option--active" tabIndex={0}>Popular</li>
                  <li className="places__option" tabIndex={0}>Price: low to high</li>
                  <li className="places__option" tabIndex={0}>Price: high to low</li>
                  <li className="places__option" tabIndex={0}>Top rated first</li>
                </ul>
              </form>
              <div className="cities__places-list places__list tabs__content">
                {cityOffers.length > 0 && cityOffers.map((offer) => (
                  <Card key={offer.id} offer={offer} onHover={handleOfferHover} />
                ))}
              </div>
            </section>
            <div className="cities__right-section">
              <section className="cities__map map"></section>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Main;
