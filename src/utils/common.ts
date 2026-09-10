import { AuthorizationStatus, numberOfStars } from '../const';

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

export { transformRatingToPercent, transformDateToMonthYear, getAuthorizationStatus };
