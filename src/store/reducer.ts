import { createReducer } from '@reduxjs/toolkit';
import { setActiveCity, setSortType } from './action';
import { DefaultCity } from '../constants/cities';
import type { CityName, SortType } from '../types/types';

const initialState: { city: CityName; sortType: SortType } = { city: DefaultCity, sortType: 'popular' };

export const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setActiveCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setSortType, (state, action) => {
      state.sortType = action.payload;
    })
);
