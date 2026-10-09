import { Link, useLocation } from 'react-router-dom';
import { AppRoute } from '../../constants/app';
import classNames from 'classnames';

function Logo(): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname === AppRoute.Main;
  return (
    <div className="header__left">
      <Link
        className={classNames('header__logo-link', { 'header__logo-link--active': isActive })}
        to={AppRoute.Main}
      >
        <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
      </Link>
    </div>
  );
}

export default Logo;
