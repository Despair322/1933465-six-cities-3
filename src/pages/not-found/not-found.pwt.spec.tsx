import { test, expect } from '@playwright/experimental-ct-react';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from './not-found';

test('renders a 404 message and a link back to the main page', async ({ mount, page }) => {
  await mount(
    <HelmetProvider>
      <NotFound />
    </HelmetProvider>
  );

  await expect(page.getByRole('heading', { name: '404 Not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to main page' })).toHaveAttribute('href', '/');
});
