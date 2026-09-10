function transformRatingToPercent(rating: number): number {
  return (rating / 5 * 100);
}

function transformDateToMonthYear(date: string): string {
  const dateObject = new Date(date);
  const month = dateObject.toLocaleString('en-US', { month: 'long' });
  const year = dateObject.getFullYear();
  return `${month} ${year}`;
}

export { transformRatingToPercent, transformDateToMonthYear };
