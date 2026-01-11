import type { AuthResponse, User } from '../types';

export const login = async (username: string): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!username) {
        throw new Error('Username is required');
    }

    // Mock successful login
    const token = `mock-token-${Date.now()}`;
    const user: User = {
        id: `user-${Date.now()}`,
        username,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
};

export const register = async (username: string): Promise<AuthResponse> => {
    // For this mock, register is same as login
    return login(username);
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};
