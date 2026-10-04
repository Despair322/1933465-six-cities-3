import { FormEvent, Fragment, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import { AppRoute } from '../../constants/app';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectActiveCity } from '../../store/slices/catalog';
import { loginAction } from '../../store/thunks/user';

function LoginScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeCity = useAppSelector(selectActiveCity);

  const [loginError, setLoginError] = useState<string | null>(null);

  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setLoginError(null);
    if (loginRef.current !== null && passwordRef.current !== null) {
      void dispatch(loginAction({
        login: loginRef.current.value,
        password: passwordRef.current.value,
      })).unwrap().then(() => <Navigate to={AppRoute.Main} />
      )
        .catch((error: unknown) => {
          if (typeof error === 'string') {
            setLoginError(error);
          }
        });
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input ref={loginRef} className="login__input form__input" type="email" name="email" placeholder="Email" required />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input ref={passwordRef} className="login__input form__input" type="password" name="password" placeholder="Password" required />
              </div>
              {loginError && <p className="login__error" role="alert">{loginError}</p>}
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to={AppRoute.Main}>
                <span>{activeCity}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Fragment >
  );
}

export default LoginScreen;
