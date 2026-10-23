import { test, expect } from '@playwright/experimental-ct-react';
import { RequestStatus } from '../../constants';
import { makeFakeOffer } from '../../mocks';
import FavoriteCount from './favorite-count';

test.describe('FavoriteCount', () => {
  test('renders the number of favorite offers from the store', async ({ mount }) => {
    const count = await mount(<FavoriteCount />, {
      hooksConfig: {
        initialState: {
          favorites: {
            favorites: [makeFakeOffer({ id: 'offer-1' }), makeFakeOffer({ id: 'offer-2' })],
            loadingStatus: { favorites: RequestStatus.Succeeded },
          },
        },
      },
    });

    await expect(count.getByText('2')).toHaveClass(/header__favorite-count/);
  });

  test('renders zero when there are no favorite offers', async ({ mount }) => {
    const count = await mount(<FavoriteCount />);

    await expect(count.getByText('0')).toHaveClass(/header__favorite-count/);
  });
});
