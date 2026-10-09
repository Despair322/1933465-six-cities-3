import classNames from 'classnames';
import { useMemo } from 'react';
import { useAppDispatch } from '../../hooks';
import { debounce } from '../../utils/common';
import { postFavoriteAction } from '../../store/thunks/favorites';
import { FavoriteButtonVariants } from '../../constants/app';
import type { FavoriteButtonProps } from './types';

function FavoriteButton({ isFavorite, id, variant }: FavoriteButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  const isCard = variant === FavoriteButtonVariants.Card;

  const handleFavoriteClick = useMemo(
    () => debounce(() => {
      dispatch(postFavoriteAction({ id, status: !isFavorite }));
    }, 300),
    [dispatch, id, isFavorite],
  );

  return (
    <button
      className={
        classNames(
          { 'place-card__bookmark-button': isCard },
          { 'offer__bookmark-button': !isCard },
          'button',
          { 'place-card__bookmark-button--active': isFavorite && isCard },
          { 'offer__bookmark-button--active': isFavorite && !isCard },
        )
      }
      type="button"
      onClick={handleFavoriteClick}
    >
      <svg className={classNames(
        { 'place-card__bookmark-icon': isCard },
        { 'offer__bookmark-icon': !isCard }
      )} width={isCard ? '18' : '32'} height={isCard ? '19' : '33'}
      >
        <use xlinkHref="#icon-bookmark" > </use>
      </svg>
      <span className="visually-hidden" > {isFavorite ? 'In bookmarks' : 'To bookmarks'} </span>
    </button>
  );
}

export default FavoriteButton;
