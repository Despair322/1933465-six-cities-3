import { lazy } from 'react';

const LazyCitiesMap = lazy(() => import('./cities-map'));

export default LazyCitiesMap;
