import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { AppRoute, CityName } from '../../../const';

type LocationProps = {
  city: CityName;
  isActive: boolean;
};

function LocationItem({ city, isActive }: LocationProps): JSX.Element {
  return (
    <li className="locations__item">
      <Link
        className={classNames('locations__item-link', 'tabs__item', { 'tabs__item--active': isActive })}
        to={AppRoute.CityByName(city)}
      >
        <span>{city}</span>
      </Link>
    </li>);
}

export default LocationItem;
