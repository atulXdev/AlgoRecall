import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { LEARNING_MODES } from "@/lib/spaced-repetition/explainability";

/**
 * User Settings API — Update learning mode, pause, and preferences
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, any> = {};

  // Learning Mode
  if (body.learning_mode && LEARNING_MODES[body.learning_mode]) {
    updates.learning_mode = body.learning_mode;
  }

  // Pause Until
  if (body.paused_until !== undefined) {
    updates.paused_until = body.paused_until; // null to unpause
  }

  // Recovery Mode manual toggle
  if (body.recovery_mode !== undefined) {
    updates.recovery_mode = body.recovery_mode;
  }

  // Daily revision limit
  if (body.daily_revision_limit && body.daily_revision_limit >= 1 && body.daily_revision_limit <= 50) {
    updates.daily_revision_limit = body.daily_revision_limit;
  }

  // Focus topic
  if (body.current_focus_topic !== undefined) {
    updates.current_focus_topic = body.current_focus_topic; // null to clear
  }

  // Interview date
  if (body.interview_date !== undefined) {
    updates.interview_date = body.interview_date;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error } = await supabase.from("users").update(updates).eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    updated: Object.keys(updates),
    mode_config: updates.learning_mode ? LEARNING_MODES[updates.learning_mode] : undefined,
  });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("learning_mode, paused_until, recovery_mode, daily_revision_limit, current_focus_topic, interview_date, energy_mode").eq("id", user.id).single();

  return NextResponse.json({
    ...profile,
    mode_config: LEARNING_MODES[profile?.learning_mode || "balanced"],
    available_modes: Object.entries(LEARNING_MODES).map(([key, config]) => ({
      key,
      ...config,
    })),
  });
}
