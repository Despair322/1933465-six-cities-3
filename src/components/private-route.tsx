import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../constants/app';
import type { PrivateRouteProps } from '../types/components';
import { useAppSelector } from '../hooks';

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { children, isAuthorizationRequired } = props;
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  if(isAuthorizationRequired && authorizationStatus !== AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Login} />;
  }
  if(!isAuthorizationRequired && authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }
  return children;
}

export default PrivateRoute;
