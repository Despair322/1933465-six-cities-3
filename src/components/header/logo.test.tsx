import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Logo from './logo';

describe('Logo', () => {
  it('marks the logo link active on the main page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Logo />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    expect(screen.getByRole('link')).toHaveClass('header__logo-link--active');
    expect(screen.getByRole('img', { name: '6 cities logo' })).toHaveAttribute('src', 'img/logo.svg');
  });

  it('does not mark the logo link active on other pages', () => {
    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Logo />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).not.toHaveClass('header__logo-link--active');
  });
});
