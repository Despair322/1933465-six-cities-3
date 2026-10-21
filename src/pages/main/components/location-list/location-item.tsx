import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../../constants';
import type { CityName } from '../../../../types/types';

type LocationProps = {
  city: CityName;
  isActive: boolean;
  onClick: (city: CityName) => void;
};

function LocationItem({ city, isActive, onClick }: LocationProps): JSX.Element {

  const handleClick = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    onClick(city);
  };

  return (
    <li className="locations__item">
      <Link
        className={classNames('locations__item-link', 'tabs__item', { 'tabs__item--active': isActive })}
        to={AppRoute.Main}
        onClick={handleClick}
      >
        <span>{city}</span>
      </Link>
    </li>);
}

export default LocationItem;
