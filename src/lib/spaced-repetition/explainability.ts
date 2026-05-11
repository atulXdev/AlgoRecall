// ============================================================
// AlgoRecall — Explainability Engine
// ============================================================
// Generates human-readable, psychologically safe explanations
// for every system decision, fostering trust and transparency.

import type { ConfidenceRating, RevisionMode, HealthStatus } from "./engine";

/**
 * Memory Drift Semantics — Non-punitive language mapping
 * Replaces "Forgotten/Failed/Weak" with calming, actionable terms
 */
export const HEALTH_DISPLAY_LABELS: Record<HealthStatus, string> = {
  mastered: "Deeply Learned",
  strong: "Solid Recall",
  relearning: "Rebuilding",
  fragile: "Needs Reinforcement",
  forgotten: "Memory Drift",
};

export const HEALTH_DISPLAY_COLORS: Record<HealthStatus, string> = {
  mastered: "text-blue-400",
  strong: "text-emerald-400",
  relearning: "text-muted-foreground",
  fragile: "text-amber-400",
  forgotten: "text-orange-400",
};

export const HEALTH_DISPLAY_BG: Record<HealthStatus, string> = {
  mastered: "bg-blue-500/10 border-blue-500/20",
  strong: "bg-emerald-500/10 border-emerald-500/20",
  relearning: "bg-secondary/50 border-border/50",
  fragile: "bg-amber-500/10 border-amber-500/20",
  forgotten: "bg-orange-500/10 border-orange-500/20",
};

/**
 * Confidence display labels — supportive wording
 */
export const CONFIDENCE_DISPLAY: Record<ConfidenceRating, { label: string; emoji: string }> = {
  perfect: { label: "Perfect Recall", emoji: "✨" },
  partial: { label: "Partial Recall", emoji: "🔄" },
  hint: { label: "Needed a Hint", emoji: "💡" },
  forgot: { label: "Starting Fresh", emoji: "🌱" },
};

export interface ExplanationContext {
  confidence: ConfidenceRating;
  mode: RevisionMode;
  memoryStrengthBefore: number;
  memoryStrengthAfter: number;
  healthBefore: HealthStatus;
  healthAfter: HealthStatus;
  intervalBefore: number;
  intervalAfter: number;
  stabilityScore: number;
  cheesePenaltyApplied: boolean;
  cognitiveComplexity: number;
  memoryFloor: number;
  revisionCount: number;
  daysSinceLastRevision?: number;
}

/**
 * Generate a deterministic, human-readable explanation for a revision outcome.
 * Returns an array of explanation strings, each representing one factor.
 */
export function generateRevisionExplanation(ctx: ExplanationContext): string[] {
  const reasons: string[] = [];
  const delta = ctx.memoryStrengthAfter - ctx.memoryStrengthBefore;

  // Primary outcome
  if (delta > 0) {
    reasons.push(`Memory strength improved by ${Math.abs(Math.round(delta))} points.`);
  } else if (delta < 0) {
    reasons.push(`Memory strength adjusted by ${Math.round(delta)} points — this is normal and helps the system calibrate.`);
  } else {
    reasons.push("Memory strength held steady.");
  }

  // Confidence factor
  if (ctx.confidence === "perfect" && ctx.mode === "full") {
    reasons.push("Full solve with perfect recall — strongest possible reinforcement.");
  } else if (ctx.confidence === "perfect" && ctx.mode === "quick") {
    reasons.push("Quick recall confirmed recognition — interval advanced conservatively.");
  } else if (ctx.confidence === "partial") {
    reasons.push("Partial recall detected — the system will resurface this sooner to strengthen the memory.");
  } else if (ctx.confidence === "hint") {
    reasons.push("A hint was needed — interval shortened slightly to rebuild the connection.");
  } else if (ctx.confidence === "forgot") {
    reasons.push("This concept drifted from memory — it's been moved closer in your queue for gentle re-learning.");
  }

  // Anti-cheese
  if (ctx.cheesePenaltyApplied) {
    reasons.push("Reviewed recently (< 12 hours ago) — gains were reduced to preserve scoring accuracy.");
  }

  // Complexity acknowledgment
  if (ctx.cognitiveComplexity >= 8) {
    reasons.push(`This is a challenging problem (complexity ${ctx.cognitiveComplexity}/10) — intervals advance more carefully for harder material.`);
  }

  // Stability factor
  if (ctx.stabilityScore < 50) {
    reasons.push("Your recall history for this problem has been inconsistent — the system is being more cautious with intervals.");
  }

  // Memory floor protection
  if (ctx.memoryFloor > 0 && ctx.memoryStrengthAfter <= ctx.memoryFloor) {
    reasons.push(`Memory floor protection active — this deeply practiced problem (${ctx.revisionCount}+ reviews) won't drop below ${Math.round(ctx.memoryFloor)}%.`);
  }

  // Health transition
  if (ctx.healthBefore !== ctx.healthAfter) {
    reasons.push(`Status changed: ${HEALTH_DISPLAY_LABELS[ctx.healthBefore]} → ${HEALTH_DISPLAY_LABELS[ctx.healthAfter]}.`);
  }

  // Interval explanation
  if (ctx.intervalAfter > ctx.intervalBefore) {
    reasons.push(`Next review scheduled in ${ctx.intervalAfter} days (was ${ctx.intervalBefore}).`);
  } else if (ctx.intervalAfter < ctx.intervalBefore) {
    reasons.push(`Next review moved closer: ${ctx.intervalAfter} days (was ${ctx.intervalBefore}) — to reinforce the memory.`);
  }

  return reasons;
}

/**
 * Generate explanation for why a problem appeared in today's queue
 */
export function generateQueueExplanation(item: {
  health_status: HealthStatus;
  memory_strength: number;
  next_revision_date: string;
  problems?: { topic?: string };
  recall_stability_score?: number;
}, currentFocusTopic?: string): string {
  const health = item.health_status || "relearning";
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = item.next_revision_date < today;
  const isFocusTopic = currentFocusTopic && item.problems?.topic?.toLowerCase() === currentFocusTopic.toLowerCase();

  if (isFocusTopic && health === "fragile") {
    return "Focus topic + needs reinforcement — prioritized for active learning.";
  }
  if (isFocusTopic) {
    return `Matches your current focus topic: ${currentFocusTopic}.`;
  }
  if (health === "forgotten") {
    return "Memory has drifted — gentle resurfacing to rebuild the connection.";
  }
  if (health === "fragile") {
    return "This memory needs reinforcement before it drifts further.";
  }
  if (isOverdue) {
    return "Scheduled review date has passed — brought forward to maintain momentum.";
  }
  if ((item.recall_stability_score || 100) < 50) {
    return "Recall consistency is low — additional practice helps stabilize the memory.";
  }
  return "Scheduled review — maintaining your learning rhythm.";
}

/**
 * Generate cognitive load explanation for the day
 */
export function generateCognitiveLoadExplanation(totalLoad: number, queueSize: number): string {
  if (totalLoad < 20) {
    return `Light session today (${queueSize} problems, ~${Math.round(totalLoad * 1.5)} min). A good day for quick reviews.`;
  }
  if (totalLoad < 50) {
    return `Moderate session today (${queueSize} problems, ~${Math.round(totalLoad * 1.5)} min). A balanced mix of review and practice.`;
  }
  return `Deep focus session today (${queueSize} problems, ~${Math.round(totalLoad * 1.5)} min). Take breaks between harder problems.`;
}

/**
 * Learning mode configuration — affects queue size, decay, resurfacing
 */
export interface LearningModeConfig {
  queueMultiplier: number;
  decayMultiplier: number;
  resurfacingFrequency: number; // 0-1
  weakTopicBoost: number; // multiplier for weak topic priority
  intervalScaling: number; // multiplier for interval advancement
  cognitiveLoadTarget: number; // target cognitive load per session
  label: string;
  description: string;
}

export const LEARNING_MODES: Record<string, LearningModeConfig> = {
  maintenance: {
    queueMultiplier: 0.5,
    decayMultiplier: 0.5,
    resurfacingFrequency: 0.05,
    weakTopicBoost: 1.0,
    intervalScaling: 1.2,
    cognitiveLoadTarget: 30,
    label: "Maintenance",
    description: "Light sessions to keep knowledge alive without heavy effort.",
  },
  balanced: {
    queueMultiplier: 1.0,
    decayMultiplier: 1.0,
    resurfacingFrequency: 0.1,
    weakTopicBoost: 1.3,
    intervalScaling: 1.0,
    cognitiveLoadTarget: 50,
    label: "Balanced",
    description: "Standard adaptive learning with balanced topic coverage.",
  },
  aggressive: {
    queueMultiplier: 1.5,
    decayMultiplier: 1.5,
    resurfacingFrequency: 0.15,
    weakTopicBoost: 1.5,
    intervalScaling: 0.8,
    cognitiveLoadTarget: 80,
    label: "Aggressive Growth",
    description: "Intensive practice for rapid skill development.",
  },
  interview_sprint: {
    queueMultiplier: 1.3,
    decayMultiplier: 2.0,
    resurfacingFrequency: 0.2,
    weakTopicBoost: 2.0,
    intervalScaling: 0.7,
    cognitiveLoadTarget: 70,
    label: "Interview Sprint",
    description: "Focused preparation with emphasis on weak areas and breadth.",
  },
  low_pressure: {
    queueMultiplier: 0.3,
    decayMultiplier: 0.3,
    resurfacingFrequency: 0.03,
    weakTopicBoost: 1.0,
    intervalScaling: 1.5,
    cognitiveLoadTarget: 20,
    label: "Low Pressure",
    description: "Minimal sessions during busy periods. Just enough to prevent major drift.",
  },
};

/**
 * Calculate memory floor based on revision history depth.
 * Problems with extensive successful revision history should never decay to near-zero.
 */
export function calculateMemoryFloor(revisionCount: number, stabilityScore: number): number {
  if (revisionCount < 5) return 0;
  if (revisionCount < 10) return 10;
  if (revisionCount < 20) return 20;

  // For deeply practiced problems, floor scales with both count and stability
  const countBonus = Math.min(30, Math.floor(revisionCount / 5) * 3);
  const stabilityBonus = Math.floor((stabilityScore / 100) * 15);
  return Math.min(60, 20 + countBonus + stabilityBonus);
}

/**
 * Confidence Calibration: Compare predicted confidence with actual future outcome.
 * If user repeatedly says "perfect" but then forgets next time, their calibration score drops.
 */
export function updateConfidenceCalibration(
  currentCalibration: number,
  lastConfidence: ConfidenceRating | null,
  currentConfidence: ConfidenceRating
): number {
  if (!lastConfidence) return currentCalibration;

  const confidenceRank: Record<ConfidenceRating, number> = {
    forgot: 0,
    hint: 1,
    partial: 2,
    perfect: 3,
  };

  const lastRank = confidenceRank[lastConfidence];
  const currentRank = confidenceRank[currentConfidence];

  // If user said "perfect" last time but forgot this time → overconfidence
  if (lastRank === 3 && currentRank <= 1) {
    return Math.max(0, currentCalibration - 15); // significant drop
  }
  // If user said "perfect" and still recalls well → well calibrated
  if (lastRank >= 2 && currentRank >= 2) {
    return Math.min(100, currentCalibration + 3); // slow recovery
  }
  // Underconfidence: user said "partial" but then "perfect" → slight boost
  if (lastRank <= 1 && currentRank >= 2) {
    return Math.min(100, currentCalibration + 5);
  }

  return currentCalibration;
}

/**
 * Metric Smoothing: Apply exponential weighted moving average to avoid volatile swings.
 * alpha controls smoothing (0.3 = heavy smoothing, 0.7 = responsive).
 */
export function smoothMetric(previousSmoothed: number, newRaw: number, alpha: number = 0.4): number {
  return Math.round((alpha * newRaw + (1 - alpha) * previousSmoothed) * 100) / 100;
}

/**
 * Plateau Detection: Detect when memory strength or stability has stopped improving
 * over the last N revisions.
 */
export function detectPlateau(recentStrengths: number[], windowSize: number = 5): boolean {
  if (recentStrengths.length < windowSize) return false;
  const window = recentStrengths.slice(-windowSize);
  const avg = window.reduce((a, b) => a + b, 0) / window.length;
  // Check if all values are within ±5 of average (flatline)
  return window.every(v => Math.abs(v - avg) <= 5);
}

/**
 * Review Quality Score: Measure the quality of a revision based on multiple dimensions.
 */
export function calculateReviewQuality(params: {
  confidence: ConfidenceRating;
  mode: RevisionMode;
  timeTakenSeconds: number;
  cognitiveComplexity: number;
  hintsUsed: boolean;
}): number {
  let score = 50; // baseline

  // Confidence contribution (0-30 points)
  const confPoints: Record<ConfidenceRating, number> = { perfect: 30, partial: 20, hint: 10, forgot: 0 };
  score += confPoints[params.confidence];

  // Mode contribution (0-10 points)
  score += params.mode === "full" ? 10 : 5;

  // Time quality: not too fast (cheese), not too slow (struggle)
  const idealTime = params.cognitiveComplexity * 60; // complexity * 1 minute
  const timeRatio = params.timeTakenSeconds / idealTime;
  if (timeRatio >= 0.5 && timeRatio <= 2.0) {
    score += 10; // good pacing
  } else if (timeRatio < 0.3) {
    score -= 10; // suspiciously fast
  }

  // No hints bonus
  if (!params.hintsUsed && params.confidence !== "hint") {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}
