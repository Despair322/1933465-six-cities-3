import { lazy, useEffect } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../constants/app';
import ProtectedRoute from './protected-route';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './layout';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAuthorizationStatus } from '../store/slices/user';
import { fetchFavoritesAction } from '../store/thunks/favorites';
const Main = lazy(() => import('../pages/main/main'));
const Favorites = lazy(() => import('../pages/favorites/favorites'));
const OfferPage = lazy(() => import('../pages/offer/offer'));
const NotFound = lazy(() => import('../pages/not-found/not-found'));
const Login = lazy(() => import('../pages/login/login'));

function App(): JSX.Element {

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const authStatus = useAppSelector(selectAuthorizationStatus);
  const redirectPath = searchParams.get('redirect') || AppRoute.Main;

  useEffect(() => {
    if (authStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoritesAction());
    }
  }, [authStatus, dispatch]);

  return (
    <HelmetProvider>
      <Routes>
        <Route path={AppRoute.Main} element={<Layout />}>
          <Route
            index
            element={<Main />}
          />
          <Route
            path={AppRoute.Login}
            element={
              <ProtectedRoute isNavigate={authStatus === AuthorizationStatus.Auth} navigateTo={redirectPath} >
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path={AppRoute.Offer}
            element={<OfferPage />}
          />
          <Route
            path={AppRoute.Favorites}
            element={
              <ProtectedRoute isNavigate={authStatus === AuthorizationStatus.NoAuth} navigateTo={`${AppRoute.Login}?redirect=${AppRoute.Favorites}`} >
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}

export default App;
