import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import catalogReducer, { selectSortType } from '../../../../store/slices/catalog';
import favoritesReducer from '../../../../store/slices/favorites';
import detailedOfferReducer from '../../../../store/slices/detailedOffer';
import userReducer from '../../../../store/slices/user';
import { SORT_OPTIONS } from '../../../../constants';
import SortForm from './sort-form';

describe('SortForm', () => {
  it('opens the sort options and changes sort type after selection', () => {
    const store = configureStore({
      reducer: {
        catalog: catalogReducer,
        favorites: favoritesReducer,
        detailedOffer: detailedOfferReducer,
        user: userReducer,
      },
    });

    render(
      <Provider store={store}>
        <SortForm />
      </Provider>
    );

    const sortingType = document.querySelector('.places__sorting-type');
    expect(sortingType).toHaveTextContent('Popular');
    if (!sortingType) {
      throw new Error('Sorting type control was not rendered');
    }
    expect(sortingType).toHaveClass('places__sorting-type');
    expect(document.querySelector('.places__options')).not.toHaveClass('places__options--opened');

    fireEvent.click(sortingType);
    expect(document.querySelector('.places__options')).toHaveClass('places__options--opened');
    expect(screen.getByText('Price: low to high')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Price: low to high'));

    expect(selectSortType(store.getState())).toBe('price');
    expect(document.querySelector('.places__options')).not.toHaveClass('places__options--opened');
  });

  it('renders all supported sort options', () => {
    const store = configureStore({
      reducer: {
        catalog: catalogReducer,
        favorites: favoritesReducer,
        detailedOffer: detailedOfferReducer,
        user: userReducer,
      },
    });

    render(
      <Provider store={store}>
        <SortForm />
      </Provider>
    );

    SORT_OPTIONS.forEach(({ title }) => {
      expect(Array.from(document.querySelectorAll('.places__option')).some((option) =>
        option.textContent === title
      )).toBe(true);
    });
    expect(document.querySelector('.places__option--active')).toHaveTextContent('Popular');
  });
});
