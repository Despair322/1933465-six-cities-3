import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import useMap from './use-map';
import type { AppDispatch, State } from '../types';


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
export { useMap };
