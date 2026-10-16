import { AppRoute, CityNames, SORT_OPTIONS } from '../constants';

export type StringRouteValues = Extract<
  (typeof AppRoute)[keyof typeof AppRoute],
  string
>;

export type StringRouteKeys = StringRouteValues | '*';

export type Point = {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export type CityName = (typeof CityNames)[number];

export type SortType = typeof SORT_OPTIONS[number]['value'];
