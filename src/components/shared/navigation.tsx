import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants/app';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAction } from '../../store/thunks/user';
import { selectAuthorizationStatus, selectUserData } from '../../store/slices/user';
import { selectFavoritesCount } from '../../store/slices/favorites';

function Navigation(): JSX.Element | null {
  const authStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUserData);
  const favorites = useAppSelector(selectFavoritesCount);
  const isAuth = authStatus === AuthorizationStatus.Auth;
  const isUnknown = authStatus === AuthorizationStatus.Unknown;
  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(logoutAction());
  };

  if (isUnknown) {
    return null;
  }

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <Link className="header__nav-link header__nav-link--profile" to={isAuth ? AppRoute.Favorites : AppRoute.Login}>
            <div className="header__avatar-wrapper user__avatar-wrapper">
            </div>
            {
              isAuth ?
                <>
                  <span className="header__user-name user__name">{user?.email}</span>
                  <span className="header__favorite-count">{favorites}</span>
                </> :
                <span className="header__login">Sign in</span>
            }
          </Link>
        </li>
        {
          isAuth &&
          <li className="header__nav-item">
            <Link className="header__nav-link" to={AppRoute.Main} onClick={handleSignOut}>
              <span className="header__signout">Sign out</span>
            </Link>
          </li>
        }
      </ul>
    </nav>
  );
}

export default Navigation;
