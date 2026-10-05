import { Navigate, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../constants/app';
import type { PrivateRouteProps } from '../types/components';
import type { LoginLocationState } from '../types/pages';
import { useAppSelector } from '../hooks';
import { selectAuthorizationStatus } from '../store/slices/user';

function ProtectedRoute(props: PrivateRouteProps): JSX.Element {
  const { children, isAuthorizationRequired } = props;
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const location = useLocation();
  if (isAuthorizationRequired && authorizationStatus === AuthorizationStatus.NoAuth) {
    return <Navigate to={AppRoute.Login} state={{ from: location }} replace />;
  }
  if (!isAuthorizationRequired && authorizationStatus === AuthorizationStatus.Auth) {
    const locationState = location.state as LoginLocationState | null;
    return <Navigate to={locationState?.from?.pathname || AppRoute.Main} replace />;
  }
  return children;
}

export default ProtectedRoute;
