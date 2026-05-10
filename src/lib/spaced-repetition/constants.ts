// ============================================================
// AlgoRecall — Spaced Repetition Engine (SM-2 variant)
// ============================================================

export const BASE_INTERVALS = [1, 3, 7, 15, 30, 60, 90, 180, 365];
export const DEFAULT_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

// Difficulty-weighted initial ease factors
export const DIFFICULTY_EASE: Record<string, number> = {
  Easy: 2.8,
  Medium: 2.5,
  Hard: 2.2,
};

// XP awards per action
export const XP_AWARDS = {
  new_problem_easy: 5,
  new_problem_medium: 10,
  new_problem_hard: 20,
  revision_easy: 15,
  revision_medium: 10,
  revision_hard: 8,
  revision_forgot: 3,
  all_revisions_completed: 25,
  streak_7: 50,
  streak_30: 200,
  topic_complete: 100,
  first_revision: 5,
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, title: "Beginner", xp: 0 },
  { level: 2, title: "Explorer", xp: 100 },
  { level: 3, title: "Problem Solver", xp: 300 },
  { level: 4, title: "Pattern Seeker", xp: 700 },
  { level: 5, title: "Pattern Hunter", xp: 1500 },
  { level: 6, title: "Algorithm Ninja", xp: 3000 },
  { level: 7, title: "Interview Ready", xp: 5000 },
  { level: 8, title: "FAANG Contender", xp: 8000 },
  { level: 9, title: "FAANG Slayer", xp: 12000 },
  { level: 10, title: "DSA Legend", xp: 20000 },
] as const;

// Confidence level labels
export const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Forgotten",
  2: "Struggling",
  3: "Familiar",
  4: "Confident",
  5: "Mastered",
};

// Topic weights for interview readiness score
export const TOPIC_WEIGHTS: Record<string, number> = {
  Arrays: 1.5,
  "Dynamic Programming": 1.5,
  Trees: 1.4,
  Graphs: 1.3,
  "Binary Search": 1.2,
  Backtracking: 1.1,
  "Sliding Window": 1.1,
  Greedy: 1.0,
  Heaps: 1.0,
  Trie: 0.8,
};
export const DEFAULT_TOPIC_WEIGHT = 0.7;
