'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, SignInFormData, SignUpFormData, AuthResponse } from '../game/types/auth';
import { AuthService } from '../game/services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInFormData) => Promise<AuthResponse>;
  signUp: (data: SignUpFormData) => Promise<AuthResponse>;
  signOut: () => void;
  quickDemoLogin: () => Promise<AuthResponse>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncUser = () => {
    try {
      const current = AuthService.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.warn('Failed to sync auth user:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncUser();
    const unsubscribe = AuthService.onAuthChange(() => {
      syncUser();
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (data: SignInFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = AuthService.signIn(data);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = AuthService.signUp(data);
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    AuthService.signOut();
    setUser(null);
  };

  const quickDemoLogin = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = AuthService.quickDemoLogin();
      if (res.success && res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = () => {
    syncUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        quickDemoLogin,
        refreshUser,
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
