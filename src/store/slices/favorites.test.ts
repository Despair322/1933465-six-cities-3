import { RequestStatus } from '../../constants';
import type { Offer } from '../../types/offer';
import { favoriteStatusChanged } from '../events/favorite';
import { fetchFavoritesAction } from '../thunks/favorites';
import favoritesSlice, {
  selectFavorites,
  selectFavoritesCount,
  selectFavoritesLoadingStatus,
} from './favorites';

describe('Favorites Slice', () => {
  const initialState = {
    favorites: [],
    loadingStatus: { favorites: RequestStatus.Idle },
  };

  const makeOffer = (id: string, isFavorite = true): Offer => ({
    id,
    title: `Offer ${id}`,
    type: 'apartment',
    price: 100,
    previewImage: 'image.jpg',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
    isFavorite,
    isPremium: false,
    rating: 4,
  });

  it('should return initial state', () => {
    const emptyAction = { type: '' };

    expect(favoritesSlice(initialState, emptyAction)).toEqual(initialState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };

    expect(favoritesSlice(undefined, emptyAction)).toEqual(initialState);
  });

  describe('fetchFavoritesAction', () => {
    it('should set loading status when fetchFavoritesAction.pending', () => {
      const action = fetchFavoritesAction.pending('request-id', undefined);
      const result = favoritesSlice(initialState, action);

      expect(result.loadingStatus.favorites).toBe(RequestStatus.Loading);
    });

    it('should set favorites and succeeded status when fetchFavoritesAction.fulfilled', () => {
      const mockFavorites = [makeOffer('offer-1'), makeOffer('offer-2')];
      const action = fetchFavoritesAction.fulfilled(mockFavorites, 'request-id', undefined);
      const result = favoritesSlice(initialState, action);

      expect(result.loadingStatus.favorites).toBe(RequestStatus.Succeeded);
      expect(result.favorites).toEqual(mockFavorites);
    });

    it('should set failed status when fetchFavoritesAction.rejected', () => {
      const action = fetchFavoritesAction.rejected(
        new Error('Request failed'),
        'request-id',
        undefined
      );
      const result = favoritesSlice(initialState, action);

      expect(result.loadingStatus.favorites).toBe(RequestStatus.Failed);
    });
  });

  describe('favoriteStatusChanged', () => {
    it('should remove the matching favorite when its status changes to false', () => {
      const favorites = [makeOffer('offer-1'), makeOffer('offer-2')];
      const state = { ...initialState, favorites };
      const action = favoriteStatusChanged({ id: 'offer-2', isFavorite: false });
      const result = favoritesSlice(state, action);

      expect(result.favorites).toEqual([makeOffer('offer-1')]);
    });

    it('should not change favorites when status changes to true or the id is missing', () => {
      const state = { ...initialState, favorites: [makeOffer('offer-1')] };
      const result = favoritesSlice(state, favoriteStatusChanged({
        id: 'offer-1',
        isFavorite: true,
      }));

      expect(result.favorites).toEqual(state.favorites);
      expect(favoritesSlice(result, favoriteStatusChanged({
        id: 'missing',
        isFavorite: false,
      })).favorites).toEqual(result.favorites);
    });
  });

  describe('selectors', () => {
    it('should select favorites, loading status and favorites count', () => {
      const favorites = [makeOffer('offer-1'), makeOffer('offer-2')];
      const state = favoritesSlice(initialState, fetchFavoritesAction.fulfilled(favorites, 'request-id', undefined));
      const rootState = { favorites: state };

      expect(selectFavorites(rootState)).toEqual(favorites);
      expect(selectFavoritesLoadingStatus(rootState)).toBe(RequestStatus.Succeeded);
      expect(selectFavoritesCount(rootState)).toBe(2);
    });
  });
});
