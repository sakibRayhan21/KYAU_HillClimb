import { SemesterInfo } from '../types/game';

export const SEMESTERS_CONFIG: SemesterInfo[] = [
  {
    id: 1,
    number: 1,
    title: 'First Semester: New University Life',
    tagline: 'Freshman Orientation, Campus Buzz & Excitement',
    description: 'Welcome to KYAU CSE! Everything is fresh and shiny, but university life is fast-paced. Learn to balance classes, new friends, and your vehicle!',
    targetDistance: 900,
    theme: {
      skyColor: 0x6ee7b7, // fresh light emerald sky
      skyBottomColor: 0xdcfce7,
      hillPrimary: 0x15803d, // lush green
      hillSecondary: 0x166534,
      accentColor: '#10b981',
      bgElements: 'campus',
    },
    courses: [
      { code: 'CSE-111', title: 'Introduction to Computer Systems', credits: 3 },
      { code: 'CSE-112', title: 'Structured Programming Language (C)', credits: 3 },
      { code: 'MATH-111', title: 'Differential and Integral Calculus', credits: 3 },
      { code: 'ENG-111', title: 'English Fundamentals', credits: 2 },
    ],
    obstaclePool: [
      { type: 'socialMedia', weight: 4 },
      { type: 'laziness', weight: 4 },
      { type: 'assignmentDeadline', weight: 2 },
    ],
    spawnIntervalMeters: 90,
    hillSteepness: 0.003,
    hillRoughness: 45,
  },
  {
    id: 2,
    number: 2,
    title: 'Second Semester: Relationship and Laziness',
    tagline: 'Campus Crushes, Late Morning Sleeps & GPA Warning',
    description: 'You survived freshman month, but romance and cozy hostel naps are draining your fuel tank! Stay focused on your code.',
    targetDistance: 1100,
    theme: {
      skyColor: 0xfbcfe8, // soft pinkish sky
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
      { type: 'relationship', weight: 5 },
      { type: 'laziness', weight: 4 },
      { type: 'socialMedia', weight: 3 },
      { type: 'assignmentDeadline', weight: 2 },
    ],
    spawnIntervalMeters: 80,
    hillSteepness: 0.004,
    hillRoughness: 55,
  },
  {
    id: 3,
    number: 3,
    title: 'Third Semester: Programming Pressure',
    tagline: 'Pointers, Linked Lists, Segmentation Faults & Panic',
    description: 'Data Structures and Algorithms will test your engine. Bugs emerge like landmines on steep hills! Arm your weapon to debug obstacles ahead.',
    targetDistance: 1300,
    theme: {
      skyColor: 0x93c5fd, // digital blue sky
      skyBottomColor: 0xe0e7ff,
      hillPrimary: 0x0284c7, // tech blue-green
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
      { type: 'overthinking', weight: 4 },
      { type: 'assignmentDeadline', weight: 4 },
      { type: 'retake', weight: 2 },
      { type: 'socialMedia', weight: 2 },
    ],
    spawnIntervalMeters: 75,
    hillSteepness: 0.0045,
    hillRoughness: 65,
  },
  {
    id: 4,
    number: 4,
    title: 'Fourth Semester: Midterm and Retake',
    tagline: 'High Stakes, Critical Exams & The Dreaded F-Grade Stamp',
    description: 'Midterm week is merciless. Avoid the dreaded Retake stamp—it will crush your vehicle and drain your fuel reserves!',
    targetDistance: 1500,
    theme: {
      skyColor: 0xfde047, // intense amber/yellow exam hall
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
      { type: 'retake', weight: 5 },
      { type: 'attendanceShortage', weight: 3 },
      { type: 'overthinking', weight: 3 },
      { type: 'laziness', weight: 2 },
    ],
    spawnIntervalMeters: 70,
    hillSteepness: 0.005,
    hillRoughness: 75,
  },
  {
    id: 5,
    number: 5,
    title: 'Fifth Semester: Projects and Assignments',
    tagline: 'Full-Stack Sprints, Merge Conflicts & 11:59 PM Deadlines',
    description: 'Semester 5 brings sleepless project sprints. Multiple assignments collide on the road. Blast deadlines with your academic firepower!',
    targetDistance: 1700,
    theme: {
      skyColor: 0xd8b4fe, // dusk purple project marathon
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
      { type: 'assignmentDeadline', weight: 6 },
      { type: 'retake', weight: 3 },
      { type: 'attendanceShortage', weight: 3 },
      { type: 'relationship', weight: 2 },
    ],
    spawnIntervalMeters: 65,
    hillSteepness: 0.0055,
    hillRoughness: 85,
  },
  {
    id: 6,
    number: 6,
    title: 'Sixth Semester: Course Teacher and Research',
    tagline: 'Surprise Quizzes, Viva Voce & The Boss Professor!',
    description: 'The legendary Course Teacher appears on the mountain! With maximum durability and tricky viva questions, you must hit him with all your academic knowledge!',
    targetDistance: 1900,
    theme: {
      skyColor: 0xfca5a5, // crimson challenge
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
      { type: 'courseTeacher', weight: 4 }, // Boss
      { type: 'overthinking', weight: 3 },
      { type: 'retake', weight: 3 },
      { type: 'attendanceShortage', weight: 3 },
    ],
    spawnIntervalMeters: 60,
    hillSteepness: 0.006,
    hillRoughness: 95,
  },
  {
    id: 7,
    number: 7,
    title: 'Seventh Semester: Internship and Career Pressure',
    tagline: 'LeetCode Grinding, Resume Reviews & Corporate Challenges',
    description: 'The finish line is near, but adult life anxiety hits hard. Juggle industrial internship demands, interview hurdles, and rigorous high-grade standards.',
    targetDistance: 2100,
    theme: {
      skyColor: 0x94a3b8, // corporate steel & blue
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
      { type: 'overthinking', weight: 5 },
      { type: 'courseTeacher', weight: 3 },
      { type: 'retake', weight: 3 },
      { type: 'laziness', weight: 2 },
    ],
    spawnIntervalMeters: 55,
    hillSteepness: 0.0065,
    hillRoughness: 105,
  },
  {
    id: 8,
    number: 8,
    title: 'Eighth Semester: Final Boss and Graduation',
    tagline: 'Thesis Defense, Board of Examiners & The Convocation Gate!',
    description: 'The Grand Finale! Conquer the steepest mountain, defeat the final examiner boss, break through every university hurdle, and cross into Convocation!',
    targetDistance: 2400,
    theme: {
      skyColor: 0xfef08a, // triumphant golden dawn
      skyBottomColor: 0xecfdf5,
      hillPrimary: 0x0f5132, // KYAU signature graduation green
      hillSecondary: 0x064e3b,
      accentColor: '#e6a100', // Gold
      bgElements: 'convocation',
    },
    courses: [
      { code: 'CSE-421', title: 'Undergraduate Capstone Thesis / Final Project', credits: 6 },
      { code: 'CSE-422', title: 'Professional Ethics & Cyber Law', credits: 2 },
      { code: 'MGT-421', title: 'Technology Entrepreneurship & Leadership', credits: 2 },
    ],
    obstaclePool: [
      { type: 'courseTeacher', weight: 5 }, // Boss
      { type: 'retake', weight: 3 },
      { type: 'assignmentDeadline', weight: 3 },
      { type: 'overthinking', weight: 3 },
      { type: 'attendanceShortage', weight: 2 },
    ],
    spawnIntervalMeters: 50,
    hillSteepness: 0.007,
    hillRoughness: 115,
  },
];

