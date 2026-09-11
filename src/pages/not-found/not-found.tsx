import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function NotFound(): JSX.Element {
  return (
    <Fragment>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <main className="page__main page__main--not-found">
        <div className="page__not-found-container container">
          <section className="not-found">
            <h1 className="not-found__title">404 Not found</h1>
            <Link className="not-found__link" to="/">
              Go to main page
            </Link>
          </section>
        </div>
      </main>
    </Fragment>
  );
}

export default NotFound;
