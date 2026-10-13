import { HeaderProps } from './header.types';
import Logo from './logo';
import Navigation from './navigation';

function Header({ hasNavigation }: HeaderProps): JSX.Element {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <Logo />
          {hasNavigation && <Navigation />}
        </div>
      </div>
    </header>
  );
}

export default Header;
