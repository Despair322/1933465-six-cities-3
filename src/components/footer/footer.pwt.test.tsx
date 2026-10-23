import { test, expect } from '@playwright/experimental-ct-react';
import Footer from './footer';

test.describe('Footer', () => {
  test('renders the home link with the Six Cities logo', async ({ mount }) => {
    const component = await mount(<Footer />);

    const link = component.getByRole('link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');

    const img = component.getByRole('img', { name: '6 cities logo' });
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', 'img/logo.svg');
  });
});
