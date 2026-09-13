import { CityNames } from '../../../constants/cities';
import LocationItem from './location-item';

type LocationListProps = {
  activeCity: string;
};

function LocationsList({ activeCity }: LocationListProps): JSX.Element {
  return (
    <ul className="locations__list tabs__list">
      {CityNames.map((city) => (
        <LocationItem key={city} city={city} isActive={city === activeCity} />
      ))}
    </ul>
  );
}

export default LocationsList;
