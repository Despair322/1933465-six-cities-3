import type { CityName } from '../../../../types/types';

export type LocationProps = {
  city: CityName;
  isActive: boolean;
  onClick: (city: CityName) => void;
};
