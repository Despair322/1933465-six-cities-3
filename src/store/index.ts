import { configureStore } from '@reduxjs/toolkit';
import { createAPI } from '../services/api';
import catalogReducer from './slices/catalog';
import favoritesReducer from './slices/favorites';
import userReducer from './slices/user';
import detailedOfferReducer from './slices/detailedOffer';

export const api = createAPI();

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    favorites: favoritesReducer,
    user: userReducer,
    detailedOffer: detailedOfferReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      }
    }),
});
