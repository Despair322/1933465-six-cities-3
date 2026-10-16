import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from './spinner';

describe('Spinner', () => {
  it('renders a status indicator with the default loading label', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders the provided loading label', () => {
    render(<Spinner label="Loading offers" />);

    expect(screen.getByRole('status', { name: 'Loading offers' })).toBeInTheDocument();
  });
});
