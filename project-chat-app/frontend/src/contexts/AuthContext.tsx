import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import * as authService from '../services/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string) => Promise<void>;
    register: (username: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedUser = authService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(username);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string) => {
        setIsLoading(true);
        try {
            const response = await authService.register(username);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
