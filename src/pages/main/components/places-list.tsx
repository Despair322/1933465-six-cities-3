import { Offer } from '../../../types/offer';
import Card from './card';

type PlacesListProps = {
  offers: Offer[];
  onHover?: (offerId: string | null) => void;
}

function PlacesList({ offers, onHover }: PlacesListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card key={offer.id} offer={offer} onHover={onHover} />
      ))}
    </div>
  );
}

export default PlacesList;
