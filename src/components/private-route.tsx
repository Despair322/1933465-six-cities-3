import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../constants/app';
import { getAuthorizationStatus } from '../utils/common';
import type { PrivateRouteProps } from '../types/components';

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const { children, isAuthorizationRequired } = props;
  const authorizationStatus = getAuthorizationStatus();
  if(isAuthorizationRequired && authorizationStatus !== AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Login} />;
  }
  if(!isAuthorizationRequired && authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }
  return children;
}

export default PrivateRoute;
