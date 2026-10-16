import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Goods from './goods';

describe('Goods', () => {
  it('renders the goods heading and each item', () => {
    render(<Goods goods={['Heating', 'Kitchen', 'Wi-Fi']} />);

    expect(screen.getByRole('heading', { name: 'What\'s inside' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Heating')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
  });
});
