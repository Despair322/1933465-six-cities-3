import { memo } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../../constants/app';
import { LocationItemProps } from './location-item.types';
import { useAppDispatch } from '../../../../hooks';
import { setActiveCity } from '../../../../store/slices/catalog';

function LocationItem({ city }: LocationItemProps): JSX.Element {

  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setActiveCity(city));
  };

  return (
    <div className="favorites__locations locations locations--current">
      <div className="locations__item">
        <Link className="locations__item-link" to={AppRoute.Main} onClick={handleClick}>
          <span>{city}</span>
        </Link>
      </div>
    </div>
  );
}

const MemoizedLocationItem = memo(LocationItem);

export default MemoizedLocationItem;
