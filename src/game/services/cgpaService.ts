import { CourseGrade, SemesterInfo, TranscriptRecord } from '../types/game';

export interface GradeScaleEntry {
  minScore: number;
  grade: string;
  gpa: number;
}

export const GRADING_SCALE: GradeScaleEntry[] = [
  { minScore: 80, grade: 'A+', gpa: 4.00 },
  { minScore: 75, grade: 'A', gpa: 3.75 },
  { minScore: 70, grade: 'A-', gpa: 3.50 },
  { minScore: 65, grade: 'B+', gpa: 3.25 },
  { minScore: 60, grade: 'B', gpa: 3.00 },
  { minScore: 55, grade: 'B-', gpa: 2.75 },
  { minScore: 50, grade: 'C+', gpa: 2.50 },
  { minScore: 45, grade: 'C', gpa: 2.25 },
  { minScore: 40, grade: 'D', gpa: 2.00 },
  { minScore: 0, grade: 'F', gpa: 0.00 },
];

export function getGradeFromScore(score: number): { grade: string; gpa: number } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const entry of GRADING_SCALE) {
    if (clamped >= entry.minScore) {
      return { grade: entry.grade, gpa: entry.gpa };
    }
  }
  return { grade: 'F', gpa: 0.00 };
}

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
  // Base raw score depends on distance progress
  let baseScore = runData.distanceRatio * 65; // 0 to 65%

  // Bonus for academic items collected
  // e.g. class tests, quizzes, midterms, final exam
  const testCount = (runData.academicItemsCollected['classTest'] || 0) + (runData.academicItemsCollected['quiz'] || 0);
  const assignmentCount = runData.academicItemsCollected['assignment'] || 0;
  const midtermCount = runData.academicItemsCollected['midterm'] || 0;
  const finalCount = runData.academicItemsCollected['finalExam'] || 0;

  let academicBonus = (testCount * 3) + (assignmentCount * 4) + (midtermCount * 7) + (finalCount * 12);
  academicBonus = Math.min(30, academicBonus);

  // Bonus for active obstacle destruction (clearing academic hurdles)
  const destroyBonus = Math.min(10, runData.obstaclesDestroyed * 1.5);

  // Penalty for hitting obstacles without shooting them
  const hitPenalty = runData.obstaclesHit * 2.5;

  const rawScore = Math.max(25, Math.min(100, baseScore + academicBonus + destroyBonus - hitPenalty));

  let totalWeightedGPA = 0;
  let totalCredits = 0;

  const courseGrades: CourseGrade[] = semester.courses.map((c, idx) => {
    // Slight variance among subjects for realistic transcript
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

  const semesterGPA = totalCredits > 0 ? Number((totalWeightedGPA / totalCredits).toFixed(2)) : 0;
  const { grade: semesterGrade } = getGradeFromScore(rawScore);

  return {
    semesterGPA,
    semesterGrade,
    courseGrades,
    creditsEarned: runData.completed ? totalCredits : 0,
  };
}

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

  let degreeHonor = 'Pass';
  if (cgpa >= 3.85) {
    degreeHonor = 'Summa Cum Laude (Chancellor’s Gold Medalist)';
  } else if (cgpa >= 3.65) {
    degreeHonor = 'Magna Cum Laude (Dean’s Honor List)';
  } else if (cgpa >= 3.50) {
    degreeHonor = 'Cum Laude (First Class with Distinction)';
  } else if (cgpa >= 3.00) {
    degreeHonor = 'First Class (Graduated with Honors)';
  } else if (cgpa >= 2.50) {
    degreeHonor = 'Second Class';
  }

  return {
    cgpa,
    totalCredits,
    degreeHonor,
  };
}

