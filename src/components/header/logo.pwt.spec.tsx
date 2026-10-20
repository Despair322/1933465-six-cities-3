import { test, expect } from '@playwright/experimental-ct-react';
import Logo from './logo';

test.describe('Logo', () => {
  test('marks the logo link active on the main page', async ({ mount }) => {
    const logo = await mount(<Logo />, {
      hooksConfig: { initialEntries: ['/'] },
    });

    const link = logo.getByRole('link');
    await expect(link).toHaveAttribute('href', '/');
    await expect(link).toHaveClass(/header__logo-link--active/);
    await expect(logo.getByRole('img', { name: '6 cities logo' })).toHaveAttribute('src', 'img/logo.svg');
  });

  test('does not mark the logo link active on other pages', async ({ mount }) => {
    const logo = await mount(<Logo />, {
      hooksConfig: { initialEntries: ['/favorites'] },
    });

    await expect(logo.getByRole('link')).not.toHaveClass(/header__logo-link--active/);
  });
});
