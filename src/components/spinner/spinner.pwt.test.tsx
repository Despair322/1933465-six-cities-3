import { test, expect } from '@playwright/experimental-ct-react';
import Spinner from './spinner';

test.describe('Spinner', () => {
  test('renders a status indicator with the default loading label', async ({ mount }) => {
    const component = await mount(<Spinner />);
    await expect(component).toHaveAttribute('aria-label', 'Loading');
    await expect(component).toHaveAttribute('role', 'status');
    await expect(component).toBeVisible();
  });

  test('renders the provided loading label', async ({ mount }) => {
    const component = await mount(<Spinner label="Loading offers" />);

    await expect(component).toHaveAttribute('aria-label', 'Loading offers');
    await expect(component).toBeVisible();
  });
});
