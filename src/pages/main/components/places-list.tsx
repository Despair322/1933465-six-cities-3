import { Offer } from '../../../types/offer';
import Card from '../../../components/shared/card';
import { CardVariants } from '../../../constants/app';

type PlacesListProps = {
  offers: Offer[];
  onHover?: (offerId: Offer | null) => void;
}

function PlacesList({ offers, onHover }: PlacesListProps): JSX.Element {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card key={offer.id} offer={offer} onHover={onHover} variant={CardVariants.Main} />
      ))}
    </div>
  );
}

export default PlacesList;
