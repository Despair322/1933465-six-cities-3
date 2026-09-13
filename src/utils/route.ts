import { AppRoute } from '../constants/app';
import type { StringRouteKeys, StringRouteValues } from '../constants/app';
export function getRouteKey(pathname: string): StringRouteKeys {
  if (pathname.startsWith('/offer/')) {
    return AppRoute.Offer;
  }
  const route = Object.values(AppRoute).find(
    (value): value is StringRouteValues =>
      typeof value === 'string' && value === pathname
  );

  return route ?? '*';
}

