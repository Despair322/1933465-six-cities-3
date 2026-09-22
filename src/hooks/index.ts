import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, State} from '../types/store';


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
