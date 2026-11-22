'use client';

// ============================================================================
// অথেন্টিকেশন কনটেক্সট প্রোভাইডার (Authentication Context & Hook)
// সমগ্র অ্যাপ্লিকেশনে লগইন অবস্থা (Authentication State), ব্যবহারকারীর প্রোফাইল,
// সাইন-ইন, সাইন-আপ, ডেমো লগইন ও সাইন-আউট ফাংশন রিঅ্যাক্ট কনটেক্সটের মাধ্যমে সরবরাহ করে।
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, SignInFormData, SignUpFormData, AuthResponse } from '../game/types/auth';
import { AuthService } from '../game/services/authService';

/**
 * অথেন্টিকেশন কনটেক্সটের ইন্টারফেস
 */
interface AuthContextType {
  user: UserProfile | null; // বর্তমান লগইন করা ব্যবহারকারী
  isAuthenticated: boolean; // ইউজার লগইন অবস্থায় আছে কিনা
  isLoading: boolean; // অথেন্টিকেশন চেক বা লোডিং স্টেট
  signIn: (data: SignInFormData) => Promise<AuthResponse>; // লগইন ফাংশন
  signUp: (data: SignUpFormData) => Promise<AuthResponse>; // রেজিস্ট্রেশন ফাংশন
  signOut: () => void; // সাইন আউট ফাংশন
  quickDemoLogin: () => Promise<AuthResponse>; // দ্রুত ডেমো লগইন
  refreshUser: () => void; // ইউজারের তথ্য রিফ্রেশ করা
}

// রিঅ্যাক্ট কনটেক্সট তৈরি
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * অথেন্টিকেশন প্রোভাইডার কম্পোনেন্ট
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // লোকালস্টোরেজ থেকে ইউজারের সেশন সিঙ্ক করা
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

  // মাউন্টে সেশন চেক এবং অথেন্টিকেশন পরিবর্তনের ইভেন্ট লিসেনার সেট করা
  useEffect(() => {
    syncUser();
    const unsubscribe = AuthService.onAuthChange(() => {
      syncUser();
    });
    return () => unsubscribe();
  }, []);

  // সাইন-ইন হ্যান্ডলার
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

  // সাইন-আপ হ্যান্ডলার
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

  // সাইন-আউট হ্যান্ডলার
  const signOut = () => {
    AuthService.signOut();
    setUser(null);
  };

  // ডেমো অ্যাকাউন্টে দ্রুত লগইন
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

  // প্রোফাইল পরিবর্তনের পর স্টেট রিফ্রেশ
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

/**
 * ব্যবহারকারীর অথেন্টিকেশন ডেটা ব্যবহারের কাস্টম হুক
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
