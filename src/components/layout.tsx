import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './shared/header';
import { AppRoute, PageClassesMap } from '../constants/app';
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
          <div style={{ fontSize: '32px', fontWeight: 700 }}>Loading...</div>
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
