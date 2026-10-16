import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('renders a 404 message and a link back to the main page', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '404 Not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to main page' })).toHaveAttribute('href', '/');
  });
});
