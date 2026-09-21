import { createAction } from '@reduxjs/toolkit';
import type { CityName } from '../types/types';

export const changeCity = createAction<CityName>('changeCity');
