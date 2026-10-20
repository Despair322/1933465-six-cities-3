import { useAppSelector } from '../../hooks';
import { selectActiveCity } from '../../store/slices/catalog';
import LocationItem from '../../pages/favorites/components/location-item/location-item';

function LocationItemTestStory(): JSX.Element {
  const activeCity = useAppSelector(selectActiveCity);

  return (
    <>
      <LocationItem city="Amsterdam" />
      <output aria-label="Active city">{activeCity}</output>
    </>
  );
}

export default LocationItemTestStory;
