import { memo } from 'react';
import type { Host } from '../../../../types/detailed-offer';
import classNames from 'classnames';

type HostProps = {
  host: Host;
  description: string;
}

function OfferHost({ host, description }: HostProps): JSX.Element {
  const { avatarUrl, name, isPro } = host;

  return (
    <div className="offer__host">
      <h2 className="offer__host-title">Meet the host</h2>
      <div className="offer__host-user user">
        <div className={classNames('offer__avatar-wrapper', { 'offer__avatar-wrapper--pro': isPro }, 'user__avatar-wrapper')}>
          <img className="offer__avatar user__avatar" src={avatarUrl} width="74" height="74" alt="Host avatar" />
        </div>
        <span className="offer__user-name">
          {name}
        </span>
        {isPro && <span className="offer__user-status">Pro</span>}
      </div>
      <div className="offer__description">
        <p className="offer__text">
          {description}
        </p>
      </div>
    </div>
  );
}

const MemoizedOfferHost = memo(OfferHost);

export default MemoizedOfferHost;
