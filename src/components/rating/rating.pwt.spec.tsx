import { test, expect } from '@playwright/experimental-ct-react';
import Rating from './rating';
import { RatingVariants } from '../../constants';

test.describe('Rating', () => {
  test('renders card rating as a percentage of five stars', async ({ mount }) => {
    const component = await mount(<Rating rating={4.2} variant={RatingVariants.Card} />);

    await expect(component).toHaveClass(/place-card__rating/);

    await expect(component.locator('.place-card__stars span').first()).toHaveAttribute('style', 'width: 80%;');

    await expect(component.getByText('Rating')).toBeVisible();
    await expect(component.getByText('4.2')).not.toBeVisible();
  });

  test('renders offer rating and its numeric value', async ({ mount }) => {
    const component = await mount(<Rating rating={3.6} variant={RatingVariants.Offer} />);

    await expect(component).toHaveClass(/offer__rating/);
    await expect(component.locator('.offer__stars span').first()).toHaveAttribute('style', 'width: 80%;');

    const ratingValue = component.getByText('3.6');
    await expect(ratingValue).toBeVisible();
    await expect(ratingValue).toHaveClass(/offer__rating-value/);
    await expect(ratingValue).toHaveClass(/rating__value/);

    await expect(component.getByText('Rating')).toBeVisible();
  });
});
