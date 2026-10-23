import { test, expect } from '@playwright/experimental-ct-react';
import OfferHost from './offer-host';

test.describe('OfferHost', () => {
  test('renders host details and description', async ({ mount }) => {
    const host = await mount(
      <OfferHost
        host={{ name: 'Alex', avatarUrl: 'alex.jpg', isPro: false }}
        description="A bright and comfortable apartment."
      />
    );

    await expect(host.getByRole('heading', { name: 'Meet the host' })).toBeVisible();
    await expect(host.getByText('Alex')).toBeVisible();
    await expect(host.getByRole('img', { name: 'Host avatar' })).toHaveAttribute('src', 'alex.jpg');
    await expect(host.getByText('A bright and comfortable apartment.')).toBeVisible();
    await expect(host.getByText('Pro')).toHaveCount(0);
  });

  test('marks a professional host with a badge and wrapper modifier', async ({ mount }) => {
    const host = await mount(
      <OfferHost
        host={{ name: 'Pro Host', avatarUrl: 'pro.jpg', isPro: true }}
        description="Description."
      />
    );

    await expect(host.getByText('Pro', { exact: true })).toBeVisible();
    await expect(host.locator('.offer__avatar-wrapper')).toHaveClass(/offer__avatar-wrapper--pro/);
  });
});
