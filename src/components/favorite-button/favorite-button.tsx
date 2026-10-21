import classNames from 'classnames';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { debounce } from '../../utils';
import { postFavoriteAction } from '../../store/thunks/favorites';
import { AppRoute, AuthorizationStatus, FavoriteButtonVariants } from '../../constants';
import type { FavoriteButtonProps } from './favorite-button.types';
import { useLocation, useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { selectAuthorizationStatus } from '../../store/slices/user';

function FavoriteButton({ isFavorite, id, variant }: FavoriteButtonProps): JSX.Element {
  const isAuth = useAppSelector(selectAuthorizationStatus) === AuthorizationStatus.Auth;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCard = variant === FavoriteButtonVariants.Card;

  const handleFavoriteClick = useMemo(
    () => debounce(() => {
      dispatch(postFavoriteAction({ id, status: !isFavorite })).unwrap().catch((status: unknown) => {
        if (status === StatusCodes.UNAUTHORIZED) {
          navigate(`${AppRoute.Login}?redirect=${location.pathname}`,
            { replace: true });
        }
      });
    }, 300),
    [dispatch, id, isFavorite, location, navigate],
  );

  return (
    <button
      className={
        classNames(
          { 'place-card__bookmark-button': isCard },
          { 'offer__bookmark-button': !isCard },
          'button',
          { 'place-card__bookmark-button--active': isAuth && isFavorite && isCard },
          { 'offer__bookmark-button--active': isAuth && isFavorite && !isCard },
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
      <span className="visually-hidden" > {isAuth && isFavorite ? 'In bookmarks' : 'To bookmarks'} </span>
    </button>
  );
}

export default FavoriteButton;
