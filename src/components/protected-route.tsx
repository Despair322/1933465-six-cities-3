import { Navigate } from 'react-router-dom';
import type { ProtectedRouteProps } from './protected-route.types';

function ProtectedRoute(props: ProtectedRouteProps): JSX.Element {
  const { children, isNavigate, navigateTo } = props;

  if (isNavigate) {
    return <Navigate to={navigateTo} replace />;
  }
  return children;
}

export default ProtectedRoute;
