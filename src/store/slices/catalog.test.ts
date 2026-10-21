import { DEFAULT_CITY, RequestStatus } from '../../constants';
import type { Offer } from '../../types/offer';
import { favoriteStatusChanged } from '../events/favorite';
import { fetchOffersAction } from '../thunks/catalog';
import catalogReducer, {
  selectActiveCity,
  selectOffers,
  selectOffersLoadingStatus,
  selectSortType,
  setActiveCity,
  setSortType,
} from './catalog';

const makeOffer = (id: string, isFavorite = false): Offer => ({
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

describe('catalog reducer', () => {
  it('returns the initial state', () => {
    expect(catalogReducer(undefined, { type: 'unknown' })).toEqual({
      city: DEFAULT_CITY,
      sortType: 'popular',
      offers: [],
      loadingStatus: { offers: RequestStatus.Idle },
    });
  });

  it('changes active city and sort type', () => {
    const state = catalogReducer(undefined, setActiveCity('Amsterdam'));
    const updatedState = catalogReducer(state, setSortType('price-high-to-low'));

    expect(updatedState.city).toBe('Amsterdam');
    expect(updatedState.sortType).toBe('price-high-to-low');
  });

  it('updates offers and loading status for fetch lifecycle actions', () => {
    const offers = [makeOffer('offer-1')];
    const loadingState = catalogReducer(undefined, fetchOffersAction.pending('request-1', undefined));
    const succeededState = catalogReducer(
      loadingState,
      fetchOffersAction.fulfilled(offers, 'request-1', undefined)
    );
    const failedState = catalogReducer(
      succeededState,
      fetchOffersAction.rejected(new Error('Request failed'), 'request-2', undefined)
    );

    expect(loadingState.loadingStatus.offers).toBe(RequestStatus.Loading);
    expect(succeededState).toMatchObject({
      offers,
      loadingStatus: { offers: RequestStatus.Succeeded },
    });
    expect(failedState.loadingStatus.offers).toBe(RequestStatus.Failed);
  });

  it('changes favorite status only for the matching offer', () => {
    const state = catalogReducer(
      catalogReducer(undefined, fetchOffersAction.fulfilled(
        [makeOffer('offer-1'), makeOffer('offer-2')],
        'request-1',
        undefined
      )),
      favoriteStatusChanged({ id: 'offer-2', isFavorite: true })
    );

    expect(state.offers.map(({ isFavorite }) => isFavorite)).toEqual([false, true]);
    expect(catalogReducer(state, favoriteStatusChanged({ id: 'missing', isFavorite: true }))).toEqual(state);
  });
});

describe('catalog selectors', () => {
  it('selects city, sort type, offers and offers loading status', () => {
    const state = catalogReducer(
      catalogReducer(undefined, setActiveCity('Cologne')),
      setSortType('top-rated')
    );
    const rootState = { catalog: state };

    expect(selectActiveCity(rootState)).toBe('Cologne');
    expect(selectSortType(rootState)).toBe('top-rated');
    expect(selectOffers(rootState)).toEqual([]);
    expect(selectOffersLoadingStatus(rootState)).toBe(RequestStatus.Idle);
  });
});
