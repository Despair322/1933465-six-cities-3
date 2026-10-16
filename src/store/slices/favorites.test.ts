import { RequestStatus } from '../../constants';
import type { Offer } from '../../types/offer';
import { favoriteStatusChanged } from '../events/favorite';
import { fetchFavoritesAction } from '../thunks/favorites';
import favoritesSlice, {
  selectFavorites,
  selectFavoritesCount,
  selectFavoritesLoadingStatus,
  selectOldFavorites,
  setOldFavorites,
} from './favorites';

describe('Favorites Slice', () => {
  const initialState = {
    favorites: [],
    oldFavorites: [],
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

  describe('setOldFavorites', () => {
    it('should replace oldFavorites with the action payload', () => {
      const mockFavorites = [makeOffer('offer-1')];
      const result = favoritesSlice(initialState, setOldFavorites(mockFavorites));

      expect(result.oldFavorites).toEqual(mockFavorites);
    });
  });

  describe('favoriteStatusChanged', () => {
    it('should update favorite status only for the matching old favorite', () => {
      const favorites = [makeOffer('offer-1')];
      const oldFavorites = [makeOffer('offer-1'), makeOffer('offer-2')];
      const state = { ...initialState, favorites, oldFavorites };
      const action = favoriteStatusChanged({ id: 'offer-2', isFavorite: false });
      const result = favoritesSlice(state, action);

      expect(result.oldFavorites.map(({ isFavorite }) => isFavorite)).toEqual([true, false]);
      expect(result.favorites).toEqual(favorites);
      expect(favoritesSlice(result, favoriteStatusChanged({
        id: 'missing',
        isFavorite: false,
      }))).toEqual(result);
    });
  });

  describe('selectors', () => {
    it('should select favorites, old favorites, loading status and favorites count', () => {
      const favorites = [makeOffer('offer-1'), makeOffer('offer-2')];
      const state = favoritesSlice(
        favoritesSlice(initialState, fetchFavoritesAction.fulfilled(favorites, 'request-id', undefined)),
        setOldFavorites([makeOffer('old-offer')])
      );
      const rootState = { favorites: state };

      expect(selectFavorites(rootState)).toEqual(favorites);
      expect(selectOldFavorites(rootState)).toEqual([makeOffer('old-offer')]);
      expect(selectFavoritesLoadingStatus(rootState)).toBe(RequestStatus.Succeeded);
      expect(selectFavoritesCount(rootState)).toBe(2);
    });
  });
});
