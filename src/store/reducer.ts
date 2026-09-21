import { createReducer } from '@reduxjs/toolkit';
import { changeCity } from './action';
import { DefaultCity } from '../constants/cities';
import type { CityName } from '../types/types';

const initialState: CityName = DefaultCity;

export const reducer = createReducer<CityName>(initialState, (builder) =>
  builder
    .addCase(changeCity, (_state, action) => action.payload)
);
