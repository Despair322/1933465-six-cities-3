import { CityName } from '../../../../types/types';

export type LocationListProps = {
  activeCity: CityName;
  onClick: (city: CityName) => void;
}
