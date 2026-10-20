import { AppRoute } from '../constants';
import { getRouteKey } from './route';

describe('getRouteKey', () => {
  it.each([
    ['/', AppRoute.Main],
    ['/login', AppRoute.Login],
    ['/favorites', AppRoute.Favorites],
    ['/404', AppRoute.NotFound],
  ])('returns the route key for the exact path %s', (pathname, expectedRoute) => {
    expect(getRouteKey(pathname)).toBe(expectedRoute);
  });

  it('returns the offer route pattern for an offer URL', () => {
    expect(getRouteKey('/offer/offer-123')).toBe(AppRoute.Offer);
  });

  it('returns the fallback key for an unknown path', () => {
    expect(getRouteKey('/unknown')).toBe('*');
  });
});
