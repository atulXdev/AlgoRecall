import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { LEARNING_MODES } from "@/lib/spaced-repetition/explainability";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [profileRes, dueRes, streakRes, topicRes, activityRes, heatmapRes, countRes, revisedRes, dormantRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("revision_schedules").select("*, problems!inner(id, title, topic, difficulty, platform, tags, confidence_level, date_solved, url, is_deleted, created_at, state, cognitive_complexity)").eq("user_id", user.id).eq("problems.is_deleted", false).in("problems.state", ["active", "learning"]).lte("next_revision_date", today).order("next_revision_date", { ascending: true }),
    supabase.from("streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("topic_stats").select("*").eq("user_id", user.id).order("mastery_score", { ascending: true }).limit(5),
    supabase.from("daily_activity").select("*").eq("user_id", user.id).eq("activity_date", today).single(),
    supabase.from("daily_activity").select("activity_date, revision_count, new_problems").eq("user_id", user.id).gte("activity_date", new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0]).order("activity_date", { ascending: true }),
    supabase.from("problems").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_deleted", false),
    supabase.from("revision_logs").select("*, problems!inner(id, title, topic, difficulty, platform, confidence_level)").eq("user_id", user.id).gte("created_at", today).order("created_at", { ascending: false }),
    supabase.from("problems").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("state", "dormant").eq("is_deleted", false),
  ]);

  const currentFocus = profileRes.data?.current_focus_topic;
  const isRecoveryMode = profileRes.data?.recovery_mode || false;
  const isPaused = profileRes.data?.paused_until && new Date(profileRes.data.paused_until) > new Date();
  const learningMode = profileRes.data?.learning_mode || "balanced";
  const modeConfig = LEARNING_MODES[learningMode] || LEARNING_MODES.balanced;

  // If paused, return an empty focus queue
  if (isPaused) {
    return (
      <DashboardContent
        profile={profileRes.data}
        focusQueue={[]}
        backlogSize={(dueRes.data || []).length}
        dormantCount={dormantRes.count || 0}
        revisedToday={revisedRes.data || []}
        streak={streakRes.data}
        topicStats={topicRes.data || []}
        todayActivity={activityRes.data}
        heatmapData={heatmapRes.data || []}
        totalProblems={countRes.count || 0}
        learningMode={learningMode}
      />
    );
  }

  // Learning mode-aware queue size
  const baseLimit = profileRes.data?.daily_revision_limit || 10;
  const modeMultiplier = isRecoveryMode ? 0.4 : modeConfig.queueMultiplier;
  const dailyRevisionLimit = Math.max(3, Math.round(baseLimit * modeMultiplier));
  
  // QUEUE BALANCING ALGORITHM with learning mode weights
  const allDue = dueRes.data || [];
  const weakBoost = modeConfig.weakTopicBoost;
  
  const topicFocusPool = allDue.filter(r => r.problems?.topic?.toLowerCase() === currentFocus?.toLowerCase());
  const weakRecoveryPool = allDue
    .filter(r => r.health_status === 'forgotten' || r.health_status === 'fragile' || r.memory_strength < 40)
    .sort((a, b) => (a.memory_strength || 0) - (b.memory_strength || 0)); // weakest first
  const stabilizationPool = allDue.filter(r => r.health_status === 'relearning' || (r.memory_strength >= 40 && r.memory_strength < 70));
  
  const focusQueue: typeof allDue = [];
  const addedIds = new Set<string>();

  const addItems = (pool: typeof allDue, targetCount: number) => {
    let added = 0;
    for (const item of pool) {
      if (added >= targetCount) break;
      if (!addedIds.has(item.id)) {
        focusQueue.push(item);
        addedIds.add(item.id);
        added++;
      }
    }
  };

  // Target distributions — adjusted by learning mode
  const topicTarget = Math.floor(dailyRevisionLimit * 0.4);
  const weakTarget = Math.floor(dailyRevisionLimit * 0.3 * weakBoost);
  const stabTarget = Math.floor(dailyRevisionLimit * 0.2);

  addItems(topicFocusPool, topicTarget);
  addItems(weakRecoveryPool, weakTarget);
  addItems(stabilizationPool, stabTarget);
  
  // Fill remaining with earliest due
  const remainingTarget = dailyRevisionLimit - focusQueue.length;
  if (remainingTarget > 0) {
    const randomPool = allDue.sort((a, b) => new Date(a.next_revision_date).getTime() - new Date(b.next_revision_date).getTime());
    addItems(randomPool, remainingTarget);
  }

  // Sort final queue
  const combinedQueue = focusQueue.sort((a, b) => new Date(a.next_revision_date).getTime() - new Date(b.next_revision_date).getTime());
  const backlogPoolSize = Math.max(0, allDue.length - combinedQueue.length);
  const dormantCount = dormantRes.count || 0;

  return (
    <DashboardContent
      profile={profileRes.data}
      focusQueue={combinedQueue}
      backlogSize={backlogPoolSize}
      dormantCount={dormantCount}
      revisedToday={revisedRes.data || []}
      streak={streakRes.data}
      topicStats={topicRes.data || []}
      todayActivity={activityRes.data}
      heatmapData={heatmapRes.data || []}
      totalProblems={countRes.count || 0}
      learningMode={learningMode}
    />
  );
}
