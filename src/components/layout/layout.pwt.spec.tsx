import { test, expect } from '@playwright/experimental-ct-react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import { AuthorizationStatus, RequestStatus } from '../../constants';
import { makeFakeOffer } from '../../mocks/data/offer';

function layoutRoute(): JSX.Element {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<h1>Route content</h1>} />
      </Route>
    </Routes>
  );
}

test.describe('Layout', () => {
  test('renders the main page layout and route content', async ({ mount, page }) => {
    await mount(layoutRoute(), {
      hooksConfig: {
        initialEntries: ['/'],
        initialState: {
          user: { authorizationStatus: AuthorizationStatus.NoAuth, userData: null },
        },
      },
    });

    await expect(page.locator('.page')).toHaveClass('page page--gray page--main');
    await expect(page.getByRole('heading', { name: 'Route content' })).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  });

  test('renders the login page without header navigation', async ({ mount, page }) => {
    await mount(layoutRoute(), {
      hooksConfig: { initialEntries: ['/login'] },
    });

    await expect(page.locator('.page')).toHaveClass('page page--gray page--login');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toHaveCount(0);
  });

  test('renders empty favorites styling and footer', async ({ mount, page }) => {
    await mount(layoutRoute(), {
      hooksConfig: { initialEntries: ['/favorites'] },
    });

    await expect(page.locator('.page')).toHaveClass('page page--favorites-empty');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Route content' })).toBeVisible();
  });

  test('keeps favorites styling and footer when favorites exist', async ({ mount, page }) => {
    await mount(layoutRoute(), {
      hooksConfig: {
        initialEntries: ['/favorites'],
        initialState: {
          favorites: {
            favorites: [makeFakeOffer({ isFavorite: true })],
            oldFavorites: [],
            loadingStatus: { favorites: RequestStatus.Succeeded },
          },
        },
      },
    });

    await expect(page.locator('.page')).not.toHaveClass(/page--favorites-empty/);
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
