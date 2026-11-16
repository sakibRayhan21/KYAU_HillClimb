import { UserProfile, AuthSession, SignUpFormData, SignInFormData, AuthResponse } from '../types/auth';
import { StorageService, DEFAULT_SAVE_DATA } from './storageService';
import { SaveData } from '../types/game';

const USERS_STORAGE_KEY = 'university_survival_users_v1';
const SESSION_STORAGE_KEY = 'university_survival_session_v1';
const AUTH_EVENT_NAME = 'university_survival_auth_change';

// Simple salt for obfuscating stored passwords in client storage
const HASH_SALT = 'kyau_cse_hill_climb_2026';

function hashPassword(password: string): string {
  let hash = 0;
  const combined = HASH_SALT + password;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + btoa(password).slice(0, 8);
}

// Default seeded demo student account for instant testing
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
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // --------------------------------------------------------------------------
  // USER REPOSITORY (Stored in localStorage)
  // --------------------------------------------------------------------------
  public static getAllUsers(): UserProfile[] {
    if (!this.isBrowser()) return [DEMO_USER];

    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        // Seed initial demo student account
        const initialUsers = [DEMO_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        
        // Seed demo save data with semester 3 unlocked, higher coins, and academic power
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

  private static saveAllUsers(users: UserProfile[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users list:', e);
    }
  }

  // --------------------------------------------------------------------------
  // AUTH SESSION MANAGEMENT
  // --------------------------------------------------------------------------
  public static getSession(): AuthSession | null {
    if (!this.isBrowser()) return null;

    try {
      // Check localStorage first, then sessionStorage
      const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      // Check expiry (7 days)
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.signOut();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  public static getCurrentUser(): UserProfile | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

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
      
      // Update active user in StorageService so all saves are isolated
      StorageService.setActiveUser(user.id);
      
      // Notify application of auth change
      this.notifyAuthChange();
    }

    return session;
  }

  // --------------------------------------------------------------------------
  // SIGN IN
  // --------------------------------------------------------------------------
  public static signIn(data: SignInFormData): AuthResponse {
    if (!this.isBrowser()) {
      return { success: false, message: 'Client environment unavailable' };
    }

    const { identifier, password, rememberMe } = data;
    const cleanId = (identifier || '').trim().toLowerCase();

    if (!cleanId) {
      return { success: false, message: 'Please enter your Student ID or Email' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password' };
    }

    const users = this.getAllUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.studentId.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, message: 'No student account found with this ID or Email' };
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.saveAllUsers(users);

    // Set session
    this.setSession(user, rememberMe);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
    };
  }

  // --------------------------------------------------------------------------
  // SIGN UP / REGISTRATION
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

    // Validation
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

    // Check for existing user by email
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    // Check for existing user by student ID
    if (users.some((u) => u.studentId.toLowerCase() === studentId.toLowerCase())) {
      return { success: false, message: 'An account with this Student ID already exists. Please Sign In.' };
    }

    // Create new UserProfile
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

    // Save to user registry
    users.push(newUser);
    this.saveAllUsers(users);

    // Initialize User Game Save Data
    const userSaveKey = `university_survival_save_${newUser.id}`;
    if (data.migrateGuestProgress) {
      // Migrate whatever guest progress was in memory/localStorage
      const guestSave = StorageService.loadGuestSave();
      localStorage.setItem(userSaveKey, JSON.stringify({
        ...guestSave,
        currentSemester: Math.max(guestSave.currentSemester, semester),
      }));
    } else {
      // Fresh starter progress for this student
      const initialSave: SaveData = {
        ...DEFAULT_SAVE_DATA,
        currentSemester: semester,
        unlockedSemesters: semester,
      };
      localStorage.setItem(userSaveKey, JSON.stringify(initialSave));
    }

    // Automatically authenticate new user
    this.setSession(newUser, true);

    return {
      success: true,
      message: `Account created successfully! Welcome to KYAU, ${newUser.name}.`,
      user: newUser,
    };
  }

  // --------------------------------------------------------------------------
  // QUICK DEMO LOGIN (For fast testing & review)
  // --------------------------------------------------------------------------
  public static quickDemoLogin(): AuthResponse {
    // Ensure demo user exists
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
  // SIGN OUT
  // --------------------------------------------------------------------------
  public static signOut(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    // Switch StorageService back to guest mode
    StorageService.setActiveUser(null);

    this.notifyAuthChange();
  }

  // --------------------------------------------------------------------------
  // UPDATE USER PROFILE
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

    // Update active session
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
  // EVENT NOTIFICATION
  // --------------------------------------------------------------------------
  private static notifyAuthChange(): void {
    if (!this.isBrowser()) return;
    try {
      window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME));
    } catch (e) {
      // Ignored in non-browser environments
    }
  }

  public static onAuthChange(callback: () => void): () => void {
    if (!this.isBrowser()) return () => {};
    window.addEventListener(AUTH_EVENT_NAME, callback);
    return () => window.removeEventListener(AUTH_EVENT_NAME, callback);
  }
}
