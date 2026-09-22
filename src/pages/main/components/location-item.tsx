import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../constants/app';
import type { LocationProps } from '../../../types/components';

function LocationItem({ city, isActive, onClick }: LocationProps): JSX.Element {

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClick(city);
  };

  return (
    <li className="locations__item">
      <Link
        className={classNames('locations__item-link', 'tabs__item', { 'tabs__item--active': isActive })}
        to={AppRoute.CityByName(city)}
        onClick={handleClick}
      >
        <span>{city}</span>
      </Link>
    </li>);
}

export default LocationItem;
