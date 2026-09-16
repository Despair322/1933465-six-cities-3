import { AuthorizationStatus, numberOfStars } from '../constants/app';
import { Point } from '../types/types';

function transformRatingToPercent(rating: number): number {
  return (rating / numberOfStars * 100);
}

function transformDateToMonthYear(date: string): string {
  const dateObject = new Date(date);
  const month = dateObject.toLocaleString('en-US', { month: 'long' });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
}

function getAuthorizationStatus(): AuthorizationStatus {
  return AuthorizationStatus.Auth;
}

export function mapToPoint<T extends Point>(input: T[]): Point[];
export function mapToPoint<T extends Point>(input: T): Point;

export function mapToPoint<T extends Point>(input: T | T[]): Point | Point[] {
  const toPoint = (item: T) : Point => ({
    id: item.id,
    location: item.location,
  });

  return Array.isArray(input) ? input.map(toPoint) : toPoint(input);
}

export { transformRatingToPercent, transformDateToMonthYear, getAuthorizationStatus };
