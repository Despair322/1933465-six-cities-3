import { NumberOfStars } from '../constants/app';
import { CityNames } from '../constants/cities';
import { CityName, Point } from '../types/types';

function transformRatingToPercent(rating: number): number {
  return (Math.round(rating) / NumberOfStars * 100);
}

function transformDateToMonthYear(date: string): string {
  const dateObject = new Date(date);
  const month = dateObject.toLocaleString('en-US', { month: 'long' });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
}

export function mapToPoint<T extends Point>(input: T[]): Point[];
export function mapToPoint<T extends Point>(input: T): Point;

export function mapToPoint<T extends Point>(input: T | T[]): Point | Point[] {
  const toPoint = (item: T): Point => ({
    id: item.id,
    location: {
      latitude: item.location.latitude,
      longitude: item.location.longitude
    },
  });

  return Array.isArray(input) ? input.map(toPoint) : toPoint(input);
}

function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Args): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function getRandomCity(): CityName {
  return CityNames[Math.floor(Math.random() * CityNames.length)];
}

export { transformRatingToPercent, transformDateToMonthYear, debounce, getRandomCity };
