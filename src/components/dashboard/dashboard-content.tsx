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
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HeatmapGrid from "./heatmap-grid";
import {
  HEALTH_DISPLAY_LABELS,
  HEALTH_DISPLAY_COLORS,
  LEARNING_MODES,
  generateQueueExplanation,
  generateCognitiveLoadExplanation,
} from "@/lib/spaced-repetition/explainability";
import type { HealthStatus } from "@/lib/spaced-repetition/engine";

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
  learningMode?: string;
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

export default function DashboardContent({ profile, focusQueue, backlogSize, dormantCount, revisedToday, streak, topicStats, todayActivity, heatmapData, totalProblems, learningMode = "balanced" }: DashboardContentProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const completedToday = todayActivity?.revision_count || 0;
  const totalDue = focusQueue.length;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
  const isRecoveryMode = profile?.recovery_mode;
  const currentFocus = profile?.current_focus_topic;
  const modeConfig = LEARNING_MODES[learningMode] || LEARNING_MODES.balanced;

  // Calculate Cognitive Load
  const totalCognitiveLoad = focusQueue.reduce((acc, item) => acc + (item.problems?.cognitive_complexity || 5), 0);
  const loadLabel = totalCognitiveLoad < 20 ? "Light Day" : totalCognitiveLoad < 50 ? "Medium Day" : "Deep Focus Day";
  const loadColor = totalCognitiveLoad < 20 ? "text-emerald-400" : totalCognitiveLoad < 50 ? "text-amber-400" : "text-red-400";
  const loadExplanation = generateCognitiveLoadExplanation(totalCognitiveLoad, focusQueue.length);

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
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground">
            {totalDue > 0 ? `You have ${totalDue} problem${totalDue > 1 ? "s" : ""} to revise today.` : "You're all caught up! 🎉"}
          </p>
          {/* Learning Mode Badge */}
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
            <Zap className="h-3 w-3" />
            {modeConfig.label}
          </Badge>
        </div>
        {/* Trust Widget: Cognitive Load Explanation */}
        {totalDue > 0 && (
          <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
            <Info className="h-3 w-3" /> {loadExplanation}
          </p>
        )}
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Focus Queue", value: focusQueue.length, icon: Calendar, color: "text-primary", subtitle: loadLabel, subColor: loadColor },
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
                    {stat.subtitle && <p className={`text-[10px] font-medium mt-0.5 ${stat.subColor}`}>{stat.subtitle}</p>}
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
                  <ProblemRow key={item.id} item={item} currentFocusTopic={currentFocus} />
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Recovery Mode Alert */}
          {isRecoveryMode && (
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Recovery Mode Active</span>
              </div>
              <span className="text-emerald-400/80 text-xs text-right max-w-xs">We&apos;ve reduced your queue to help you ease back in safely. It will auto-deactivate once you start revising.</span>
            </div>
          )}

          {/* Backlog Alert */}
          {backlogSize > 0 && !isRecoveryMode && (
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">You have {backlogSize} problem{backlogSize > 1 ? "s" : ""} waiting in your backlog.</span>
              </div>
              <span className="text-muted-foreground text-xs">These will gradually appear in your Focus Queue over the coming days.</span>
            </div>
          )}

          {/* Dormant Alert */}
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
                  Topics Needing Attention
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

          {/* Progressive Disclosure: Advanced Analytics */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAdvanced ? "Hide" : "Show"} Advanced Insights
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Memory Health Distribution */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-muted-foreground font-medium">Memory Health Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(["mastered", "strong", "relearning", "fragile", "forgotten"] as HealthStatus[]).map((status) => {
                      const count = focusQueue.filter(item => (item.health_status || "relearning") === status).length;
                      if (count === 0) return null;
                      return (
                        <div key={status} className="flex items-center justify-between text-xs">
                          <span className={HEALTH_DISPLAY_COLORS[status]}>{HEALTH_DISPLAY_LABELS[status]}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Learning Mode Info */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">{modeConfig.label} Mode</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{modeConfig.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
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

function ProblemRow({ item, currentFocusTopic }: { item: any; currentFocusTopic?: string }) {
  const problem = item.problems;
  const healthStatus = (item.health_status || "relearning") as HealthStatus;
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Determine if it was from backlog implicitly
  const isBacklog = new Date(item.next_revision_date).getTime() < new Date(new Date().toISOString().split("T")[0]).getTime();

  // Generate queue explanation
  const explanation = generateQueueExplanation(item, currentFocusTopic);

  return (
    <div className="space-y-0">
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
                <span className={`text-[10px] font-medium ${HEALTH_DISPLAY_COLORS[healthStatus]}`}>
                  {HEALTH_DISPLAY_LABELS[healthStatus]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-xs text-muted-foreground">STR: {Math.round(item.memory_strength || 0)}</div>
            <ConfidenceDots level={problem.confidence_level} />
            {/* Trust: Why this appeared */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowExplanation(!showExplanation); }}
              className="text-muted-foreground/50 hover:text-primary transition-colors"
              title="Why this appeared"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
      {/* Expandable explanation — Trust Widget */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2 text-[11px] text-muted-foreground/80 bg-secondary/30 rounded-b-lg border-x border-b border-border/30 flex items-center gap-2">
              <Info className="h-3 w-3 shrink-0" />
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
