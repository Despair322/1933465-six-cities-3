import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RatingVariants } from '../../constants';
import Rating from './rating';

describe('Rating', () => {
  it('renders card rating as a percentage of five stars', () => {
    const { container } = render(
      <Rating rating={4.2} variant={RatingVariants.Card} />
    );

    expect(container.querySelector('.place-card__rating')).toBeInTheDocument();
    expect(container.querySelector('.place-card__stars span')).toHaveStyle({ width: '80%' });
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.queryByText('4.2')).not.toBeInTheDocument();
  });

  it('renders offer rating and its numeric value', () => {
    const { container } = render(
      <Rating rating={3.6} variant={RatingVariants.Offer} />
    );

    expect(container.querySelector('.offer__rating')).toBeInTheDocument();
    expect(container.querySelector('.offer__stars span')).toHaveStyle({ width: '80%' });
    expect(screen.getByText('3.6')).toHaveClass('offer__rating-value');
    expect(screen.getByText('Rating')).toBeInTheDocument();
  });
});
