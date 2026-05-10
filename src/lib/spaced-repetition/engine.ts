// ============================================================
// AlgoRecall — SM-2 Spaced Repetition Engine
// ============================================================

import {
  BASE_INTERVALS,
  MIN_EASE_FACTOR,
  LEVEL_THRESHOLDS,
} from "./constants";

export type Rating = "easy" | "medium" | "hard" | "forgot";

export interface RevisionInput {
  rating: Rating;
  currentInterval: number;
  easeFactor: number;
  revisionNumber: number;
  confidenceLevel: number;
}

export interface RevisionResult {
  newInterval: number;
  newEaseFactor: number;
  newConfidenceLevel: number;
  nextRevisionDate: Date;
}

/**
 * Calculate the next revision interval based on SM-2 algorithm
 */
export function calculateNextInterval(input: RevisionInput): RevisionResult {
  const { rating, currentInterval, easeFactor, revisionNumber, confidenceLevel } = input;
  let newInterval: number;
  let newEaseFactor = easeFactor;
  let newConfidenceLevel: number;

  // Find the current step in the predefined sequence
  let currentIndex = BASE_INTERVALS.findIndex(i => i >= currentInterval);
  if (currentIndex === -1) currentIndex = BASE_INTERVALS.length - 1;
  // If first time (currentInterval = 0), currentIndex will be 0 because 1 >= 0.

  switch (rating) {
    case "easy":
      // Advance 2 steps for easy, maxing out at the end of the array
      newInterval = BASE_INTERVALS[Math.min(BASE_INTERVALS.length - 1, currentIndex + 2)];
      newConfidenceLevel = Math.min(5, confidenceLevel + 1);
      break;

    case "medium":
      // Advance 1 step
      newInterval = BASE_INTERVALS[Math.min(BASE_INTERVALS.length - 1, currentIndex + 1)];
      newConfidenceLevel = confidenceLevel;
      break;

    case "hard":
      // Stay at current step or drop back 1
      newInterval = BASE_INTERVALS[Math.max(0, currentIndex - 1)];
      newConfidenceLevel = Math.max(1, Math.min(3, confidenceLevel));
      break;

    case "forgot":
      // Reset to first step
      newInterval = BASE_INTERVALS[0];
      newConfidenceLevel = 1;
      break;

    default:
      throw new Error(`Invalid rating: ${rating}`);
  }

  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + newInterval);

  return {
    newInterval,
    newEaseFactor: Math.round(newEaseFactor * 100) / 100,
    newConfidenceLevel,
    nextRevisionDate,
  };
}

/**
 * Get the initial ease factor based on problem difficulty
 */
export function getInitialEaseFactor(difficulty: string | null): number {
  switch (difficulty) {
    case "Easy":
      return 2.8;
    case "Medium":
      return 2.5;
    case "Hard":
      return 2.2;
    default:
      return 2.5;
  }
}

/**
 * Calculate user level from total XP
 */
export function calculateLevel(totalXp: number): {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
} {
  let currentLevel: { level: number; title: string; xp: number } = LEVEL_THRESHOLDS[0];
  let nextLevel: { level: number; title: string; xp: number } = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xp) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const xpInLevel = totalXp - currentLevel.xp;
  const xpForLevel = nextLevel.xp - currentLevel.xp;
  const progress = xpForLevel > 0 ? (xpInLevel / xpForLevel) * 100 : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXp: totalXp,
    nextLevelXp: nextLevel.xp,
    progress: Math.min(100, Math.round(progress)),
  };
}

/**
 * Calculate topic mastery score
 */
export function calculateMasteryScore(params: {
  avgConfidence: number;
  problemsSolved: number;
  targetCount: number;
  revisionCompletionRate: number;
  recentRecallAccuracy: number;
}): number {
  const {
    avgConfidence,
    problemsSolved,
    targetCount,
    revisionCompletionRate,
    recentRecallAccuracy,
  } = params;

  const score =
    ((avgConfidence / 5) * 0.5 +
      Math.min(1, problemsSolved / targetCount) * 0.25 +
      revisionCompletionRate * 0.15 +
      recentRecallAccuracy * 0.1) *
    100;

  return Math.round(score * 100) / 100;
}
