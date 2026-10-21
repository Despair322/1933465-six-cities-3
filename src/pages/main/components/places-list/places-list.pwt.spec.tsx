import { test, expect } from '@playwright/experimental-ct-react';
import { makeFakeOffer } from '../../../../mocks/data/offer';
import PlacesList from './places-list';

test.describe('PlacesList', () => {
  test('renders an offer card for each offer and forwards mouse events', async ({ mount }) => {
    let hoveredOfferId: string | null = null;
    let hasMouseLeft = false;
    const list = await mount(
      <PlacesList
        offers={[
          makeFakeOffer({ id: 'offer-1' }),
          makeFakeOffer({ id: 'offer-2' }),
        ]}
        onMouseEnter={(id) => {
          hoveredOfferId = id;
        }}
        onMouseLeave={() => {
          hasMouseLeft = true;
        }}
      />
    );

    const cards = list.getByRole('article');
    await expect(cards).toHaveCount(2);
    await cards.first().hover();
    expect(hoveredOfferId).toBe('offer-1');

    await cards.first().dispatchEvent('mouseout');
    expect(hasMouseLeft).toBe(true);
  });

  test('renders an empty list when there are no offers', async ({ mount }) => {
    const list = await mount(<PlacesList offers={[]} />);

    await expect(list).toHaveClass(/cities__places-list/);
    await expect(list).toBeEmpty();
  });
});
