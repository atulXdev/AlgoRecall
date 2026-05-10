import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [defsRes, unlockedRes] = await Promise.all([
    supabase.from("achievement_definitions").select("*").order("xp_reward", { ascending: false }),
    supabase.from("user_achievements").select("achievement_id, unlocked_at").eq("user_id", user.id),
  ]);

  const definitions = defsRes.data || [];
  const unlocked = new Map(unlockedRes.data?.map((u) => [u.achievement_id, u.unlocked_at]) || []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground text-sm">{unlocked.size} of {definitions.length} unlocked</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {definitions.map((def) => {
          const isUnlocked = unlocked.has(def.id);
          const unlockedAt = unlocked.get(def.id);
          return (
            <Card key={def.id} className={`border-border/50 transition-all ${isUnlocked ? "bg-card" : "bg-muted/30 opacity-60"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${isUnlocked ? "" : "grayscale"}`}>{def.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{def.name}</h3>
                      {isUnlocked && <Trophy className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{def.description}</p>
                    {def.xp_reward > 0 && <p className="text-[10px] text-primary mt-1">+{def.xp_reward} XP</p>}
                    {isUnlocked && unlockedAt && (
                      <p className="text-[10px] text-chart-2 mt-1">Unlocked {new Date(unlockedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
