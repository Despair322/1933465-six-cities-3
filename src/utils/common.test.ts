import { afterEach, describe, expect, it, vi } from 'vitest';
import { CityNames } from '../constants';
import type { Point } from '../types/types';
import { debounce, getRandomCity, mapToPoint, transformDateToMonthYear, transformRatingToPercent } from './common';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('transformRatingToPercent', () => {
  it.each([
    [0, 0],
    [2.4, 40],
    [2.5, 60],
    [4.9, 100],
  ])('rounds rating %s and converts it to a percentage', (rating, expected) => {
    expect(transformRatingToPercent(rating)).toBe(expected);
  });
});

describe('transformDateToMonthYear', () => {
  it('formats a date as an English month and year', () => {
    expect(transformDateToMonthYear('2020-03-15T12:00:00')).toBe('March 2020');
  });
});

describe('mapToPoint', () => {
  const offerPoint: Point & { extra: string } = {
    id: 'offer-1',
    location: { latitude: 48.85, longitude: 2.35 },
    extra: 'not copied',
  };

  it('maps a single item to its point data', () => {
    expect(mapToPoint(offerPoint)).toEqual({
      id: 'offer-1',
      location: { latitude: 48.85, longitude: 2.35 },
    });
  });

  it('maps an array of items to point data', () => {
    expect(mapToPoint([offerPoint, { ...offerPoint, id: 'offer-2' }])).toEqual([
      { id: 'offer-1', location: { latitude: 48.85, longitude: 2.35 } },
      { id: 'offer-2', location: { latitude: 48.85, longitude: 2.35 } },
    ]);
  });
});

describe('debounce', () => {
  it('calls once with the latest arguments after the delay', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debouncedCallback = debounce(callback, 300);

    debouncedCallback('first');
    debouncedCallback('latest');

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('latest');
  });
});

describe('getRandomCity', () => {
  it('returns the first city when random is zero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    expect(getRandomCity()).toBe(CityNames[0]);
  });

  it('can return the last city', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);

    expect(getRandomCity()).toBe(CityNames[CityNames.length - 1]);
  });
});
