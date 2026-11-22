// ============================================================================
// অথেন্টিকেশন সার্ভিস (Authentication Service)
// ব্যবহারকারী সাইন-ইন, সাইন-আপ, প্রোফাইল আপডেট, ডেমো লগইন, পাসওয়ার্ড হ্যাশিং
// এবং সেশন ম্যানেজমেন্ট হ্যান্ডেল করে। ডেটা ব্রাউজারের localStorage-এ সংরক্ষিত থাকে।
// ============================================================================

import { UserProfile, AuthSession, SignUpFormData, SignInFormData, AuthResponse } from '../types/auth';
import { StorageService, DEFAULT_SAVE_DATA } from './storageService';
import { SaveData } from '../types/game';

// লোকাল স্টোরেজ কী (Keys)
const USERS_STORAGE_KEY = 'university_survival_users_v1';
const SESSION_STORAGE_KEY = 'university_survival_session_v1';
const AUTH_EVENT_NAME = 'university_survival_auth_change';

// পাসওয়ার্ড অবফাসকেশন/হ্যাশিংয়ের জন্য সল্ট (Salt)
const HASH_SALT = 'kyau_cse_hill_climb_2026';

/**
 * পাসওয়ার্ড হ্যাশ করার ফাংশন (ক্লায়েন্ট সাইড সিকিউরিটি)
 */
function hashPassword(password: string): string {
  let hash = 0;
  const combined = HASH_SALT + password;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // ৩২-বিট ইন্টিজারে রূপান্তর
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + btoa(password).slice(0, 8);
}

/**
 * তাৎক্ষণিক টেস্ট করার জন্য ডিফল্ট ডেমো স্টুডেন্ট অ্যাকাউন্ট
 */
export const DEMO_USER: UserProfile = {
  id: 'usr_kyau_demo_001',
  name: 'Tanvir Hasan',
  studentId: 'KYAU-CSE-2024-001',
  email: 'student@kyau.edu.bd',
  department: 'Computer Science & Engineering (CSE)',
  semester: 3,
  avatar: '🎓',
  createdAt: '2026-01-15T09:00:00.000Z',
  lastLoginAt: '2026-11-16T12:00:00.000Z',
  passwordHash: hashPassword('password123'),
};

export class AuthService {
  /** ব্রাউজার এনভায়রনমেন্ট সক্রিয় কিনা যাচাই করে */
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // --------------------------------------------------------------------------
  // ব্যবহারকারী রিপোজিটরি (User Repository - localStorage)
  // --------------------------------------------------------------------------

  /**
   * সংরক্ষিত সমস্ত ব্যবহারকারীর তালিকা নিয়ে আসে
   */
  public static getAllUsers(): UserProfile[] {
    if (!this.isBrowser()) return [DEMO_USER];

    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        // প্রথমবার ওপেন করলে ডেমো স্টুডেন্ট অ্যাকাউন্ট তৈরি করে দেওয়া হয়
        const initialUsers = [DEMO_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        
        // ডেমো অ্যাকাউন্টের জন্য প্রারম্ভিক গেম সেভ ডেটা সেট করা (সেমিস্টার ৩ আনলকড ও কয়েনসহ)
        const demoSaveKey = `university_survival_save_${DEMO_USER.id}`;
        if (!localStorage.getItem(demoSaveKey)) {
          const demoSave: SaveData = {
            ...DEFAULT_SAVE_DATA,
            currentSemester: 3,
            unlockedSemesters: 3,
            coins: 350,
            academicPower: 85,
            cgpa: 3.82,
            totalCredits: 36,
            upgrades: {
              engine: 3,
              fuelTank: 3,
              suspension: 2,
              armor: 2,
              weapon: 2,
              turbo: 2,
            },
            transcript: [
              {
                semesterNumber: 1,
                semesterTitle: 'Orientation & Freshman Basics',
                gpa: 3.75,
                grade: 'A',
                credits: 18,
                completedAt: '2026-03-20',
                courses: [
                  { code: 'CSE-101', title: 'Structured Programming Language (C)', credits: 3, grade: 'A+', gpa: 4.0, score: 92 },
                  { code: 'CSE-102', title: 'Structured Programming Lab', credits: 1.5, grade: 'A+', gpa: 4.0, score: 95 },
                  { code: 'MATH-101', title: 'Differential and Integral Calculus', credits: 3, grade: 'A', gpa: 3.75, score: 84 },
                  { code: 'ENG-101', title: 'English Language Skills', credits: 3, grade: 'B+', gpa: 3.25, score: 72 },
                ],
              },
              {
                semesterNumber: 2,
                semesterTitle: 'Data Structures & Algorithms',
                gpa: 3.88,
                grade: 'A+',
                credits: 18,
                completedAt: '2026-07-15',
                courses: [
                  { code: 'CSE-201', title: 'Data Structures & Algorithms', credits: 3, grade: 'A+', gpa: 4.0, score: 94 },
                  { code: 'CSE-202', title: 'Data Structures Lab', credits: 1.5, grade: 'A+', gpa: 4.0, score: 96 },
                  { code: 'CSE-203', title: 'Discrete Mathematics', credits: 3, grade: 'A', gpa: 3.75, score: 85 },
                  { code: 'MATH-102', title: 'Linear Algebra & Matrices', credits: 3, grade: 'A', gpa: 3.75, score: 83 },
                ],
              },
            ],
          };
          localStorage.setItem(demoSaveKey, JSON.stringify(demoSave));
        }

        return initialUsers;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse users list:', e);
      return [DEMO_USER];
    }
  }

  /**
   * ব্যবহারকারী তালিকা লোকাল স্টোরেজে সংরক্ষণ করে
   */
  private static saveAllUsers(users: UserProfile[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users list:', e);
    }
  }

  // --------------------------------------------------------------------------
  // সেশন ম্যানেজমেন্ট (Session Management)
  // --------------------------------------------------------------------------

  /**
   * বর্তমান সক্রিয় লগইন সেশন নিয়ে আসে (মেয়াদোত্তীর্ণ হলে সাইন-আউট করে)
   */
  public static getSession(): AuthSession | null {
    if (!this.isBrowser()) return null;

    try {
      // প্রথমে localStorage, না পেলে sessionStorage চেক করে
      const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      // সেশনের মেয়াদ উত্তীর্ণ হয়েছে কিনা যাচাই করা
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.signOut();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  /**
   * বর্তমান লগইন করা ব্যবহারকারী নিয়ে আসে
   */
  public static getCurrentUser(): UserProfile | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  /**
   * ব্যবহারকারীর জন্য নতুন সেশন টোকেন তৈরি ও সংরক্ষণ করে
   */
  private static setSession(user: UserProfile, rememberMe: boolean = true): AuthSession {
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();
    const session: AuthSession = {
      user,
      token: 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    if (this.isBrowser()) {
      if (rememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
      
      // StorageService-এ সক্রিয় ইউজার আইডি সেট করা (যাতে আলাদা প্রোফাইলে গেম সেভ থাকে)
      StorageService.setActiveUser(user.id);
      
      // পরিবর্তন নোটিফাই করা
      this.notifyAuthChange();
    }

    return session;
  }

  // --------------------------------------------------------------------------
  // সাইন-ইন বা লগইন মেথড (Sign In)
  // --------------------------------------------------------------------------
  public static signIn(data: SignInFormData): AuthResponse {
    if (!this.isBrowser()) {
      return { success: false, message: 'Client environment unavailable' };
    }

    const { identifier, password, rememberMe } = data;
    const cleanId = (identifier || '').trim().toLowerCase();

    // ইনপুট ভ্যালিডেশন
    if (!cleanId) {
      return { success: false, message: 'Please enter your Student ID or Email' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password' };
    }

    const users = this.getAllUsers();
    // ইমেইল বা স্টুডেন্ট আইডি দিয়ে ব্যবহারকারী খোঁজা
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.studentId.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, message: 'No student account found with this ID or Email' };
    }

    // পাসওয়ার্ড যাচাই
    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // শেষ লগইনের সময় আপডেট
    user.lastLoginAt = new Date().toISOString();
    this.saveAllUsers(users);

    // সেশন তৈরি
    this.setSession(user, rememberMe);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
    };
  }

  // --------------------------------------------------------------------------
  // সাইন-আপ বা নতুন অ্যাকাউন্ট নিবন্ধন (Sign Up)
  // --------------------------------------------------------------------------
  public static signUp(data: SignUpFormData): AuthResponse {
    if (!this.isBrowser()) {
      return { success: false, message: 'Client environment unavailable' };
    }

    const name = (data.name || '').trim();
    const studentId = (data.studentId || '').trim();
    const email = (data.email || '').trim().toLowerCase();
    const department = (data.department || 'Computer Science & Engineering (CSE)').trim();
    const semester = Math.max(1, Math.min(8, Number(data.semester) || 1));
    const avatar = data.avatar || '🎓';
    const password = data.password || '';
    const confirmPassword = data.confirmPassword || '';

    // ফর্ম ফিল্ড ভ্যালিডেশন
    if (name.length < 2) {
      return { success: false, message: 'Full Name must be at least 2 characters long' };
    }

    if (studentId.length < 3) {
      return { success: false, message: 'Valid Student ID / Roll Number is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    const users = this.getAllUsers();

    // একই ইমেইলে আগে অ্যাকাউন্ট আছে কিনা চেক
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    // একই স্টুডেন্ট আইডিতে অ্যাকাউন্ট আছে কিনা চেক
    if (users.some((u) => u.studentId.toLowerCase() === studentId.toLowerCase())) {
      return { success: false, message: 'An account with this Student ID already exists. Please Sign In.' };
    }

    // নতুন ইউজার প্রোফাইল তৈরি
    const userId = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newUser: UserProfile = {
      id: userId,
      name,
      studentId,
      email,
      department,
      semester,
      avatar,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      passwordHash: hashPassword(password),
    };

    // তালিকায় যুক্ত ও সেভ করা
    users.push(newUser);
    this.saveAllUsers(users);

    // ইউজারের গেম সেভ ডেটা ইনিশিয়ালাইজেশন
    const userSaveKey = `university_survival_save_${newUser.id}`;
    if (data.migrateGuestProgress) {
      // গেস্ট হিসেবে খেলার অগ্রগতি নতুন অ্যাকাউন্টে মাইগ্রেট করা
      const guestSave = StorageService.loadGuestSave();
      localStorage.setItem(userSaveKey, JSON.stringify({
        ...guestSave,
        currentSemester: Math.max(guestSave.currentSemester, semester),
      }));
    } else {
      // নতুন শিক্ষার্থীর জন্য প্রারম্ভিক সেভ ডেটা
      const initialSave: SaveData = {
        ...DEFAULT_SAVE_DATA,
        currentSemester: semester,
        unlockedSemesters: semester,
      };
      localStorage.setItem(userSaveKey, JSON.stringify(initialSave));
    }

    // অটোমেটিক লগইন সেশন সেট করা
    this.setSession(newUser, true);

    return {
      success: true,
      message: `Account created successfully! Welcome to KYAU, ${newUser.name}.`,
      user: newUser,
    };
  }

  // --------------------------------------------------------------------------
  // দ্রুত ডেমো লগইন (Quick Demo Login - টেস্ট করার সুবিধার্থে)
  // --------------------------------------------------------------------------
  public static quickDemoLogin(): AuthResponse {
    const users = this.getAllUsers();
    let demoUser = users.find((u) => u.id === DEMO_USER.id || u.email === DEMO_USER.email);
    if (!demoUser) {
      demoUser = { ...DEMO_USER };
      users.push(demoUser);
      this.saveAllUsers(users);
    }

    return this.signIn({
      identifier: demoUser.email,
      password: 'password123',
      rememberMe: true,
    });
  }

  // --------------------------------------------------------------------------
  // সাইন-আউট মেথড (Sign Out)
  // --------------------------------------------------------------------------
  public static signOut(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    // স্টোরেজ সার্ভিসকে পুনরায় গেস্ট মোডে ফিরিয়ে দেওয়া
    StorageService.setActiveUser(null);

    this.notifyAuthChange();
  }

  // --------------------------------------------------------------------------
  // প্রোফাইল আপডেট মেথড (Update Profile)
  // --------------------------------------------------------------------------
  public static updateProfile(updates: Partial<Pick<UserProfile, 'name' | 'department' | 'avatar'>>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;

    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === current.id);
    if (index === -1) return null;

    const updated: UserProfile = {
      ...users[index],
      ...updates,
    };

    users[index] = updated;
    this.saveAllUsers(users);

    // সক্রিয় সেশনের তথ্যও আপডেট করা
    const session = this.getSession();
    if (session) {
      session.user = updated;
      const isLocal = !!localStorage.getItem(SESSION_STORAGE_KEY);
      if (isLocal) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      }
    }

    this.notifyAuthChange();
    return updated;
  }

  // --------------------------------------------------------------------------
  // অথেন্টিকেশন ইভেন্ট হ্যান্ডলিং ও নোটিফিকেশন (Event Listeners)
  // --------------------------------------------------------------------------
  private static notifyAuthChange(): void {
    if (!this.isBrowser()) return;
    try {
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME));
    } catch (e) {
      // ব্রাউজার ছাড়া অন্য এনভায়রনমেন্টে এড়িয়ে যাওয়া হয়
    }
  }

  /**
   * অথেন্টিকেশন পরিবর্তনের ইভেন্ট লিসেনার রেজিস্টার করার মেথড
   */
  public static onAuthChange(callback: () => void): () => void {
    if (!this.isBrowser()) return () => {};
    window.addEventListener(AUTH_EVENT_NAME, callback);
    return () => window.removeEventListener(AUTH_EVENT_NAME, callback);
  }
}
