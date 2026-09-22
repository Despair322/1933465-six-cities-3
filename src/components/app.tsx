import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute } from '../constants/app';
import PrivateRoute from './private-route';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './layout';
const Main = lazy(() => import('../pages/main/main'));
const Favorites = lazy(() => import('../pages/favorites/favorites'));
const OfferPage = lazy(() => import('../pages/offer/offer'));
const NotFound = lazy(() => import('../pages/not-found/not-found'));
const Login = lazy(() => import('../pages/login/login'));

import type { AppProps } from '../types/pages';

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
