import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app';
import { store } from './store';
import { checkAuthAction } from './store/api-action';
import { getToken } from './services/token';
import { requireAuthorization } from './store/action';
import { AuthorizationStatus } from './constants/app';

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
