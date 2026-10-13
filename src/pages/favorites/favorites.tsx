import { Helmet } from 'react-helmet-async';
import { Fragment, useEffect, useState } from 'react';
import Card from '../../components/card';
import { groupFavoritesByCity } from '../../utils/favorites';
import { CardVariants, RequestStatus } from '../../constants/app';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Spinner from '../../components/spinner/spinner';
import { selectFavoritesLoadingStatus, selectOldFavorites, setOldFavorites } from '../../store/slices/favorites';
import { fetchFavoritesAction } from '../../store/thunks/favorites';
import LocationItem from './components/location-item';

function Favorites(): JSX.Element {
  const favoritesStatus = useAppSelector(selectFavoritesLoadingStatus);
  const oldFavorites = useAppSelector(selectOldFavorites);
  const dispatch = useAppDispatch();

  const [initialLoading, setInitialLoading] = useState(true);

  const groupedFavorites = groupFavoritesByCity(oldFavorites);
  const isEmpty = oldFavorites.length === 0;

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

  if (favoritesStatus === RequestStatus.Failed) {
    return <p>Unable to load favorites.</p>;
  }
  return (
    <Fragment>
      <Helmet>
        <title>Favorites</title>
      </Helmet>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          {isEmpty ? (
            <section className='favorites favorites--empty'>
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            </section>
          ) : (
            <section className='favorites'>
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {groupedFavorites.map(({ city, offers }) => (
                  city && offers && offers.length > 0 && (
                    <li className="favorites__locations-items" key={city}>
                      <LocationItem city={city} />
                      <div className="favorites__places">
                        {offers.map((offer) => (
                          <Card key={offer.id} offer={offer} variant={CardVariants.Favorites} />
                        ))}
                      </div>
                    </li>
                  )))}
              </ul>
            </section>
          )}
        </div>
      </main >
    </Fragment >
  );
}

export default Favorites;
