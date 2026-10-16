import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OfferHost from './offer-host';

describe('OfferHost', () => {
  it('renders host details and description', () => {
    render(
      <OfferHost
        host={{ name: 'Alex', avatarUrl: 'alex.jpg', isPro: false }}
        description="A bright and comfortable apartment."
      />
    );

    expect(screen.getByRole('heading', { name: 'Meet the host' })).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Host avatar' })).toHaveAttribute('src', 'alex.jpg');
    expect(screen.getByText('A bright and comfortable apartment.')).toBeInTheDocument();
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('marks a pro host with the badge and wrapper modifier', () => {
    const { container } = render(
      <OfferHost
        host={{ name: 'Pro Host', avatarUrl: 'pro.jpg', isPro: true }}
        description="Description."
      />
    );

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(container.querySelector('.offer__avatar-wrapper')).toHaveClass('offer__avatar-wrapper--pro');
  });
});
