import { createAction } from '@reduxjs/toolkit';
import type { CityName, SortType } from '../types/types';

export const changeCity = createAction<CityName>('changeCity');
export const resetCity = createAction('resetCity');
export const changeSortType = createAction<SortType>('changeSortType');
export const resetSortType = createAction('resetSortType');
