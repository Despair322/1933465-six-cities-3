import type { FeatureProps } from '../../../types/components';

function Features({ goods }: FeatureProps): JSX.Element {
  return (
    <div className="offer__inside" >
      <h2 className="offer__inside-title">What&apos;s inside</h2>
      <ul className="offer__inside-list">
        {goods.map((feature) => (
          <li key={feature} className="offer__inside-item">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Features;
