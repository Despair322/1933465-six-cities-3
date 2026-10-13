import { memo } from 'react';
import type { GoodsProps } from './goods.types';

function Goods({ goods }: GoodsProps): JSX.Element {
  return (
    <div className="offer__inside" >
      <h2 className="offer__inside-title">What&apos;s inside</h2>
      <ul className="offer__inside-list">
        {goods.map((good) => (
          <li key={good} className="offer__inside-item">
            {good}
          </li>
        ))}
      </ul>
    </div>
  );
}

const MemoizedGoods = memo(Goods);

export default MemoizedGoods;
