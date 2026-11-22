// ============================================================================
// সেমিস্টার কনফিগারেশন ফাইল (Semesters Configuration)
// খাজা ইউনুস আলী বিশ্ববিদ্যালয়ের ৪ বছরের সিএসই কারিকুলাম (১ম থেকে ৮ম সেমিস্টার)।
// প্রতিটি সেমিস্টারের কোর্স, ক্রেডিট, থিম কালার, পাহাড়ি ট্র্যাকের খাড়াই এবং বাধার পুল।
// ============================================================================

import { SemesterInfo } from '../types/game';

export const SEMESTERS_CONFIG: SemesterInfo[] = [
  // --------------------------------------------------------------------------
  // ১ম সেমিস্টার: বিশ্ববিদ্যালয়ে নতুন জীবন (নবীন পর্ব)
  // --------------------------------------------------------------------------
  {
    id: 1,
    number: 1,
    title: 'First Semester: New University Life',
    tagline: 'Freshman Orientation, Campus Buzz & Excitement',
    description: 'Welcome to KYAU CSE! Everything is fresh and shiny, but university life is fast-paced. Learn to balance classes, new friends, and your vehicle!',
    targetDistance: 900, // পাস করার জন্য ৯০০ মিটার ড্রাইভ
    theme: {
      skyColor: 0x6ee7b7, // হালকা পান্না সবুজ আকাশ
      skyBottomColor: 0xdcfce7,
      hillPrimary: 0x15803d, // সতেজ সবুজ পাহাড়
      hillSecondary: 0x166534,
      accentColor: '#10b981',
      bgElements: 'campus',
    },
    // ১ম সেমিস্টারের কোর্স তালিকা
    courses: [
      { code: 'CSE-111', title: 'Introduction to Computer Systems', credits: 3 },
      { code: 'CSE-112', title: 'Structured Programming Language (C)', credits: 3 },
      { code: 'MATH-111', title: 'Differential and Integral Calculus', credits: 3 },
      { code: 'ENG-111', title: 'English Fundamentals', credits: 2 },
    ],
    // বাধার সম্ভাব্যতা পুল
    obstaclePool: [
      { type: 'socialMedia', weight: 4 }, // সামাজিক যোগাযোগ মাধ্যমের মোহ
      { type: 'laziness', weight: 4 }, // নবীন আলসেমি
      { type: 'assignmentDeadline', weight: 2 }, // প্রাথমিক অ্যাসাইনমেন্ট
    ],
    spawnIntervalMeters: 90,
    hillSteepness: 0.003,
    hillRoughness: 45,
  },

  // --------------------------------------------------------------------------
  // ২য় সেমিস্টার: সম্পর্ক ও অলসতা (ক্যাম্পাস রোম্যান্স ও সিজিপিএ সতর্কতা)
  // --------------------------------------------------------------------------
  {
    id: 2,
    number: 2,
    title: 'Second Semester: Relationship and Laziness',
    tagline: 'Campus Crushes, Late Morning Sleeps & GPA Warning',
    description: 'You survived freshman month, but romance and cozy hostel naps are draining your fuel tank! Stay focused on your code.',
    targetDistance: 1100, // ১১০০ মিটার
    theme: {
      skyColor: 0xfbcfe8, // মিষ্টি গোলাপি আকাশ
      skyBottomColor: 0xfef2f2,
      hillPrimary: 0x047857,
      hillSecondary: 0x065f46,
      accentColor: '#ec4899',
      bgElements: 'campus',
    },
    courses: [
      { code: 'CSE-121', title: 'Object-Oriented Programming (Java/C++)', credits: 3 },
      { code: 'CSE-122', title: 'Discrete Mathematics', credits: 3 },
      { code: 'PHY-121', title: 'Physics (Electricity & Waves)', credits: 3 },
      { code: 'MATH-121', title: 'Coordinate Geometry & Matrices', credits: 3 },
    ],
    obstaclePool: [
      { type: 'relationship', weight: 5 }, // প্রেমের পিছুটান
      { type: 'laziness', weight: 4 },
      { type: 'socialMedia', weight: 3 },
      { type: 'assignmentDeadline', weight: 2 },
    ],
    spawnIntervalMeters: 80,
    hillSteepness: 0.004,
    hillRoughness: 55,
  },

  // --------------------------------------------------------------------------
  // ৩য় সেমিস্টার: প্রোগ্রামিংয়ের চাপ (ডেটা স্ট্রাকচার ও পয়েন্টার ভীতি)
  // --------------------------------------------------------------------------
  {
    id: 3,
    number: 3,
    title: 'Third Semester: Programming Pressure',
    tagline: 'Pointers, Linked Lists, Segmentation Faults & Panic',
    description: 'Data Structures and Algorithms will test your engine. Bugs emerge like landmines on steep hills! Arm your weapon to debug obstacles ahead.',
    targetDistance: 1300, // ১৩০০ মিটার
    theme: {
      skyColor: 0x93c5fd, // টেক ব্লু আকাশ
      skyBottomColor: 0xe0e7ff,
      hillPrimary: 0x0284c7,
      hillSecondary: 0x0369a1,
      accentColor: '#3b82f6',
      bgElements: 'coding_lab',
    },
    courses: [
      { code: 'CSE-211', title: 'Data Structures', credits: 3 },
      { code: 'CSE-212', title: 'Data Structures Lab', credits: 1.5 },
      { code: 'EEE-211', title: 'Digital Logic Design', credits: 3 },
      { code: 'MATH-211', title: 'Linear Algebra & Complex Variables', credits: 3 },
    ],
    obstaclePool: [
      { type: 'overthinking', weight: 4 }, // মানসিক চাপ
      { type: 'assignmentDeadline', weight: 4 },
      { type: 'retake', weight: 2 },
      { type: 'socialMedia', weight: 2 },
    ],
    spawnIntervalMeters: 75,
    hillSteepness: 0.0045,
    hillRoughness: 65,
  },

  // --------------------------------------------------------------------------
  // ৪র্থ সেমিস্টার: মিডটার্ম এবং রিটেক ঝুঁকি
  // --------------------------------------------------------------------------
  {
    id: 4,
    number: 4,
    title: 'Fourth Semester: Midterm and Retake',
    tagline: 'High Stakes, Critical Exams & The Dreaded F-Grade Stamp',
    description: 'Midterm week is merciless. Avoid the dreaded Retake stamp—it will crush your vehicle and drain your fuel reserves!',
    targetDistance: 1500, // ১৫০০ মিটার
    theme: {
      skyColor: 0xfde047, // পরীক্ষার হলের উদ্বেগজনক হলুদ আলো
      skyBottomColor: 0xfef9c3,
      hillPrimary: 0xb45309,
      hillSecondary: 0x92400e,
      accentColor: '#f59e0b',
      bgElements: 'exam_hall',
    },
    courses: [
      { code: 'CSE-221', title: 'Algorithms Analysis & Design', credits: 3 },
      { code: 'CSE-222', title: 'Database Management Systems', credits: 3 },
      { code: 'CSE-223', title: 'Computer Architecture & Microprocessors', credits: 3 },
      { code: 'STAT-221', title: 'Probability & Statistics', credits: 3 },
    ],
    obstaclePool: [
      { type: 'retake', weight: 5 }, // রিটেক স্ট্যাম্প বাধা
      { type: 'attendanceShortage', weight: 3 }, // উপস্থিতি সংকট
      { type: 'overthinking', weight: 3 },
      { type: 'laziness', weight: 2 },
    ],
    spawnIntervalMeters: 70,
    hillSteepness: 0.005,
    hillRoughness: 75,
  },

  // --------------------------------------------------------------------------
  // ৫ম সেমিস্টার: প্রজেক্ট এবং অ্যাসাইনমেন্ট (রাত জাগা স্প্রিন্ট)
  // --------------------------------------------------------------------------
  {
    id: 5,
    number: 5,
    title: 'Fifth Semester: Projects and Assignments',
    tagline: 'Full-Stack Sprints, Merge Conflicts & 11:59 PM Deadlines',
    description: 'Semester 5 brings sleepless project sprints. Multiple assignments collide on the road. Blast deadlines with your academic firepower!',
    targetDistance: 1700, // ১৭০০ মিটার
    theme: {
      skyColor: 0xd8b4fe, // গোধূলি বেগুনি আভা
      skyBottomColor: 0xf3e8ff,
      hillPrimary: 0x7e22ce,
      hillSecondary: 0x6b21a8,
      accentColor: '#a855f7',
      bgElements: 'project_fair',
    },
    courses: [
      { code: 'CSE-311', title: 'Operating Systems', credits: 3 },
      { code: 'CSE-312', title: 'Software Engineering & System Analysis', credits: 3 },
      { code: 'CSE-313', title: 'Computer Networks', credits: 3 },
      { code: 'CSE-314', title: 'Software Development Project I', credits: 2 },
    ],
    obstaclePool: [
      { type: 'assignmentDeadline', weight: 6 }, // রাত ১১:৫৯ ডেডলাইন
      { type: 'retake', weight: 3 },
      { type: 'attendanceShortage', weight: 3 },
      { type: 'relationship', weight: 2 },
    ],
    spawnIntervalMeters: 65,
    hillSteepness: 0.0055,
    hillRoughness: 85,
  },

  // --------------------------------------------------------------------------
  // ৬ষ্ঠ সেমিস্টার: কোর্স শিক্ষক এবং গবেষণা (বস লড়াই)
  // --------------------------------------------------------------------------
  {
    id: 6,
    number: 6,
    title: 'Sixth Semester: Course Teacher and Research',
    tagline: 'Surprise Quizzes, Viva Voce & The Boss Professor!',
    description: 'The legendary Course Teacher appears on the mountain! With maximum durability and tricky viva questions, you must hit him with all your academic knowledge!',
    targetDistance: 1900, // ১৯০০ মিটার
    theme: {
      skyColor: 0xfca5a5, // চ্যালেঞ্জিং লালচে আকাশ
      skyBottomColor: 0xffedd5,
      hillPrimary: 0x991b1b,
      hillSecondary: 0x7f1d1d,
      accentColor: '#dc2626',
      bgElements: 'research_center',
    },
    courses: [
      { code: 'CSE-321', title: 'Artificial Intelligence & Neural Networks', credits: 3 },
      { code: 'CSE-322', title: 'Compiler Design & Automata Theory', credits: 3 },
      { code: 'CSE-323', title: 'Web & Cloud Application Engineering', credits: 3 },
      { code: 'CSE-324', title: 'Technical Writing & Research Methodology', credits: 2 },
    ],
    obstaclePool: [
      { type: 'courseTeacher', weight: 4 }, // বস শিক্ষক
      { type: 'overthinking', weight: 3 },
      { type: 'retake', weight: 3 },
      { type: 'attendanceShortage', weight: 3 },
    ],
    spawnIntervalMeters: 60,
    hillSteepness: 0.006,
    hillRoughness: 95,
  },

  // --------------------------------------------------------------------------
  // ৭ম সেমিস্টার: ইন্টার্নশিপ এবং ক্যারিয়ারের চাপ
  // --------------------------------------------------------------------------
  {
    id: 7,
    number: 7,
    title: 'Seventh Semester: Internship and Career Pressure',
    tagline: 'LeetCode Grinding, Resume Reviews & Corporate Challenges',
    description: 'The finish line is near, but adult life anxiety hits hard. Juggle industrial internship demands, interview hurdles, and rigorous high-grade standards.',
    targetDistance: 2100, // ২১০০ মিটার
    theme: {
      skyColor: 0x94a3b8, // কর্পোরেট স্টিল ও ধূসর আকাশ
      skyBottomColor: 0xf1f5f9,
      hillPrimary: 0x334155,
      hillSecondary: 0x1e293b,
      accentColor: '#64748b',
      bgElements: 'corporate',
    },
    courses: [
      { code: 'CSE-411', title: 'Machine Learning & Big Data', credits: 3 },
      { code: 'CSE-412', title: 'Information Security & Cryptography', credits: 3 },
      { code: 'CSE-413', title: 'Distributed Systems & Cloud Computing', credits: 3 },
      { code: 'CSE-414', title: 'Industrial Internship / Training', credits: 3 },
    ],
    obstaclePool: [
      { type: 'overthinking', weight: 5 }, // ক্যারিয়ার দুশ্চিন্তা
      { type: 'courseTeacher', weight: 3 },
      { type: 'retake', weight: 3 },
      { type: 'laziness', weight: 2 },
    ],
    spawnIntervalMeters: 55,
    hillSteepness: 0.0065,
    hillRoughness: 105,
  },

  // --------------------------------------------------------------------------
  // ৮ম সেমিস্টার: ফাইনাল বস এবং সমাবর্তন (গ্র্যাজুয়েশন পর্ব)
  // --------------------------------------------------------------------------
  {
    id: 8,
    number: 8,
    title: 'Eighth Semester: Final Boss and Graduation',
    tagline: 'Thesis Defense, Board of Examiners & The Convocation Gate!',
    description: 'The Grand Finale! Conquer the steepest mountain, defeat the final examiner boss, break through every university hurdle, and cross into Convocation!',
    targetDistance: 2400, // ২৪০০ মিটার (সর্বোচ্চ ট্র্যাক)
    theme: {
      skyColor: 0xfef08a, // সমাবর্তনের সোনালি প্রভাত
      skyBottomColor: 0xecfdf5,
      hillPrimary: 0x0f5132, // খাজা ইউনুস আলী বিশ্ববিদ্যালয়ের গ্র্যাজুয়েশন সবুজ
      hillSecondary: 0x064e3b,
      accentColor: '#e6a100', // গোল্ডেন এক্সেন্ট
      bgElements: 'convocation',
    },
    courses: [
      { code: 'CSE-421', title: 'Undergraduate Capstone Thesis / Final Project', credits: 6 },
      { code: 'CSE-422', title: 'Professional Ethics & Cyber Law', credits: 2 },
      { code: 'MGT-421', title: 'Technology Entrepreneurship & Leadership', credits: 2 },
    ],
    obstaclePool: [
      { type: 'courseTeacher', weight: 5 }, // থিসিস ডিফেন্স এক্সামিনার বস
      { type: 'retake', weight: 3 },
      { type: 'assignmentDeadline', weight: 3 },
      { type: 'overthinking', weight: 3 },
      { type: 'attendanceShortage', weight: 2 },
    ],
    spawnIntervalMeters: 50,
    hillSteepness: 0.007, // সবচেয়ে খাড়া পাহাড়
    hillRoughness: 115,
  },
];
