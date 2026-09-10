import Main from '../pages/main/main';
import Favorites from '../pages/favorites/favorites';
import OfferPage from '../pages/offer/offer';
import NotFound from '../pages/not-found/not-found';
import Login from '../pages/login/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute } from '../const';
import PrivateRoute from './private-route';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './layout';
import type { Offer } from '../types/offer';

type AppProps = {
  offers: Offer[];
  favorites: Offer[];
};

function App({ offers, favorites }: AppProps): JSX.Element {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path={AppRoute.Main} element={<Layout />}>
            <Route
              index
              element={<Main offers={offers} />}
            />
            <Route
              path={AppRoute.Login}
              element={
                <PrivateRoute>
                  <Login />
                </PrivateRoute>
              }
            />
            <Route
              path={AppRoute.Offer}
              element={<OfferPage />}
            />
            <Route
              path={AppRoute.Favorites}
              element={
                <PrivateRoute isAuthorizationRequired>
                  <Favorites favorites={favorites} />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
