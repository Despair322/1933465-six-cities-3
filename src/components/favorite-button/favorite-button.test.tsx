import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FavoriteButtonVariants } from '../../constants';
import * as favoriteThunks from '../../store/thunks/favorites';
import FavoriteButton from './favorite-button';

const { dispatchMock } = vi.hoisted(() => ({
  dispatchMock: vi.fn(),
}));

vi.mock('../../hooks', () => ({
  useAppDispatch: () => dispatchMock,
}));

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    dispatchMock.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    dispatchMock.mockReset();
  });

  it('renders inactive card button and dispatches a favorite action after debounce', async () => {
    const actionSpy = vi.spyOn(favoriteThunks, 'postFavoriteAction');
    render(
      <MemoryRouter initialEntries={['/']}>
        <FavoriteButton id="offer-1" isFavorite={false} variant={FavoriteButtonVariants.Card} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: 'To bookmarks' });
    expect(button).toHaveClass('place-card__bookmark-button');
    expect(button).not.toHaveClass('place-card__bookmark-button--active');

    fireEvent.click(button);
    expect(dispatchMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(300);

    expect(actionSpy).toHaveBeenCalledWith({ id: 'offer-1', status: true });
    expect(dispatchMock).toHaveBeenCalledWith(actionSpy.mock.results[0].value);
  });

  it('renders active offer button when the offer is already bookmarked', () => {
    render(
      <MemoryRouter>
        <FavoriteButton id="offer-2" isFavorite variant={FavoriteButtonVariants.Offer} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'In bookmarks' })).toHaveClass(
      'offer__bookmark-button',
      'offer__bookmark-button--active'
    );
  });
});
