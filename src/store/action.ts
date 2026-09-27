import { createAction } from '@reduxjs/toolkit';
import type { CityName, SortType } from '../types/types';

export const setActiveCity = createAction<CityName>('main/setActiveCity');
export const setSortType = createAction<SortType>('main/setSortType');
