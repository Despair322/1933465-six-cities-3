import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createAPI } from '../services';
import catalogReducer from './slices/catalog';
import favoritesReducer from './slices/favorites';
import userReducer from './slices/user';
import detailedOfferReducer from './slices/detailed-offer';

export const api = createAPI();

export const rootReducer = combineReducers({
  catalog: catalogReducer,
  favorites: favoritesReducer,
  user: userReducer,
  detailedOffer: detailedOfferReducer,
});

export const createTestStore = (preloadedState?: Partial<RootState>) => configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      }
    }),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      }
    }),
});

export type RootState = ReturnType<typeof store.getState>;
