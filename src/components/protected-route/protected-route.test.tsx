import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './protected-route';

function BackButton(): JSX.Element {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>Back</button>;
}

describe('ProtectedRoute', () => {
  it('renders its children when navigation is not required', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute isNavigate={false} navigateTo="/login">
                <h1>Private content</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Private content' })).toBeInTheDocument();
  });

  it('replaces the protected route with the redirect destination', () => {
    render(
      <MemoryRouter initialEntries={['/previous', '/private']} initialIndex={1}>
        <Routes>
          <Route path="/previous" element={<h1>Previous page</h1>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute isNavigate navigateTo="/login">
                <h1>Private content</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<BackButton />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Private content' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByRole('heading', { name: 'Previous page' })).toBeInTheDocument();
  });
});
