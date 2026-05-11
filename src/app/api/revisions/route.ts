import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { calculateNextInterval } from "@/lib/spaced-repetition/engine";
import { XP_AWARDS } from "@/lib/spaced-repetition/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { problem_id, rating, confidence, time_taken_seconds, reveals_used, notes, mode = 'full' } = body;

  const actualConfidence = confidence || (rating === 'easy' ? 'perfect' : rating === 'medium' ? 'partial' : rating === 'hard' ? 'hint' : 'forgot');

  if (!problem_id || !actualConfidence) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Get current schedule with problem data
  const { data: schedule } = await supabase.from("revision_schedules").select("*, problems(cognitive_complexity)").eq("problem_id", problem_id).eq("user_id", user.id).single();
  if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });

  // Fetch the last revision log to get previous confidence for calibration
  const { data: lastLog } = await supabase.from("revision_logs")
    .select("confidence_rating")
    .eq("problem_id", problem_id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Calculate next interval with full trust layer
  const result = calculateNextInterval({
    mode: mode as any,
    confidence: actualConfidence as any,
    currentInterval: schedule.current_interval,
    memoryStrength: schedule.memory_strength || 0,
    revisionNumber: schedule.revision_count,
    cognitiveComplexity: schedule.problems?.cognitive_complexity || 5,
    lastRevisionDate: schedule.last_revised_at,
    stabilityScore: schedule.recall_stability_score || 100,
    memoryFloor: schedule.memory_floor || 0,
    confidenceCalibration: schedule.confidence_calibration_score || 100,
    lastConfidenceRating: lastLog?.confidence_rating || null,
    timeTakenSeconds: time_taken_seconds,
    hintsUsed: reveals_used?.hint || actualConfidence === "hint",
  });

  const nextDate = result.nextRevisionDate.toISOString().split("T")[0];

  // Update revision schedule with all new trust-layer fields
  await supabase.from("revision_schedules").update({
    revision_count: schedule.revision_count + 1,
    next_revision_date: nextDate,
    last_revised_at: new Date().toISOString(),
    memory_strength: result.newMemoryStrength,
    health_status: result.newHealthStatus,
    current_interval: result.newInterval,
    confidence_level: result.newHealthStatus === "mastered" ? 5 : result.newHealthStatus === "strong" ? 4 : 3,
    recall_stability_score: result.newStabilityScore,
    memory_floor: result.newMemoryFloor,
    confidence_calibration_score: result.newConfidenceCalibration,
    plateau_detected: false, // Reset on new revision
  }).eq("id", schedule.id);

  // Update problem confidence
  await supabase.from("problems").update({ confidence_level: result.newHealthStatus === "mastered" ? 5 : 3 }).eq("id", problem_id);

  // Insert revision log with full explainability
  await supabase.from("revision_logs").insert({
    user_id: user.id,
    problem_id,
    rating: rating || "medium",
    confidence_rating: actualConfidence,
    time_taken_seconds,
    revision_number: schedule.revision_count + 1,
    interval_before: schedule.current_interval,
    interval_after: result.newInterval,
    memory_strength_before: schedule.memory_strength || 0,
    memory_strength_after: result.newMemoryStrength,
    health_before: schedule.health_status,
    health_after: result.newHealthStatus,
    reveals_used,
    notes,
    mode,
    cheese_penalty_applied: result.cheesePenaltyApplied,
    review_quality_score: result.reviewQualityScore,
    explanation_metadata: result.explanationMetadata,
  });

  // Award XP
  const xpKey = `revision_${rating}` as keyof typeof XP_AWARDS;
  const xpAmount = XP_AWARDS[xpKey] || 5;

  await supabase.from("xp_logs").insert({ user_id: user.id, action: `revision_${rating}`, xp_amount: xpAmount, metadata: { problem_id } });
  await supabase.from("users").update({ total_xp: (await supabase.from("users").select("total_xp").eq("id", user.id).single()).data?.total_xp + xpAmount }).eq("id", user.id);

  // Update daily activity
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await supabase.from("daily_activity").select("*").eq("user_id", user.id).eq("activity_date", today).single();

  if (existing) {
    await supabase.from("daily_activity").update({ revision_count: existing.revision_count + 1, xp_earned: existing.xp_earned + xpAmount }).eq("id", existing.id);
  } else {
    await supabase.from("daily_activity").insert({ user_id: user.id, activity_date: today, revision_count: 1, xp_earned: xpAmount });
  }

  // Update streak
  const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", user.id).single();
  if (streak) {
    const lastDate = streak.last_revision_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let newStreak = streak.current_revision_streak;

    if (lastDate === today) {
      // Already revised today
    } else if (lastDate === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    await supabase.from("streaks").update({
      current_revision_streak: newStreak,
      longest_revision_streak: Math.max(streak.longest_revision_streak, newStreak),
      last_revision_date: today,
    }).eq("id", streak.id);
  }

  // Disable recovery mode if user is actively revising
  const { data: profile } = await supabase.from("users").select("recovery_mode").eq("id", user.id).single();
  if (profile?.recovery_mode) {
    await supabase.from("users").update({ recovery_mode: false }).eq("id", user.id);
  }

  return NextResponse.json({
    next_revision_date: nextDate,
    interval_days: result.newInterval,
    xp_awarded: xpAmount,
    streak_updated: true,
    new_memory_strength: result.newMemoryStrength,
    new_health_status: result.newHealthStatus,
    review_quality: result.reviewQualityScore,
    explanation: result.explanationMetadata,
  });
}
