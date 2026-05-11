// ============================================================
// AlgoRecall — Intelligent Memory Engine (SM-2 Evolved)
// ============================================================

import {
  BASE_INTERVALS,
  LEVEL_THRESHOLDS,
} from "./constants";

export type ConfidenceRating = "perfect" | "partial" | "hint" | "forgot";
export type RevisionMode = "quick" | "full";
export type HealthStatus = "strong" | "fragile" | "forgotten" | "mastered" | "relearning";

export interface RevisionInput {
  mode: RevisionMode;
  confidence: ConfidenceRating;
  currentInterval: number;
  memoryStrength: number; // 0-100
  revisionNumber: number;
  timeTakenSeconds?: number;
}

export interface RevisionResult {
  newInterval: number;
  newMemoryStrength: number;
  newHealthStatus: HealthStatus;
  nextRevisionDate: Date;
}

/**
 * Advanced memory strength calculation
 */
function calculateMemoryStrength(
  currentStrength: number,
  confidence: ConfidenceRating,
  mode: RevisionMode
): number {
  let delta = 0;
  
  if (confidence === "perfect") {
    delta = mode === "full" ? 20 : 10;
  } else if (confidence === "partial") {
    delta = mode === "full" ? 10 : 5;
  } else if (confidence === "hint") {
    delta = -10;
  } else if (confidence === "forgot") {
    delta = -40;
  }

  return Math.max(0, Math.min(100, currentStrength + delta));
}

/**
 * Determine health status based on memory strength
 */
function determineHealthStatus(strength: number): HealthStatus {
  if (strength >= 90) return "mastered";
  if (strength >= 70) return "strong";
  if (strength >= 40) return "relearning";
  if (strength >= 20) return "fragile";
  return "forgotten";
}

/**
 * Calculate the next revision interval based on an evolved SM-2 algorithm
 */
export function calculateNextInterval(input: RevisionInput): RevisionResult {
  const { mode, confidence, currentInterval, memoryStrength } = input;
  
  const newMemoryStrength = calculateMemoryStrength(memoryStrength, confidence, mode);
  const newHealthStatus = determineHealthStatus(newMemoryStrength);
  
  let currentIndex = BASE_INTERVALS.findIndex(i => i >= currentInterval);
  if (currentIndex === -1) currentIndex = BASE_INTERVALS.length - 1;

  let newInterval = currentInterval;

  // Interval calculation logic based on confidence and mode
  if (confidence === "perfect") {
    if (mode === "full") {
      newInterval = BASE_INTERVALS[Math.min(BASE_INTERVALS.length - 1, currentIndex + 2)];
    } else {
      // Quick recall - safer advancement
      newInterval = BASE_INTERVALS[Math.min(BASE_INTERVALS.length - 1, currentIndex + 1)];
    }
  } else if (confidence === "partial") {
    if (mode === "full") {
      newInterval = BASE_INTERVALS[Math.min(BASE_INTERVALS.length - 1, currentIndex + 1)];
    } else {
      // Quick recall partial - stay on same interval
      newInterval = BASE_INTERVALS[currentIndex];
    }
  } else if (confidence === "hint") {
    // Drop back 1 interval
    newInterval = BASE_INTERVALS[Math.max(0, currentIndex - 1)];
  } else if (confidence === "forgot") {
    // Drop back significantly but maybe not to 0 if memory was high
    newInterval = memoryStrength > 50 ? BASE_INTERVALS[1] : BASE_INTERVALS[0];
  }

  const nextRevisionDate = new Date();
  nextRevisionDate.setDate(nextRevisionDate.getDate() + newInterval);

  return {
    newInterval,
    newMemoryStrength: Math.round(newMemoryStrength * 100) / 100,
    newHealthStatus,
    nextRevisionDate,
  };
}

/**
 * Fallback for old API callers that still use Rating ("easy", "medium", "hard", "forgot")
 */
export function calculateNextIntervalLegacy(input: {
  rating: "easy" | "medium" | "hard" | "forgot";
  currentInterval: number;
  easeFactor: number;
  revisionNumber: number;
  confidenceLevel: number;
}): { newInterval: number; newEaseFactor: number; newConfidenceLevel: number; nextRevisionDate: Date } {
  // Map old rating to new confidence
  let confidence: ConfidenceRating = "perfect";
  if (input.rating === "easy") confidence = "perfect";
  else if (input.rating === "medium") confidence = "partial";
  else if (input.rating === "hard") confidence = "hint";
  else confidence = "forgot";

  const res = calculateNextInterval({
    mode: "full",
    confidence,
    currentInterval: input.currentInterval,
    memoryStrength: (input.confidenceLevel / 5) * 100,
    revisionNumber: input.revisionNumber,
  });

  return {
    newInterval: res.newInterval,
    newEaseFactor: input.easeFactor,
    newConfidenceLevel: Math.ceil((res.newMemoryStrength / 100) * 5) || 1,
    nextRevisionDate: res.nextRevisionDate,
  };
}

/**
 * Get the initial ease factor based on problem difficulty
 */
export function getInitialEaseFactor(difficulty: string | null): number {
  switch (difficulty) {
    case "Easy": return 2.8;
    case "Medium": return 2.5;
    case "Hard": return 2.2;
    default: return 2.5;
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
