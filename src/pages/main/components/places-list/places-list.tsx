import { memo } from 'react';
import Card from '../../../../components/card/card';
import { CardVariants } from '../../../../constants';
import type { Offer } from '../../../../types';

type PlacesListProps = {
  offers: Offer[];
  onMouseEnter?: (offerId: string | null) => void;
  onMouseLeave?: () => void;
};

function PlacesList({ offers, onMouseEnter, onMouseLeave}: PlacesListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card key={offer.id} offer={offer} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} variant={CardVariants.Main} />
      ))}
    </div>
  );
}

const MemoizedPlacesList = memo(PlacesList);

export default MemoizedPlacesList;
