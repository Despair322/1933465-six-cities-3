import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app';
import { store } from './store';
import { getToken } from './services/token';
import { AuthorizationStatus } from './constants/app';
import { checkAuthAction } from './store/thunks/user';
import { requireAuthorization } from './store/slices/user';

const token = getToken();
if (token) {
  store.dispatch(checkAuthAction());
}else{
  store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
