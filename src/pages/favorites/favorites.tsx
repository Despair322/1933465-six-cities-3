import { Helmet } from 'react-helmet-async';
import { Fragment, useEffect, useState } from 'react';
import Card from '../../components/shared/card';
import { groupFavoritesByCity } from '../../utils/favorites';
import { AppRoute, CardVariants } from '../../constants/app';
import { Link } from 'react-router-dom';
import { CityName } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveCity, setOldFavorites } from '../../store/action';
import { fetchFavoritesAction } from '../../store/api-action';
import Spinner from '../../components/shared/spinner/spinner';

function Favorites(): JSX.Element {
  const favoritesStatus = useAppSelector((state) => state.loadingStatus.favorites);
  const oldFavorites = useAppSelector((state) => state.oldFavorites);
  const dispatch = useAppDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    void dispatch(fetchFavoritesAction()).unwrap().then((loadedFavorites) => {
      dispatch(setOldFavorites(loadedFavorites));
      setInitialLoading(false);
    }).catch(() => {
      setInitialLoading(false);
    });
  }, [dispatch]);

  if (initialLoading) {
    return <Spinner label="Loading favorites" />;
  }

  if (favoritesStatus === 'failed') {
    return <p>Unable to load favorites.</p>;
  }

  const groupedFavorites = groupFavoritesByCity(oldFavorites);
  const handleClick = (city: CityName) => {
    dispatch(setActiveCity(city));
  };

  return (
    <Fragment>
      <Helmet>
        <title>Favorites</title>
      </Helmet>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">{oldFavorites.length > 0 ? 'Saved listing' : 'Nothing yet saved.'}</h1>
            <ul className="favorites__list">
              {groupedFavorites.map(({ city, offers }) => (
                city && offers && offers.length > 0 && (
                  <li className="favorites__locations-items" key={city}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to={AppRoute.Main} onClick={() => {
                          handleClick(city);
                        }}
                        >
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
