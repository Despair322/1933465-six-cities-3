import { Outlet, useLocation } from 'react-router-dom';
import Header from './shared/header';
import { AppRoute, PageClassesMap } from '../const';
import { getRouteKey } from '../utils/route';
import Footer from './shared/footer';

function Layout(): JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;
  const hasFooter = currentPath === AppRoute.Favorites;
  const hasHeaderNavigation = currentPath !== AppRoute.Login;
  const routeKey = getRouteKey(currentPath);
  const rawClass = PageClassesMap[routeKey];
  let pageModifiers = '';
  if (typeof rawClass === 'string') {
    pageModifiers = rawClass;
  } else if (rawClass) {
    pageModifiers = rawClass.join(' ');
  }

  const fullClassName = ['page', pageModifiers].filter(Boolean).join(' ');
  return (
    <div className={fullClassName}>
      <Header hasNavigation={hasHeaderNavigation} />
      <Outlet />
      {hasFooter && <Footer />}
    </div>
  );
}

export default Layout;
