import { Navigate } from 'react-router-dom';
import type { PrivateRouteProps } from '../types/components';

function ProtectedRoute(props: PrivateRouteProps): JSX.Element {
  const { children, isNavigate, navigateTo } = props;

  if(isNavigate){
    return <Navigate to={navigateTo} replace/>;
  }
  return children;
}

export default ProtectedRoute;
