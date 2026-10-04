import { createAction } from '@reduxjs/toolkit';

export const favoriteStatusChanged = createAction<{
  id: string;
  isFavorite: boolean;
}>('favorite/statusChanged');
