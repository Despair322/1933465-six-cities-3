import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Review } from '../../../../types/review';
import ReviewComponent from './review';

const review: Review = {
  id: 'review-1',
  comment: 'A wonderful place to stay.',
  date: '2024-03-15T00:00:00.000Z',
  rating: 4,
  user: { name: 'Jamie', avatarUrl: 'jamie.jpg', isPro: false },
};

describe('Review', () => {
  it('renders the reviewer, comment, avatar, rating and formatted date', () => {
    const { container } = render(<ReviewComponent review={review} />);

    expect(screen.getByText('Jamie')).toBeInTheDocument();
    expect(screen.getByText('A wonderful place to stay.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Reviews avatar' })).toHaveAttribute('src', 'jamie.jpg');
    expect(container.querySelector('.reviews__stars span')).toHaveStyle({ width: '80%' });
    expect(screen.getByText('March 2024')).toBeInTheDocument();
    expect(screen.getByText('March 2024').closest('time')).toHaveAttribute('dateTime', review.date);
  });
});
