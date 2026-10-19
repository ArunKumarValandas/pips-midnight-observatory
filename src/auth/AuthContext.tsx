/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  verifyAndLogin,
  registerNewUser,
  getActiveSession,
  clearSession,
  seedDemoAccountsIfEmpty
} from './authService';

import { syncAuthSession } from '../services/apiService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await seedDemoAccountsIfEmpty();
        const session = getActiveSession();
        if (session) {
          setUser({
            id: session.userId,
            name: session.name,
            email: session.email,
            token: session.token
          });
          setIsAuthenticated(true);
          // Sync session with persistent server
          syncAuthSession(session);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to initialize starlight auth session:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await verifyAndLogin(email, password);
      if (result.success && result.session) {
        setUser({
          id: result.session.userId,
          name: result.session.name,
          email: result.session.email,
          token: result.session.token
        });
        setIsAuthenticated(true);
        syncAuthSession(result.session);
        return { success: true };
      }
      return { success: false, error: result.error || 'Authentication failed.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'A celestial error occurred. Please try again.' };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const result = await registerNewUser(name, email, password);
      if (result.success && result.session) {
        setUser({
          id: result.session.userId,
          name: result.session.name,
          email: result.session.email,
          token: result.session.token
        });
        setIsAuthenticated(true);
        syncAuthSession(result.session);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed.' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'A celestial error occurred during registration.' };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
