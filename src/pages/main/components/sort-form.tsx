import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { SORT_OPTIONS } from '../../../constants/app';
import type { SortType } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { changeSortType } from '../../../store/action';

function SortForm(): JSX.Element {
  const activeSortType = useAppSelector((state) => state.sortType);
  const activeSortText = SORT_OPTIONS.find(({ value }) => value === activeSortType)?.title;
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (evt: MouseEvent) => {
    if (evt.target !== document.querySelector('.places__sorting-type')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const handleOptionClick = (sortType: SortType) => {
    setIsOpen(false);
    dispatch(changeSortType(sortType));
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0} onClick={handleClick}>
        {activeSortText}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={classNames('places__options places__options--custom', { 'places__options--opened': isOpen })}>

        {SORT_OPTIONS.map(({ value, title }) => (
          <li key={value} className={classNames('places__option', { 'places__option--active': value === activeSortType })}
            value={value} tabIndex={0}
            onClick={() => handleOptionClick(value)}
          >
            {title}
          </li>
        ))}

      </ul>
    </form>
  );
}

export default SortForm;
