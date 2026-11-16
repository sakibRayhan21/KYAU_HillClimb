import { SaveData } from './game';

export interface UserProfile {
  id: string; // e.g. "usr_173174..."
  name: string; // e.g. "Tanvir Ahmed"
  studentId: string; // e.g. "KYAU-CSE-2024-001"
  email: string; // e.g. "student@kyau.edu.bd"
  department: string; // e.g. "Computer Science & Engineering (CSE)"
  semester: number; // 1 to 8
  avatar: string; // e.g. "🎓", "🚗", "⚡", "🚀", "💻", "☕"
  createdAt: string;
  lastLoginAt: string;
  passwordHash: string;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface SignUpFormData {
  name: string;
  studentId: string;
  email: string;
  department: string;
  semester: number;
  password: string;
  confirmPassword: string;
  avatar?: string;
  migrateGuestProgress?: boolean;
}

export interface SignInFormData {
  identifier: string; // Email or Student ID
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}
