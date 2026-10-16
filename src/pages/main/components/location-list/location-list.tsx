import { CityNames } from '../../../../constants';
import type { CityName } from '../../../../types/types';
import LocationItem from './location-item';
import { memo } from 'react';

type LocationListProps = {
  activeCity: CityName;
  onClick: (city: CityName) => void;
}

function LocationsList({ activeCity, onClick }: LocationListProps): JSX.Element {
  return (
    <ul className="locations__list tabs__list">
      {CityNames.map((city) => (
        <LocationItem key={city} city={city} isActive={city === activeCity} onClick={onClick} />
      ))}
    </ul>
  );
}

const MemoizedLocationsList = memo(LocationsList);

export default MemoizedLocationsList;
