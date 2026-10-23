import { test, expect } from '@playwright/experimental-ct-react';
import { makeFakeReview } from '../../../../mocks';
import ReviewComponent from './review';

test('renders reviewer details, comment, rating and formatted date', async ({ mount }) => {
  const review = makeFakeReview({
    comment: 'A wonderful place to stay.',
    date: '2024-03-15T00:00:00.000Z',
    rating: 4,
    user: { name: 'Jamie', avatarUrl: 'jamie.jpg', isPro: false },
  });
  const component = await mount(<ReviewComponent review={review} />);

  await expect(component.getByText('Jamie')).toBeVisible();
  await expect(component.getByText('A wonderful place to stay.')).toBeVisible();
  await expect(component.getByRole('img', { name: 'Reviews avatar' })).toHaveAttribute('src', 'jamie.jpg');
  await expect(component.locator('.reviews__stars span').first()).toHaveCSS('width', '80%');
  const date = component.getByText('March 2024');
  await expect(date).toBeVisible();
  await expect(date).toHaveAttribute('datetime', review.date);
});
