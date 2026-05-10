import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { syncRepository } from "@/lib/github/sync-engine";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's repo info
  const { data: profile } = await supabase
    .from("users")
    .select("repo_owner, repo_name, github_access_token")
    .eq("id", user.id)
    .single();

  if (!profile?.repo_owner || !profile?.repo_name) {
    return NextResponse.json(
      { error: "No repository connected. Go to Settings to connect your GitHub repo." },
      { status: 400 }
    );
  }

  try {
    const result = await syncRepository(
      supabase,
      user.id,
      profile.repo_owner,
      profile.repo_name,
      profile.github_access_token || undefined
    );

    return NextResponse.json({
      success: true,
      ...result,
      message: `Sync complete: ${result.newProblems} new, ${result.updatedProblems} updated, ${result.skipped} unchanged`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Sync failed: ${message}` }, { status: 500 });
  }
}
