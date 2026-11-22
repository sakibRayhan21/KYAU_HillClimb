// ============================================================================
// সিজিপিএ ক্যালকুলেশন সার্ভিস (CGPA & Academic Grading Service)
// ইউজিসি ও খাজা ইউনুস আলী বিশ্ববিদ্যালয়ের গ্রেডিং পলিসি অনুযায়ী
// নম্বর থেকে লেটার গ্রেড, সেমিস্টার জিপিএ এবং কিউমুলেটিভ সিজিপিএ (CGPA) গণনা করে।
// ============================================================================

import { CourseGrade, SemesterInfo, TranscriptRecord } from '../types/game';

/**
 * গ্রেডিং স্কেল এন্ট্রি ইন্টারফেস
 */
export interface GradeScaleEntry {
  minScore: number; // সর্বনিম্ন প্রাপ্ত নম্বর
  grade: string; // লেটার গ্রেড
  gpa: number; // গ্রেড পয়েন্ট
}

/**
 * বাংলাদেশের বিশ্ববিদ্যালয় মঞ্জুরী কমিশন (UGC) এবং KYAU স্ট্যান্ডার্ড গ্রেডিং স্কেল
 */
export const GRADING_SCALE: GradeScaleEntry[] = [
  { minScore: 80, grade: 'A+', gpa: 4.00 }, // ৮০% বা তদূর্ধ্ব: ৪.০০ (A+)
  { minScore: 75, grade: 'A', gpa: 3.75 },  // ৭৫% থেকে ৭৯%: ৩.৭৫ (A)
  { minScore: 70, grade: 'A-', gpa: 3.50 }, // ৭০% থেকে ৭৪%: ৩.৫০ (A-)
  { minScore: 65, grade: 'B+', gpa: 3.25 }, // ৬৫% থেকে ৬৯%: ৩.২৫ (B+)
  { minScore: 60, grade: 'B', gpa: 3.00 },  // ৬০% থেকে ৬৪%: ৩.০০ (B)
  { minScore: 55, grade: 'B-', gpa: 2.75 }, // ৫৫% থেকে ৫৯%: ২.৭৫ (B-)
  { minScore: 50, grade: 'C+', gpa: 2.50 }, // ৫০% থেকে ৫৪%: ২.৫০ (C+)
  { minScore: 45, grade: 'C', gpa: 2.25 },  // ৪৫% থেকে ৪৯%: ২.২৫ (C)
  { minScore: 40, grade: 'D', gpa: 2.00 },  // ৪০% থেকে ৪৪%: ২.০০ (D - পাস)
  { minScore: 0, grade: 'F', gpa: 0.00 },   // ৪০% এর নিচে: ০.০০ (F - ফেইল)
];

/**
 * প্রাপ্ত মোট নম্বর থেকে স্বয়ংক্রিয়ভাবে লেটার গ্রেড ও জিপিএ পয়েন্ট বের করার ফাংশন
 */
export function getGradeFromScore(score: number): { grade: string; gpa: number } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const entry of GRADING_SCALE) {
    if (clamped >= entry.minScore) {
      return { grade: entry.grade, gpa: entry.gpa };
    }
  }
  return { grade: 'F', gpa: 0.00 };
}

/**
 * সেমিস্টার রান সমাপ্তির পর গেমের পারফরম্যান্সের ভিত্তিতে গ্রেড ও জিপিএ গণনা করে
 * অতিক্রান্ত দূরত্ব, সংগৃহীত একাডেমিক আইটেম (ক্লাস টেস্ট, কুইজ, অ্যাসাইনমেন্ট, মিডটার্ম, ফাইনাল)
 * এবং বাধা ধ্বংস ও ধাক্কা খাওয়ার পরিসংখ্যান এখানে বিবেচনা করা হয়।
 */
export function calculateSemesterRunGrades(
  semester: SemesterInfo,
  runData: {
    completed: boolean;
    distanceRatio: number;
    academicPowerEarned: number;
    academicItemsCollected: Record<string, number>;
    obstaclesHit: number;
    obstaclesDestroyed: number;
  }
): {
  semesterGPA: number;
  semesterGrade: string;
  courseGrades: CourseGrade[];
  creditsEarned: number;
} {
  // অতিক্রান্ত দূরত্বের অনুপাতের ওপর ভিত্তি করে বেস স্কোর (সর্বোচ্চ ৬৫%)
  let baseScore = runData.distanceRatio * 65; 

  // সংগৃহীত একাডেমিক আইটেমগুলোর বোনাস স্কোর গণনা
  const testCount = (runData.academicItemsCollected['classTest'] || 0) + (runData.academicItemsCollected['quiz'] || 0);
  const assignmentCount = runData.academicItemsCollected['assignment'] || 0;
  const midtermCount = runData.academicItemsCollected['midterm'] || 0;
  const finalCount = runData.academicItemsCollected['finalExam'] || 0;

  // টেস্ট প্রতি ৩, অ্যাসাইনমেন্ট প্রতি ৪, মিডটার্ম প্রতি ৭ ও ফাইনাল প্রতি ১২ পয়েন্ট বোনাস
  let academicBonus = (testCount * 3) + (assignmentCount * 4) + (midtermCount * 7) + (finalCount * 12);
  academicBonus = Math.min(30, academicBonus);

  // গুলি করে বাধা ধ্বংস করার বোনাস (সর্বোচ্চ ১০ পয়েন্ট)
  const destroyBonus = Math.min(10, runData.obstaclesDestroyed * 1.5);

  // ধ্বংস না করে বাধার সাথে গাড়ি ধাক্কা খাওয়ার পেনাল্টি (নেগেটিভ মার্কিং)
  const hitPenalty = runData.obstaclesHit * 2.5;

  // মোট র মার্কস হিসাব (সর্বনিম্ন ২৫ ও সর্বোচ্চ ১০০)
  const rawScore = Math.max(25, Math.min(100, baseScore + academicBonus + destroyBonus - hitPenalty));

  let totalWeightedGPA = 0;
  let totalCredits = 0;

  // সেমিস্টারের অন্তর্ভুক্ত প্রতিটি কোর্সের জন্য আলাদা গ্রেড নির্ধারণ
  const courseGrades: CourseGrade[] = semester.courses.map((c, idx) => {
    // বাস্তবসম্মত ট্রান্সক্রিপ্ট দেখানোর জন্য কোর্সগুলোর মধ্যে সামান্য তারতম্য (Variance)
    const variance = ((idx % 3) - 1) * 3.5;
    const courseScore = Math.max(30, Math.min(100, rawScore + variance));
    const { grade, gpa } = getGradeFromScore(courseScore);

    totalWeightedGPA += gpa * c.credits;
    totalCredits += c.credits;

    return {
      code: c.code,
      title: c.title,
      credits: c.credits,
      grade,
      gpa,
      score: Math.round(courseScore),
    };
  });

  // ক্রেডিট ওয়েটেড জিপিএ হিসাব
  const semesterGPA = totalCredits > 0 ? Number((totalWeightedGPA / totalCredits).toFixed(2)) : 0;
  const { grade: semesterGrade } = getGradeFromScore(rawScore);

  return {
    semesterGPA,
    semesterGrade,
    courseGrades,
    creditsEarned: runData.completed ? totalCredits : 0,
  };
}

/**
 * সম্পূর্ণ ট্রান্সক্রিপ্ট থেকে কিউমুলেটিভ সিজিপিএ (CGPA), অর্জিত মোট ক্রেডিট
 * এবং গ্র্যাজুয়েশন সম্মাননা (Degree Honor / Distinction) গণনা করার ফাংশন
 */
export function calculateCumulativeCGPA(transcript: TranscriptRecord[]): {
  cgpa: number;
  totalCredits: number;
  degreeHonor: string;
} {
  if (!Array.isArray(transcript) || transcript.length === 0) {
    return { cgpa: 4.0, totalCredits: 0, degreeHonor: 'Freshman' };
  }

  let totalWeightedGPA = 0;
  let totalCredits = 0;

  transcript.forEach((record) => {
    if (!record) return;
    if (Array.isArray(record.courses) && record.courses.length > 0) {
      record.courses.forEach((course) => {
        if (!course) return;
        const gpa = typeof course.gpa === 'number' ? course.gpa : 0;
        const credits = typeof course.credits === 'number' ? course.credits : 0;
        totalWeightedGPA += gpa * credits;
        totalCredits += credits;
      });
    } else if (typeof record.gpa === 'number' && typeof record.credits === 'number') {
      totalWeightedGPA += record.gpa * record.credits;
      totalCredits += record.credits;
    }
  });

  const cgpa = totalCredits > 0 ? Number((totalWeightedGPA / totalCredits).toFixed(2)) : 0.0;

  // সিজিপিএ অনুযায়ী সম্মাননা খেতাব নির্ধারণ
  let degreeHonor = 'Pass';
  if (cgpa >= 3.85) {
    degreeHonor = 'Summa Cum Laude (Chancellor’s Gold Medalist)'; // আচার্য স্বর্ণপদক
  } else if (cgpa >= 3.65) {
    degreeHonor = 'Magna Cum Laude (Dean’s Honor List)'; // ডিনস অনার লিস্ট
  } else if (cgpa >= 3.50) {
    degreeHonor = 'Cum Laude (First Class with Distinction)'; // ডিস্টিঙ্কশন ফার্স্ট ক্লাস
  } else if (cgpa >= 3.00) {
    degreeHonor = 'First Class (Graduated with Honors)'; // ফার্স্ট ক্লাস
  } else if (cgpa >= 2.50) {
    degreeHonor = 'Second Class'; // সেকেন্ড ক্লাস
  }

  return {
    cgpa,
    totalCredits,
    degreeHonor,
  };
}
