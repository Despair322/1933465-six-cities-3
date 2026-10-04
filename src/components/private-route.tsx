import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../constants/app';
import type { PrivateRouteProps } from '../types/components';
import { useAppSelector } from '../hooks';
import { selectAuthorizationStatus } from '../store/slices/user';

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { children, isAuthorizationRequired } = props;
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  if(isAuthorizationRequired && authorizationStatus === AuthorizationStatus.NoAuth) {
    return <Navigate to={AppRoute.Login} />;
  }
  if(!isAuthorizationRequired && authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }
  return children;
}

export default PrivateRoute;
