import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Target, Brain } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [problemsRes, topicsRes, logsRes, profileRes] = await Promise.all([
    supabase.from("problems").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_deleted", false),
    supabase.from("topic_stats").select("*").eq("user_id", user.id).order("mastery_score", { ascending: false }),
    supabase.from("revision_logs").select("rating").eq("user_id", user.id),
    supabase.from("users").select("total_xp, level").eq("id", user.id).single(),
  ]);

  const totalProblems = problemsRes.count || 0;
  const topics = topicsRes.data || [];
  const logs = logsRes.data || [];
  const profile = profileRes.data;

  const ratingDist = { easy: 0, medium: 0, hard: 0, forgot: 0 };
  logs.forEach((l) => { if (l.rating in ratingDist) ratingDist[l.rating as keyof typeof ratingDist]++; });
  const totalRevisions = logs.length;
  const accuracy = totalRevisions > 0 ? Math.round(((ratingDist.easy + ratingDist.medium) / totalRevisions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your preparation progress</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Problems Solved", value: totalProblems, icon: Brain, color: "text-primary" },
          { label: "Total Revisions", value: totalRevisions, icon: BarChart3, color: "text-chart-2" },
          { label: "Recall Accuracy", value: `${accuracy}%`, icon: Target, color: "text-emerald-400" },
          { label: "Total XP", value: profile?.total_xp || 0, icon: TrendingUp, color: "text-amber-400" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Distribution */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Rating Distribution</CardTitle></CardHeader>
        <CardContent>
          {totalRevisions === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Complete some revisions to see your rating distribution.</p>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Easy", count: ratingDist.easy, color: "bg-emerald-500" },
                { label: "Medium", count: ratingDist.medium, color: "bg-amber-500" },
                { label: "Hard", count: ratingDist.hard, color: "bg-orange-500" },
                { label: "Forgot", count: ratingDist.forgot, color: "bg-red-500" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="w-16 text-sm">{r.label}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${(r.count / totalRevisions) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm text-muted-foreground">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topic Mastery */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Topic Mastery</CardTitle></CardHeader>
        <CardContent>
          {topics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Import problems to see topic mastery scores.</p>
          ) : (
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.topic_name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{topic.topic_name} <span className="text-muted-foreground">({topic.problems_solved} problems)</span></span>
                    <span className="font-medium">{Math.round(topic.mastery_score)}%</span>
                  </div>
                  <Progress value={topic.mastery_score} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
