import { Helmet } from 'react-helmet-async';
import { Fragment } from 'react';
import type { Offer } from '../../types/offer';
import Card from '../../components/shared/card';
import { groupFavoritesByCity } from '../../utils/favorites';
import { AppRoute, CardVariants } from '../../constants/app';
import { Link } from 'react-router-dom';

type FavoritesProps = {
  favorites: Offer[];
};

function Favorites({ favorites }: FavoritesProps): JSX.Element {
  const groupedFavorites = groupFavoritesByCity(favorites);

  return (
    <Fragment>
      <Helmet>
        <title>Favorites</title>
      </Helmet>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {groupedFavorites.map(({ city, offers }) => (
                city && offers && offers.length > 0 && (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to={AppRoute.CityByName(city)}>
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {offers.map((offer) => (
                        <Card key={offer.id} offer={offer} variant={CardVariants.Favorites} />
                      ))}
                    </div>
                  </li>
                )))}
            </ul>
          </section>
        </div>
      </main >
    </Fragment >
  );
}

export default Favorites;
