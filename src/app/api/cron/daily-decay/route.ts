import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Simple auth check for cron services like Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 });
  }

  // Initialize with service role to bypass RLS for background jobs
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Identify users who need recovery mode (missed 3+ days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: inactiveUsers } = await supabase
      .from("users")
      .select("id, last_synced_at")
      .lt("last_synced_at", threeDaysAgo.toISOString());

    if (inactiveUsers && inactiveUsers.length > 0) {
      const userIds = inactiveUsers.map(u => u.id);
      await supabase
        .from("users")
        .update({ recovery_mode: true })
        .in("id", userIds);
    }

    // 2. Perform Passive Memory Decay on Revision Schedules
    // Only decay schedules that are 'active' or 'relearning', not 'mastered'
    
    // Fetch all non-mastered schedules
    const { data: schedules } = await supabase
      .from("revision_schedules")
      .select("id, memory_strength, last_revised_at, health_status")
      .neq("health_status", "mastered")
      .not("last_revised_at", "is", null);

    if (schedules) {
      const updates = schedules.map(schedule => {
        // Calculate days since last revision
        const daysSinceRevision = Math.floor(
          (Date.now() - new Date(schedule.last_revised_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        let decayAmount = 0;
        
        // Topic/Pattern decay curves could be applied here by joining problem topics
        // Simple decay: 1 point per day after 3 days of inactivity
        if (daysSinceRevision > 3) {
          decayAmount = (daysSinceRevision - 3) * 1.5;
        }

        if (decayAmount > 0) {
          const newStrength = Math.max(0, schedule.memory_strength - decayAmount);
          let newHealth = schedule.health_status;
          
          if (newStrength < 20) newHealth = "forgotten";
          else if (newStrength < 40) newHealth = "fragile";
          else if (newStrength < 70) newHealth = "relearning";

          return {
            id: schedule.id,
            memory_strength: newStrength,
            health_status: newHealth
          };
        }
        return null;
      }).filter((item): item is NonNullable<typeof item> => Boolean(item));

      // Batch update the decayed schedules
      // Supabase doesn't natively support bulk upsert easily without an RPC, so we do it sequentially or via Promise.all
      // In production with millions of rows, this should be an RPC function inside PostgreSQL.
      if (updates.length > 0) {
        // Chunk updates to avoid massive payload limits
        const chunkSize = 100;
        for (let i = 0; i < updates.length; i += chunkSize) {
          const chunk = updates.slice(i, i + chunkSize);
          await supabase.from("revision_schedules").upsert(chunk);
        }
      }
    }

    return NextResponse.json({ success: true, processed: inactiveUsers?.length || 0 });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
