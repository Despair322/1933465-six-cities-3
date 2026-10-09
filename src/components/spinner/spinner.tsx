import './spinner.css';

type SpinnerProps = {
  label?: string;
};

function Spinner({ label = 'Loading' }: SpinnerProps): JSX.Element {
  return <div className="loading-spinner" role="status" aria-label={label} />;
}

export default Spinner;
