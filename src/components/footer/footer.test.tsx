import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from './footer';

describe('Footer', () => {
  it('renders the home link with the Six Cities logo', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    expect(screen.getByRole('img', { name: '6 cities logo' })).toHaveAttribute('src', 'img/logo.svg');
  });
});
