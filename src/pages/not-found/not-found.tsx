import { Helmet } from 'react-helmet-async';
import Header from '../../components/shared/header';
import { Link } from 'react-router-dom';

function NotFound(): JSX.Element {
  return (
    <div className="page">

      <Helmet>
        <title>Not Found</title>
      </Helmet>

      <Header />
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
    </div>
  );
}

export default NotFound;
