import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: JSX.Element;
  isNavigate: boolean;
  navigateTo: string;
};

function ProtectedRoute(props: ProtectedRouteProps): JSX.Element {
  const { children, isNavigate, navigateTo } = props;

  if (isNavigate) {
    return <Navigate to={navigateTo} replace />;
  }
  return children;
}

export default ProtectedRoute;
