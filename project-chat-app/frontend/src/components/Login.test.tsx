import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Login } from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login Component', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows error on empty submission', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );

        // Get the form and submit it directly to bypass HTML5 validation
        const form = screen.getByRole('button', { name: /sign in/i }).closest('form');

        // Submit with empty input (bypassing required attribute)
        fireEvent.submit(form!);

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        });
    });

    it('allows login with valid username', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText(/username/i);
        fireEvent.change(input, { target: { value: 'testuser' } });

        const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
        fireEvent.submit(form!);

        // Wait for loading state to complete
        await waitFor(() => {
            expect(input).not.toBeDisabled();
        });
    });
});
