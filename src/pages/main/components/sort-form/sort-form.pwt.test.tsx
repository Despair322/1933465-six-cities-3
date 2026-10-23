import { test, expect } from '@playwright/experimental-ct-react';
import { SORT_OPTIONS } from '../../../../constants';
import SortForm from './sort-form';

test.describe('SortForm', () => {
  test('opens sort options and updates the selected sort type', async ({ mount }) => {
    const form = await mount(<SortForm />);
    const sortControl = form.locator('.places__sorting-type');
    const options = form.locator('.places__options');

    await expect(sortControl).toHaveText('Popular');
    await expect(options).not.toHaveClass(/places__options--opened/);

    await sortControl.click();
    await expect(options).toHaveClass(/places__options--opened/);
    await form.getByText('Price: low to high', { exact: true }).click();

    await expect(options).not.toHaveClass(/places__options--opened/);
    await expect(form.locator('.places__option--active')).toHaveText('Price: low to high');
  });

  test('renders each supported sort option', async ({ mount }) => {
    const form = await mount(<SortForm />);

    await expect(form.locator('.places__option')).toHaveCount(SORT_OPTIONS.length);
    for (const [index, { title }] of SORT_OPTIONS.entries()) {
      await expect(form.locator('.places__option').nth(index)).toHaveText(title);
    }
    await expect(form.locator('.places__option--active')).toHaveText('Popular');
  });
});
