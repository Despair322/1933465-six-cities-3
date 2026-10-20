import { useNavigate } from 'react-router-dom';

function BackButton(): JSX.Element {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}

export default BackButton;
