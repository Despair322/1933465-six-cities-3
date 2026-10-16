import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CityNames } from '../../../../constants';
import LocationList from './location-list';

describe('LocationsList', () => {
  it('renders every city and marks the active city', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <LocationList activeCity="Paris" onClick={onClick} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('link')).toHaveLength(CityNames.length);
    expect(screen.getByRole('link', { name: 'Paris' })).toHaveClass('tabs__item--active');
    expect(screen.getByRole('link', { name: 'Cologne' })).not.toHaveClass('tabs__item--active');
  });

  it('forwards the selected city when a city link is clicked', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <LocationList activeCity="Paris" onClick={onClick} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Hamburg' }));

    expect(onClick).toHaveBeenCalledWith('Hamburg');
  });
});
