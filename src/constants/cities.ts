export const CityNames = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf'
] as const;

export const DefaultCity = CityNames[3];

export const CityParam = 'city';

export type CityName = (typeof CityNames)[number];

