import { useAppSelector } from '../../hooks';
import { selectFavoritesCount } from '../../store/slices/favorites';

function FavoriteCount(): JSX.Element {
  const count = useAppSelector(selectFavoritesCount);

  return (
    <span className="header__favorite-count">{count}</span>
  );
}

export default FavoriteCount;
