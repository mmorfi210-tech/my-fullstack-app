import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Mock the Auth Context
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  it('renders loading spinner when auth loading is true', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>);
    expect(screen.getByText(/Restoring secure session.../i)).toBeInTheDocument();
  });

  it('does not render children when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div data-testid="protected">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' }, loading: false });
    render(
      <MemoryRouter initialEntries={['/']}>
        <ProtectedRoute>
          <div data-testid="protected">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
