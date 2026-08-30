import MainScreen from '../pages/main/main';

type AppProps = {
  cardsCount: number;
};

function App({ cardsCount }: AppProps): JSX.Element {
  return (
    <MainScreen cardsCount={cardsCount} />
  );
}

export default App;
