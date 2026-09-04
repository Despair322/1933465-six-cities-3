type FeatureProps = {
  feature: string;
};

function Feature({ feature }: FeatureProps): JSX.Element {
  return (
    <li className="offer__inside-item">
      {feature}
    </li>
  );
}

export default Feature;
