import Logo from './logo';
import Navigation from './navigation';

function Header({ hasNavigation }: { hasNavigation: boolean }): JSX.Element {
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
