import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Interview Simulation Session Generator
 * Creates a mixed-topic, timed session with controlled cognitive pressure.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { duration_minutes = 45, difficulty_mix = "balanced" } = body;

  // Fetch all active problems for the user with their schedules
  const { data: schedules } = await supabase
    .from("revision_schedules")
    .select("*, problems!inner(id, title, topic, difficulty, cognitive_complexity, patterns, is_deleted, state)")
    .eq("user_id", user.id)
    .eq("problems.is_deleted", false)
    .in("problems.state", ["active", "learning"]);

  if (!schedules || schedules.length === 0) {
    return NextResponse.json({ error: "No problems available for simulation" }, { status: 400 });
  }

  // Categorize by topic and difficulty
  const topicGroups: Record<string, typeof schedules> = {};
  for (const s of schedules) {
    const topic = s.problems?.topic || "Other";
    if (!topicGroups[topic]) topicGroups[topic] = [];
    topicGroups[topic].push(s);
  }

  const topics = Object.keys(topicGroups);
  const targetProblems = Math.min(Math.floor(duration_minutes / 5), 12); // ~5 min per problem, max 12

  // Build a diverse session with controlled randomness
  const session: typeof schedules = [];
  const usedIds = new Set<string>();

  // Strategy: pick from as many topics as possible, prefer fragile/relearning, mix difficulties
  const priorityPool = schedules
    .filter(s => s.health_status === "fragile" || s.health_status === "relearning" || s.health_status === "forgotten")
    .sort(() => Math.random() - 0.5);

  const strongPool = schedules
    .filter(s => s.health_status === "strong" || s.health_status === "mastered")
    .sort(() => Math.random() - 0.5);

  // 60% from priority (weak), 40% from strong (breadth testing)
  const weakTarget = Math.ceil(targetProblems * 0.6);
  const strongTarget = targetProblems - weakTarget;

  const addFromPool = (pool: typeof schedules, target: number) => {
    // Spread across topics
    const topicCounts: Record<string, number> = {};
    for (const item of pool) {
      if (session.length >= targetProblems) break;
      if (usedIds.has(item.problems.id)) continue;
      const topic = item.problems?.topic || "Other";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      if (topicCounts[topic] > Math.ceil(target / Math.max(topics.length, 1)) + 1) continue;
      session.push(item);
      usedIds.add(item.problems.id);
    }
  };

  addFromPool(priorityPool, weakTarget);
  addFromPool(strongPool, strongTarget);

  // Shuffle the final session to simulate random topic switching
  const shuffled = session.sort(() => Math.random() - 0.5);

  // Calculate session metadata
  const totalComplexity = shuffled.reduce((acc, s) => acc + (s.problems?.cognitive_complexity || 5), 0);
  const avgStrength = shuffled.reduce((acc, s) => acc + (s.memory_strength || 0), 0) / Math.max(shuffled.length, 1);
  const difficultyDistribution = {
    Easy: shuffled.filter(s => s.problems?.difficulty === "Easy").length,
    Medium: shuffled.filter(s => s.problems?.difficulty === "Medium").length,
    Hard: shuffled.filter(s => s.problems?.difficulty === "Hard").length,
  };

  const topicsInSession = [...new Set(shuffled.map(s => s.problems?.topic || "Other"))];

  return NextResponse.json({
    session: shuffled.map((s, index) => ({
      order: index + 1,
      problem_id: s.problems.id,
      title: s.problems.title,
      topic: s.problems.topic,
      difficulty: s.problems.difficulty,
      cognitive_complexity: s.problems.cognitive_complexity || 5,
      memory_strength: Math.round(s.memory_strength || 0),
      health_status: s.health_status,
      suggested_time_seconds: (s.problems.cognitive_complexity || 5) * 60,
    })),
    metadata: {
      total_problems: shuffled.length,
      estimated_duration_minutes: Math.round(totalComplexity * 1.5),
      total_complexity: totalComplexity,
      average_memory_strength: Math.round(avgStrength),
      difficulty_distribution: difficultyDistribution,
      topics_covered: topicsInSession,
      pressure_level: totalComplexity > 50 ? "high" : totalComplexity > 30 ? "medium" : "low",
    },
  });
}
