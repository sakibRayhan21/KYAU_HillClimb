// ============================================================================
// অথেন্টিকেশন টাইপ ও ইন্টারফেস (Authentication Types & Interfaces)
// এই ফাইলে ব্যবহারকারীর প্রোফাইল, সাইন-ইন/সাইন-আপ ফর্ম এবং সেশন টাইপসমূহ ডিফাইন করা হয়েছে
// ============================================================================

import { SaveData } from './game';

/**
 * ব্যবহারকারীর প্রোফাইল ইন্টারফেস (User Profile)
 * শিক্ষার্থীর তথ্য এবং অ্যাকাউন্ট ডিটেইলস ধারণ করে
 */
export interface UserProfile {
  id: string; // ব্যবহারকারীর ইউনিক আইডি (যেমন: "usr_173174...")
  name: string; // শিক্ষার্থীর পুরো নাম (যেমন: "Tanvir Ahmed")
  studentId: string; // শিক্ষার্থীর রোল/আইডি নম্বর (যেমন: "KYAU-CSE-2024-001")
  email: string; // প্রাতিষ্ঠানিক বা ব্যক্তিগত ইমেইল (যেমন: "student@kyau.edu.bd")
  department: string; // বিভাগ (যেমন: "Computer Science & Engineering (CSE)")
  semester: number; // বর্তমান সেমিস্টার (১ থেকে ৮)
  avatar: string; // প্রোফাইল অবতার আইকন (যেমন: "🎓", "🚗", "⚡", "🚀", "💻", "☕")
  createdAt: string; // অ্যাকাউন্ট তৈরির সময় ও তারিখ
  lastLoginAt: string; // সর্বশেষ লগইনের সময় ও তারিখ
  passwordHash: string; // সিকিউরড হ্যাশড পাসওয়ার্ড
}

/**
 * সক্রিয় লগইন সেশন ইন্টারফেস (Active Login Session)
 */
export interface AuthSession {
  user: UserProfile; // বর্তমান লগইন করা ব্যবহারকারী
  token: string; // অথেনটিকেশন সেশন টোকেন
  createdAt: string; // সেশন শুরুর সময়
  expiresAt: string; // সেশনের মেয়াদ শেষের সময়
}

/**
 * রেজিস্ট্রেশন বা সাইন-আপ ফর্মের ডেটা ইন্টারফেস (Sign Up Form Data)
 */
export interface SignUpFormData {
  name: string; // শিক্ষার্থীর নাম
  studentId: string; // স্টুডেন্ট আইডি
  email: string; // ইমেইল ঠিকানা
  department: string; // ডিপার্টমেন্ট
  semester: number; // সেমিস্টার
  password: string; // পাসওয়ার্ড
  confirmPassword: string; // পাসওয়ার্ড নিশ্চিতকরণ
  avatar?: string; // সিলেক্ট করা অবতার
  migrateGuestProgress?: boolean; // গেস্ট হিসেবে খেলা প্রগ্রেস অ্যাকাউন্টে স্থানান্তর করার ফ্ল্যাগ
}

/**
 * লগইন ফর্মের ডেটা ইন্টারফেস (Sign In Form Data)
 */
export interface SignInFormData {
  identifier: string; // ইমেইল অথবা স্টুডেন্ট আইডি
  password: string; // পাসওয়ার্ড
  rememberMe: boolean; // রিমেম্বার মি চেকবক্স স্ট্যাটাস
}

/**
 * অথেন্টিকেশন অপারেশন রেসপন্স ইন্টারফেস (Auth Response)
 */
export interface AuthResponse {
  success: boolean; // অপারেশন সফল হয়েছে কিনা
  message: string; // ফলাফল বার্তা (সফল বা ত্রুটির বিবরণ)
  user?: UserProfile; // সফল হলে ব্যবহারকারীর তথ্য
}
