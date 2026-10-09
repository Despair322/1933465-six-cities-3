import { CityNames } from '../../../constants/cities';
import LocationItem from './location-item';
import type { LocationListProps } from './types';
import { memo } from 'react';

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
