import { test, expect } from '@playwright/experimental-ct-react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import BackButton from '../../mocks/components/back-button';

test.describe('ProtectedRoute', () => {

  test('renders its children when navigation is not required', async ({ mount, page }) => {
    await mount(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isNavigate={false} navigateTo="/login">
              <h1>Private content</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    );

    await expect(page.getByRole('heading', { name: 'Private content' })).toBeVisible();
  });

  test('replaces the protected route and supports back navigation', async ({ mount, page }) => {
    await mount(
      <Routes>
        <Route
          path="/previous"
          element={<h1>Previous page</h1>}
        />
        <Route
          path="/private"
          element={
            <ProtectedRoute isNavigate navigateTo="/login">
              <h1>Private content</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<BackButton />} />
      </Routes>,
      {
        hooksConfig: {
          initialEntries: ['/previous', '/private'],
        },
      }
    );

    const backButton = page.getByRole('button', { name: 'Back' });
    await expect(backButton).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Private content' })).not.toBeVisible();

    await backButton.click();

    await expect(page.getByRole('heading', { name: 'Previous page' })).toBeVisible();
  });
});
