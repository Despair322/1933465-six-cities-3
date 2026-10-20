import { test, expect } from '@playwright/experimental-ct-react';
import LocationItemTestStory from '../../../../mocks/components/location-item-test-story';

test.describe('Favorites LocationItem', () => {
  test('links to the main page and selects its city when clicked', async ({ mount }) => {
    const story = await mount(<LocationItemTestStory />);

    const cityLink = story.getByRole('link', { name: 'Amsterdam' });
    await expect(cityLink).toHaveAttribute('href', '/');
    await expect(story.getByLabel('Active city')).toHaveText('Paris');

    await cityLink.click();

    await expect(story.getByLabel('Active city')).toHaveText('Amsterdam');
  });
});
