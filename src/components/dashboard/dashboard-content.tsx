"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Flame,
  ArrowRight,
  PartyPopper,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HeatmapGrid from "./heatmap-grid";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DashboardContentProps {
  profile: any;
  focusQueue: any[];
  backlogSize: number;
  dormantCount: number;
  revisedToday: any[];
  streak: any;
  topicStats: any[];
  todayActivity: any;
  heatmapData: any[];
  totalProblems: number;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Hard: "bg-red-500/15 text-red-400 border-red-500/20",
};

function ConfidenceDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`confidence-dot ${i <= level ? "active" : "inactive"}`} />
      ))}
    </div>
  );
}

export default function DashboardContent({ profile, focusQueue, backlogSize, dormantCount, revisedToday, streak, topicStats, todayActivity, heatmapData, totalProblems }: DashboardContentProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const completedToday = todayActivity?.revision_count || 0;
  const totalDue = focusQueue.length;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Sync complete!", {
          description: `${data.newProblems} new, ${data.updatedProblems} updated`,
        });
        router.refresh();
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">
          {greeting}, {profile?.display_name || profile?.github_username || "there"}{" "}
          {streak?.current_revision_streak > 0 && (
            <span className="inline-flex items-center gap-1 text-orange-400">
              <Flame className="h-5 w-5" /> {streak.current_revision_streak}-day streak
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">
          {totalDue > 0 ? `You have ${totalDue} problem${totalDue > 1 ? "s" : ""} to revise today.` : "You're all caught up! 🎉"}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Focus Queue", value: focusQueue.length, icon: Calendar, color: "text-primary" },
          { label: "Backlog", value: backlogSize, icon: BookOpen, color: backlogSize > 0 ? "text-amber-400" : "text-muted-foreground" },
          { label: "Completed Today", value: completedToday, icon: CheckCircle2, color: completedToday >= 10 ? "text-emerald-400" : "text-amber-400", isGoal: true },
          { label: "Total Problems", value: totalProblems, icon: BookOpen, color: "text-chart-3" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="border-border/50 bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}{stat.isGoal ? " / 10" : ""}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-30`} />
                </div>
                {stat.isGoal && (
                  <div className="space-y-1">
                    <Progress value={Math.min(100, (stat.value / 10) * 100)} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground text-right">{stat.value >= 10 ? "Daily goal reached! 🎉" : `${10 - stat.value} more to go`}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revision List - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Focus Queue Section */}
          {focusQueue.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-primary" />
                  Today&apos;s Focus Queue — {focusQueue.length} problem{focusQueue.length > 1 ? "s" : ""}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Your recommended revisions for today. Take it easy and focus on mastering these.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {focusQueue.map((item) => (
                  <ProblemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Backlog Alert (soft) */}
          {backlogSize > 0 && (
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">You have {backlogSize} problem{backlogSize > 1 ? "s" : ""} waiting in your backlog.</span>
              </div>
              <span className="text-muted-foreground text-xs">These will gradually appear in your Focus Queue over the coming days.</span>
            </div>
          )}

          {/* Dormant Alert (soft) */}
          {dormantCount > 0 && (
            <div className="rounded-lg bg-secondary/50 border border-border/50 p-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">{dormantCount} historical problem{dormantCount > 1 ? "s" : ""} imported.</span>
              </div>
              <span className="text-muted-foreground text-xs text-right max-w-xs">We&apos;ll smartly queue these up over time so you don&apos;t get overwhelmed.</span>
            </div>
          )}

          {/* Revised Today Section */}
          {revisedToday.length > 0 && (
            <Card className="border-border/50 bg-emerald-500/5 border-emerald-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-400 text-base">
                  <CheckCircle2 className="h-4 w-4" />
                  Revised Today — {revisedToday.length} problem{revisedToday.length > 1 ? "s" : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {revisedToday.map((item) => (
                  <ProblemRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {totalDue === 0 && (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <PartyPopper className="h-12 w-12 text-chart-2 mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                  {totalProblems === 0 ? "No problems yet" : "You\u0027re all caught up!"}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {totalProblems === 0
                    ? "Sync your GitHub repo to import problems."
                    : "No revisions due today. Great job staying on track."}
                </p>
                {totalProblems === 0 && (
                  <Button onClick={handleSync} disabled={syncing} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync GitHub Repo"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Weak Topics */}
          {topicStats.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  Weak Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topicStats.slice(0, 3).map((topic) => (
                  <div key={topic.topic_name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{topic.topic_name}</span>
                      <span className="text-muted-foreground">{Math.round(topic.mastery_score)}%</span>
                    </div>
                    <Progress value={topic.mastery_score} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Streak Card */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2.5">
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold">{streak?.current_revision_streak || 0} Day Streak</p>
                  <p className="text-xs text-muted-foreground">Longest: {streak?.longest_revision_streak || 0} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Heatmap */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatmapGrid data={heatmapData} />
        </CardContent>
      </Card>
    </div>
  );
}

function ProblemRow({ item }: { item: any }) {
  const problem = item.problems;
  // Determine if it was from backlog implicitly, but don't show red danger text
  const isBacklog = new Date(item.next_revision_date).getTime() < new Date(new Date().toISOString().split("T")[0]).getTime();

  return (
    <Link href={`/problems/${problem.id}?mode=blind`} className="block">
      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 transition-all hover:bg-accent/50 hover:border-primary/20 group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{problem.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{problem.topic}</Badge>
              {problem.difficulty && (
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColor[problem.difficulty]}`}>
                  {problem.difficulty}
                </Badge>
              )}
              {isBacklog && <span className="text-[10px] text-amber-400">Backlog</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ConfidenceDots level={problem.confidence_level} />
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
