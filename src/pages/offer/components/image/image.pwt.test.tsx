import { test, expect } from '@playwright/experimental-ct-react';
import Image from './image';

test('renders the offer image with its source and alt text', async ({ mount }) => {
  const image = await mount(<Image src="apartment.jpg" />);
  const offerImage = image.getByRole('img', { name: 'Place' });

  await expect(offerImage).toHaveAttribute('src', 'apartment.jpg');
  await expect(offerImage).toHaveClass(/offer__image/);
});
