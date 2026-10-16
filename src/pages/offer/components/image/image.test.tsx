import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Image from './image';

describe('Offer Image', () => {
  it('renders an offer image with the provided source and alt text', () => {
    render(<Image src="apartment.jpg" />);

    expect(screen.getByRole('img', { name: 'Place' })).toHaveAttribute('src', 'apartment.jpg');
    expect(screen.getByRole('img', { name: 'Place' })).toHaveClass('offer__image');
  });
});
