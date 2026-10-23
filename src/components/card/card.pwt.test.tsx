import { test, expect } from '@playwright/experimental-ct-react';
import { CardVariants } from '../../constants';
import { makeFakeOffer } from '../../mocks';
import Card from './card';

test.describe('Card', () => {
  test('renders offer details, links and premium badge', async ({ mount }) => {
    const offer = makeFakeOffer({
      title: 'Central apartment',
      previewImage: 'apartment.jpg',
      rating: 4,
    });

    const card = await mount(<Card offer={offer} />);

    await expect(card).toHaveClass(/cities__card/);
    await expect(card.getByText('Premium')).toBeVisible();
    await expect(card.getByText('€120')).toBeVisible();
    await expect(card.getByText('/ night')).toBeVisible();
    await expect(card.getByRole('heading', { name: 'Central apartment' })).toBeVisible();
    await expect(card.getByText('Apartment', { exact: true })).toBeVisible();
    await expect(card.getByRole('img', { name: 'Place image' })).toHaveAttribute('src', 'apartment.jpg');
    await expect(card.getByRole('link')).toHaveCount(2);
    await expect(card.getByRole('link').nth(0)).toHaveAttribute('href', '/offer/offer-1');
    await expect(card.getByRole('link').nth(1)).toHaveAttribute('href', '/offer/offer-1');
    await expect(card.locator('.place-card__stars span:first-child')).toHaveCSS('width', '80%');
  });

  test('uses favorites layout dimensions for the favorites variant', async ({ mount }) => {
    const card = await mount(
      <Card
        offer={makeFakeOffer()}
        variant={CardVariants.Favorites}
      />
    );

    await expect(card).toHaveClass(/favorites__card/);
    await expect(card.getByRole('img', { name: 'Place image' })).toHaveAttribute('width', '150');
    await expect(card.getByRole('img', { name: 'Place image' })).toHaveAttribute('height', '110');
    await expect(card.locator('.favorites__card-info')).toBeVisible();
  });

  test('calls mouse enter and leave handlers', async ({ mount }) => {
    let hoveredOfferId: string | null = null;
    let hasMouseLeft = false;
    const card = await mount(
      <Card
        offer={makeFakeOffer({ id: 'hovered-offer' })}
        variant={CardVariants.Near}
        onMouseEnter={(id) => {
          hoveredOfferId = id;
        }}
        onMouseLeave={() => {
          hasMouseLeft = true;
        }}
      />
    );

    await expect(card).toHaveClass(/near-places__card/);
    await card.hover();
    expect(hoveredOfferId).toBe('hovered-offer');

    await card.dispatchEvent('mouseout');
    expect(hasMouseLeft).toBe(true);
  });
});
