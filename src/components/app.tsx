import Main from '../pages/main/main';
import Favorites from '../pages/favorites/favorites';
import Offer from '../pages/offer/offer';
import NotFound from '../pages/not-found/not-found';
import Login from '../pages/login/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

type AppProps = {
  cardsCount: number;
};

function App({ cardsCount }: AppProps): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Main cardsCount={cardsCount} />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/offer/:id"
          element={<Offer />}
        />
        <Route
          path="/favorites"
          element={<Favorites />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
