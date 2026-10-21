import { AppRoute, CITY_NAMES, SORT_OPTIONS } from '../constants';

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

export type CityName = (typeof CITY_NAMES)[number];

export type SortType = typeof SORT_OPTIONS[number]['value'];
