import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTestStore, RootState } from '../src/store';

interface CustomHooksConfig {
  initialState?: Partial<RootState>;
  initialEntries?: string[];
}

beforeMount<CustomHooksConfig>(({ App, hooksConfig }) => {
  const store = createTestStore(hooksConfig?.initialState);

  return Promise.resolve(
    <Provider store={store}>
      <MemoryRouter initialEntries={hooksConfig?.initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>
  );
});
