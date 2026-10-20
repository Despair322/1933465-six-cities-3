import { test, expect } from '@playwright/experimental-ct-react';
import { AuthorizationStatus } from '../../constants';
import Header from './header';

test.describe('Header', () => {
  test('renders the logo without navigation when navigation is disabled', async ({ mount, page }) => {
    const header = await mount(<Header hasNavigation={false} />);

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(header.getByRole('img', { name: '6 cities logo' })).toBeVisible();
    await expect(header.getByRole('navigation')).toHaveCount(0);
  });

  test('renders navigation when enabled for a signed-out user', async ({ mount }) => {
    const header = await mount(<Header hasNavigation />, {
      hooksConfig: {
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(header.getByRole('navigation')).toBeVisible();
    await expect(header.getByText('Sign in')).toBeVisible();
  });
});
