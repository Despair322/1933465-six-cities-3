import { RequestStatus } from '../../constants';
import type { DetailedOffer, Offer, Review } from '../../types';
import { favoriteStatusChanged } from '../events/favorite';
import {
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
} from '../thunks/detailed-offer';
import detailedOfferReducer, {
  loadDetailedOffer,
  loadNearbyOffers,
  loadReviews,
  selectDetailedOffer,
  selectDetailedOfferId,
  selectDetailedOfferLoadingStatus,
  selectNearbyOffers,
  selectNearbyOffersLoadingStatus,
  selectReviews,
  selectReviewsCount,
  selectReviewsLoadingStatus,
  selectTopTenRecentReviews,
} from './detailed-offer';

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

const makeDetailedOffer = (id: string, isFavorite = false): DetailedOffer => ({
  ...makeOffer(id, isFavorite),
  description: 'A comfortable place to stay.',
  images: ['image.jpg'],
  goods: ['Heating'],
  host: { isPro: true, name: 'Host', avatarUrl: 'avatar.jpg' },
  bedrooms: 1,
  maxAdults: 2,
});

const makeReview = (index: number): Review => ({
  id: `review-${index}`,
  comment: `Review ${index}`,
  date: new Date(Date.UTC(2024, 0, index + 1)).toISOString(),
  rating: 4,
  user: { name: `User ${index}`, avatarUrl: 'avatar.jpg', isPro: false },
});

describe('detailedOffer reducer', () => {
  it('returns the initial state', () => {
    expect(detailedOfferReducer(undefined, { type: 'unknown' })).toEqual({
      detailedOffer: null,
      nearbyOffers: [],
      reviews: [],
      loadingStatus: {
        detailedOffer: RequestStatus.Idle,
        nearbyOffers: RequestStatus.Idle,
        reviews: RequestStatus.Idle,
      },
    });
  });

  it('loads detailed offer, nearby offers and reviews', () => {
    const detailedOffer = makeDetailedOffer('offer-1');
    const nearbyOffers = [makeOffer('offer-2')];
    const reviews = [makeReview(0)];
    const state = detailedOfferReducer(
      detailedOfferReducer(
        detailedOfferReducer(undefined, loadDetailedOffer(detailedOffer)),
        loadNearbyOffers(nearbyOffers)
      ),
      loadReviews(reviews)
    );

    expect(state).toMatchObject({ detailedOffer, nearbyOffers, reviews });
  });

  it('updates request status for each fetch lifecycle', () => {
    const stateLoadingOffer = detailedOfferReducer(
      undefined,
      fetchOfferAction.pending('offer-request', 'offer-1')
    );
    const stateLoadingNearby = detailedOfferReducer(
      stateLoadingOffer,
      fetchNearbyOffersAction.pending('nearby-request', 'offer-1')
    );
    const stateLoadingReviews = detailedOfferReducer(
      stateLoadingNearby,
      fetchReviewsAction.pending('reviews-request', 'offer-1')
    );
    const stateSucceeded = detailedOfferReducer(
      detailedOfferReducer(
        detailedOfferReducer(
          stateLoadingReviews,
          fetchOfferAction.fulfilled(undefined, 'offer-request', 'offer-1')
        ),
        fetchNearbyOffersAction.fulfilled(undefined, 'nearby-request', 'offer-1')
      ),
      fetchReviewsAction.fulfilled(undefined, 'reviews-request', 'offer-1')
    );
    const stateFailed = detailedOfferReducer(
      detailedOfferReducer(
        detailedOfferReducer(
          stateSucceeded,
          fetchOfferAction.rejected(new Error('Request failed'), 'offer-request', 'offer-1')
        ),
        fetchNearbyOffersAction.rejected(new Error('Request failed'), 'nearby-request', 'offer-1')
      ),
      fetchReviewsAction.rejected(new Error('Request failed'), 'reviews-request', 'offer-1')
    );

    expect(stateLoadingReviews.loadingStatus).toEqual({
      detailedOffer: RequestStatus.Loading,
      nearbyOffers: RequestStatus.Loading,
      reviews: RequestStatus.Loading,
    });
    expect(stateSucceeded.loadingStatus).toEqual({
      detailedOffer: RequestStatus.Succeeded,
      nearbyOffers: RequestStatus.Succeeded,
      reviews: RequestStatus.Succeeded,
    });
    expect(stateFailed.loadingStatus).toEqual({
      detailedOffer: RequestStatus.Failed,
      nearbyOffers: RequestStatus.Failed,
      reviews: RequestStatus.Failed,
    });
  });

  it('updates favorite status on the detailed offer or matching nearby offer', () => {
    const state = detailedOfferReducer(
      detailedOfferReducer(
        detailedOfferReducer(
          undefined,
          loadDetailedOffer(makeDetailedOffer('offer-1'))
        ),
        loadNearbyOffers([makeOffer('offer-2'), makeOffer('offer-3')])
      ),
      favoriteStatusChanged({ id: 'offer-1', isFavorite: true })
    );
    const nearbyUpdatedState = detailedOfferReducer(
      state,
      favoriteStatusChanged({ id: 'offer-2', isFavorite: true })
    );

    expect(state.detailedOffer?.isFavorite).toBe(true);
    expect(nearbyUpdatedState.nearbyOffers.map(({ isFavorite }) => isFavorite)).toEqual([true, false]);
    expect(detailedOfferReducer(
      nearbyUpdatedState,
      favoriteStatusChanged({ id: 'missing', isFavorite: true })
    )).toEqual(nearbyUpdatedState);
  });
});

describe('detailedOffer selectors', () => {
  it('selects the offer, nearby offers, reviews and loading statuses', () => {
    const state = detailedOfferReducer(
      detailedOfferReducer(
        detailedOfferReducer(undefined, loadDetailedOffer(makeDetailedOffer('offer-1'))),
        loadNearbyOffers([makeOffer('offer-2')])
      ),
      loadReviews([makeReview(0), makeReview(1)])
    );
    const rootState = { detailedOffer: state };

    expect(selectDetailedOffer(rootState)).toEqual(state.detailedOffer);
    expect(selectDetailedOfferId(rootState)).toBe('offer-1');
    expect(selectNearbyOffers(rootState)).toEqual(state.nearbyOffers);
    expect(selectReviews(rootState)).toEqual(state.reviews);
    expect(selectReviewsCount(rootState)).toBe(2);
    expect(selectDetailedOfferLoadingStatus(rootState)).toBe(RequestStatus.Idle);
    expect(selectNearbyOffersLoadingStatus(rootState)).toBe(RequestStatus.Idle);
    expect(selectReviewsLoadingStatus(rootState)).toBe(RequestStatus.Idle);
  });

  it('selects the ten most recent reviews without changing the source array', () => {
    const reviews = Array.from({ length: 12 }, (_, index) => makeReview(index));
    const sourceOrder = reviews.map(({ id }) => id);
    const rootState = {
      detailedOffer: detailedOfferReducer(undefined, loadReviews(reviews)),
    };

    expect(selectTopTenRecentReviews(rootState).map(({ id }) => id)).toEqual([
      'review-11',
      'review-10',
      'review-9',
      'review-8',
      'review-7',
      'review-6',
      'review-5',
      'review-4',
      'review-3',
      'review-2',
    ]);
    expect(reviews.map(({ id }) => id)).toEqual(sourceOrder);
  });

  it('returns no detailed offer id when there is no loaded offer', () => {
    expect(selectDetailedOfferId({
      detailedOffer: detailedOfferReducer(undefined, { type: 'unknown' }),
    })).toBeUndefined();
  });
});
