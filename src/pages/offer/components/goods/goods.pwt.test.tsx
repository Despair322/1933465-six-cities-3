import { test, expect } from '@playwright/experimental-ct-react';
import Goods from './goods';

test('renders the goods heading and each item', async ({ mount }) => {
  const goods = await mount(<Goods goods={['Heating', 'Kitchen', 'Wi-Fi']} />);

  await expect(goods.getByRole('heading', { name: 'What\'s inside' })).toBeVisible();
  await expect(goods.getByRole('listitem')).toHaveCount(3);
  await expect(goods.getByText('Heating')).toBeVisible();
  await expect(goods.getByText('Kitchen')).toBeVisible();
  await expect(goods.getByText('Wi-Fi')).toBeVisible();
});
