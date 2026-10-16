import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LocationItem from './location-item';

describe('Main LocationItem', () => {
  it('renders its city and active state', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <LocationItem city="Brussels" isActive onClick={onClick} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Brussels' })).toHaveClass('tabs__item--active');
  });

  it('selects the city without navigating away', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter initialEntries={['/current']}>
        <LocationItem city="Hamburg" isActive={false} onClick={onClick} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Hamburg' });
    fireEvent.click(link);

    expect(onClick).toHaveBeenCalledWith('Hamburg');
    expect(link).toHaveAttribute('href', '/');
  });
});
