import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSortType, resetCity, resetSortType } from './action';
import { DefaultCity } from '../constants/cities';
import type { CityName, SortType } from '../types/types';

const initialState: { city: CityName; sortType: SortType } = { city: DefaultCity, sortType: 'popular' };

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(changeSortType, (state, action) => {
      state.sortType = action.payload;
    })
    .addCase(resetCity, (state) => {
      state.city = DefaultCity;
    })
    .addCase(resetSortType, (state) => {
      state.sortType = 'popular';
    })
);
