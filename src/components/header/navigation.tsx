import { Link, useLocation } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../constants/app';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAction } from '../../store/thunks/user';
import { selectAuthorizationStatus, selectUserData } from '../../store/slices/user';
import FavoriteCount from './favorite-count';

function Navigation(): JSX.Element | null {
  const authStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUserData);
  const isAuth = authStatus === AuthorizationStatus.Auth;
  const isUnknown = authStatus === AuthorizationStatus.Unknown;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const handleSignOut = () => {
    dispatch(logoutAction());
  };
  const signOutPath = location.pathname === AppRoute.Favorites
    ? AppRoute.Main
    : `${location.pathname}${location.search}${location.hash}`;

  if (isUnknown) {
    return null;
  }
  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <Link className="header__nav-link header__nav-link--profile" to={isAuth ? AppRoute.Favorites : `${AppRoute.Login}?redirect=${location.pathname}`}>
            <div className="header__avatar-wrapper user__avatar-wrapper">
            </div>
            {
              isAuth ?
                <>
                  <span className="header__user-name user__name">{user?.email}</span>
                  <FavoriteCount />
                </> :
                <span className="header__login">Sign in</span>
            }
          </Link>
        </li>
        {
          isAuth &&
          <li className="header__nav-item">
            <Link className="header__nav-link" to={signOutPath} onClick={handleSignOut}>
              <span className="header__signout">Sign out</span>
            </Link>
          </li>
        }
      </ul>
    </nav >
  );
}

export default Navigation;
