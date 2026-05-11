import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { calculateNextInterval, type Rating } from "@/lib/spaced-repetition/engine";
import { XP_AWARDS } from "@/lib/spaced-repetition/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { problem_id, rating, time_taken_seconds, reveals_used, notes, mode = 'full' } = body;

  if (!problem_id || !rating) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Get current schedule
  const { data: schedule } = await supabase.from("revision_schedules").select("*").eq("problem_id", problem_id).eq("user_id", user.id).single();

  if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });

  // Calculate next interval
  const result = calculateNextInterval({
    rating: rating as Rating,
    currentInterval: schedule.current_interval,
    easeFactor: parseFloat(schedule.ease_factor),
    revisionNumber: schedule.revision_count,
    confidenceLevel: schedule.confidence_level,
  });

  const nextDate = result.nextRevisionDate.toISOString().split("T")[0];

  // Update revision schedule
  await supabase.from("revision_schedules").update({
    revision_count: schedule.revision_count + 1,
    next_revision_date: nextDate,
    last_revised_at: new Date().toISOString(),
    ease_factor: result.newEaseFactor,
    current_interval: result.newInterval,
    confidence_level: result.newConfidenceLevel,
  }).eq("id", schedule.id);

  // Update problem confidence
  await supabase.from("problems").update({ confidence_level: result.newConfidenceLevel }).eq("id", problem_id);

  // Insert revision log
  await supabase.from("revision_logs").insert({
    user_id: user.id,
    problem_id,
    rating,
    time_taken_seconds,
    revision_number: schedule.revision_count + 1,
    interval_before: schedule.current_interval,
    interval_after: result.newInterval,
    ease_before: parseFloat(schedule.ease_factor),
    ease_after: result.newEaseFactor,
    reveals_used,
    notes,
    mode,
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

  return NextResponse.json({
    next_revision_date: nextDate,
    interval_days: result.newInterval,
    xp_awarded: xpAmount,
    streak_updated: true,
    new_confidence: result.newConfidenceLevel,
  });
}
