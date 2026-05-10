import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [profileRes, dueRes, streakRes, topicRes, activityRes, heatmapRes, countRes, revisedRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("revision_schedules").select("*, problems!inner(id, title, topic, difficulty, platform, tags, confidence_level, date_solved, url, is_deleted, created_at)").eq("user_id", user.id).eq("problems.is_deleted", false).lte("next_revision_date", today).order("next_revision_date", { ascending: true }),
    supabase.from("streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("topic_stats").select("*").eq("user_id", user.id).order("mastery_score", { ascending: true }).limit(5),
    supabase.from("daily_activity").select("*").eq("user_id", user.id).eq("activity_date", today).single(),
    supabase.from("daily_activity").select("activity_date, revision_count, new_problems").eq("user_id", user.id).gte("activity_date", new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0]).order("activity_date", { ascending: true }),
    supabase.from("problems").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_deleted", false),
    supabase.from("revision_logs").select("*, problems!inner(id, title, topic, difficulty, platform, confidence_level)").eq("user_id", user.id).gte("created_at", today).order("created_at", { ascending: false }),
  ]);

  // Sort by next_revision_date (done by DB), then by problems.created_at descending for items with the same revision date
  const sortedRevisions = (dueRes.data || []).sort((a, b) => {
    if (a.next_revision_date === b.next_revision_date) {
      // @ts-ignore
      return new Date(b.problems?.created_at || 0).getTime() - new Date(a.problems?.created_at || 0).getTime();
    }
    return 0; // DB already sorted by next_revision_date ascending
  });

  const overdue = sortedRevisions.filter((r) => r.next_revision_date < today);
  const dueToday = sortedRevisions.filter((r) => r.next_revision_date === today);

  return (
    <DashboardContent
      profile={profileRes.data}
      overdue={overdue}
      dueToday={dueToday}
      revisedToday={revisedRes.data || []}
      streak={streakRes.data}
      topicStats={topicRes.data || []}
      todayActivity={activityRes.data}
      heatmapData={heatmapRes.data || []}
      totalProblems={countRes.count || 0}
    />
  );
}
