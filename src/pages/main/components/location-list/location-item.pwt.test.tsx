import { test, expect } from '@playwright/experimental-ct-react';
import LocationItem from './location-item';

test.describe('LocationItem', () => {
  test('links to the main page and selects its city when clicked', async ({ mount }) => {
    let selectedCity = '';
    const item = await mount(
      <LocationItem
        city="Amsterdam"
        isActive
        onClick={(city) => {
          selectedCity = city;
        }}
      />
    );
    const cityLink = item.getByRole('link', { name: 'Amsterdam' });

    await expect(cityLink).toHaveAttribute('href', '/');
    await expect(cityLink).toHaveClass(/tabs__item--active/);
    await cityLink.click();

    expect(selectedCity).toBe('Amsterdam');
  });

  test('does not mark an inactive city as active', async ({ mount }) => {
    const item = await mount(
      <LocationItem city="Amsterdam" isActive={false} onClick={() => undefined} />
    );

    await expect(item.getByRole('link', { name: 'Amsterdam' })).not.toHaveClass(/tabs__item--active/);
  });
});
