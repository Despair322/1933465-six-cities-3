import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header';
import { AppRoute, PageClassesMap } from '../../constants';
import { getRouteKey } from '../../utils';
import Footer from '../footer';
import { ToastContainer } from 'react-toastify';
import Spinner from '../spinner';
import { selectFavoritesCount } from '../../store/slices/favorites';
import { useAppSelector } from '../../hooks';

function Layout(): JSX.Element {
  const location = useLocation();
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const currentPath = location.pathname;
  const hasFooter = currentPath === AppRoute.Favorites;
  const hasHeaderNavigation = currentPath !== AppRoute.Login;
  const routeKey = getRouteKey(currentPath);
  const rawClass = PageClassesMap[routeKey];
  let pageModifiers = '';
  if (currentPath === AppRoute.Favorites && favoritesCount === 0) {
    pageModifiers = typeof rawClass === 'string' ? rawClass : '';
  } else if (currentPath !== AppRoute.Favorites && rawClass) {
    pageModifiers = typeof rawClass === 'string' ? rawClass : rawClass.join(' ');
  }

  const fullClassName = ['page', pageModifiers].filter(Boolean).join(' ');
  return (
    <div className={fullClassName}>
      <ToastContainer />
      <Header hasNavigation={hasHeaderNavigation} />
      <Suspense fallback={
        <main
          className="page__main"
          aria-busy="true"
          style={{
            display: 'flex',
            minHeight: '400px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </main>
      }
      >
        <Outlet />
      </Suspense>
      {hasFooter && <Footer />}
    </div>
  );
}

export default Layout;
