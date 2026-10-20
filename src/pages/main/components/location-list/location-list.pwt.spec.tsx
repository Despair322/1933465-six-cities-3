import { test, expect } from '@playwright/experimental-ct-react';
import { CityNames } from '../../../../constants';
import LocationList from './location-list';

test.describe('LocationList', () => {
  test('renders every city and marks the active city', async ({ mount }) => {
    const list = await mount(<LocationList activeCity="Paris" onClick={() => undefined} />);

    await expect(list.getByRole('link')).toHaveCount(CityNames.length);
    await expect(list.getByRole('link', { name: 'Paris' })).toHaveClass(/tabs__item--active/);
    await expect(list.getByRole('link', { name: 'Cologne' })).not.toHaveClass(/tabs__item--active/);
  });

  test('forwards the selected city when a city link is clicked', async ({ mount }) => {
    let selectedCity = '';
    const list = await mount(
      <LocationList
        activeCity="Paris"
        onClick={(city) => {
          selectedCity = city;
        }}
      />
    );

    await list.getByRole('link', { name: 'Hamburg' }).click();
    expect(selectedCity).toBe('Hamburg');
  });
});
