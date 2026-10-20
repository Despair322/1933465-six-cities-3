import type { Review } from '../../types/review';

export const makeFakeReview = (overrides: Partial<Review> = {}): Review => ({
  id: 'review-1',
  comment: 'A lovely place.',
  date: '2024-01-01T00:00:00.000Z',
  rating: 5,
  user: { name: 'Reviewer', avatarUrl: 'avatar.jpg', isPro: false },
  ...overrides,
});
