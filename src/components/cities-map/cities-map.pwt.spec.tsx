import { test, expect } from '@playwright/experimental-ct-react';
import { CURRENT_ICON_URL, DEFAULT_ICON_URL, MapVariants } from '../../constants';
import type { City } from '../../types/offer';
import type { Point } from '../../types/types';
import CitiesMap from './cities-map';

const city: City = {
  name: 'Paris',
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
};

const initialPoints: Point[] = [
  { id: 'point-1', location: { latitude: 48.85, longitude: 2.35 } },
  { id: 'point-2', location: { latitude: 48.86, longitude: 2.36 } },
];

test.describe('CitiesMap', () => {
  test('renders markers with the selected point highlighted', async ({ mount, page }) => {
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const map = await mount(
      <CitiesMap
        city={city}
        points={initialPoints}
        selectedPoint="point-2"
        variant={MapVariants.Main}
      />
    );

    await expect(map).toHaveClass(/map/);
    await expect(map).toHaveClass(/cities__map/);

    const markers = map.locator('.leaflet-marker-icon');
    await expect(markers).toHaveCount(2);
    await expect(markers.nth(0)).toHaveAttribute('src', DEFAULT_ICON_URL);
    await expect(markers.nth(1)).toHaveAttribute('src', CURRENT_ICON_URL);
  });

  test('updates marker positions and removes markers for removed points', async ({ mount, page }) => {
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const map = await mount(
      <CitiesMap
        city={city}
        points={initialPoints}
        selectedPoint={null}
        variant={MapVariants.Main}
      />
    );

    await expect(map.locator('.leaflet-marker-icon')).toHaveCount(2);

    await map.update(
      <CitiesMap
        city={city}
        points={[{ id: 'point-1', location: { latitude: 52.37, longitude: 4.9 } }]}
        selectedPoint="point-1"
        variant={MapVariants.Main}
      />
    );

    const markers = map.locator('.leaflet-marker-icon');
    await expect(markers).toHaveCount(1);
    await expect(markers).toHaveAttribute('src', CURRENT_ICON_URL);
  });

  test('unlocks the offer map when its overlay is clicked', async ({ mount, page }) => {
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());
    await page.addStyleTag({ content: '.map { width: 600px; height: 400px; }' });

    const map = await mount(
      <CitiesMap
        city={city}
        points={[]}
        selectedPoint={null}
        variant={MapVariants.Offer}
      />
    );

    const overlay = map.getByRole('button', { name: 'Enable map interaction' });
    await expect(overlay).toBeVisible();
    await overlay.click();
    await expect(overlay).toHaveCount(0);
    await expect(map).toHaveClass(/offer__map/);
  });

  test('unlocks the offer map with Enter and Space', async ({ mount, page }) => {
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const map = await mount(
      <CitiesMap
        city={city}
        points={[]}
        selectedPoint={null}
        variant={MapVariants.Offer}
      />
    );

    const overlay = map.getByRole('button', { name: 'Enable map interaction' });
    await overlay.focus();
    await overlay.press('Enter');
    await expect(overlay).toHaveCount(0);
  });

  test('unlocks the offer map with Space', async ({ mount, page }) => {
    await page.route('https://*.basemaps.cartocdn.com/**', (route) => route.abort());

    const map = await mount(
      <CitiesMap
        city={city}
        points={[]}
        selectedPoint={null}
        variant={MapVariants.Offer}
      />
    );

    const overlay = map.getByRole('button', { name: 'Enable map interaction' });
    await overlay.focus();
    await overlay.press('Space');
    await expect(overlay).toHaveCount(0);
  });
});
