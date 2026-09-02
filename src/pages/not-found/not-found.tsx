import Header from '../../components/shared/header';

function NotFound(): JSX.Element {
  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--not-found">
        <div className="page__not-found-container container">
          <section className="not-found">
            <h1 className="not-found__title">404 Not found</h1>
            <a className="not-found__link" href="main.html">Go to main page</a>
          </section>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
