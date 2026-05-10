import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { repo_url } = body;

  if (!repo_url) {
    return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
  }

  // Parse: "https://github.com/atulXdev/Leetcode-Problem-Solving" or "atulXdev/Leetcode-Problem-Solving"
  let owner: string;
  let repoName: string;

  const urlMatch = repo_url.match(/github\.com\/([^/]+)\/([^/\s]+)/);
  const shortMatch = repo_url.match(/^([^/\s]+)\/([^/\s]+)$/);

  if (urlMatch) {
    owner = urlMatch[1];
    repoName = urlMatch[2].replace(/\.git$/, "");
  } else if (shortMatch) {
    owner = shortMatch[1];
    repoName = shortMatch[2].replace(/\.git$/, "");
  } else {
    return NextResponse.json({ error: "Invalid repository URL. Use format: owner/repo or https://github.com/owner/repo" }, { status: 400 });
  }

  // Verify the repo exists and is accessible
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: { "User-Agent": "AlgoRecall", Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Repository not found or not accessible: ${owner}/${repoName}` }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Could not verify repository. Check your connection." }, { status: 500 });
  }

  // Mark old problems as deleted (soft delete)
  await supabase
    .from("problems")
    .update({ is_deleted: true })
    .eq("user_id", user.id);

  // Delete old revision schedules for soft-deleted problems
  const { data: deletedProblems } = await supabase
    .from("problems")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_deleted", true);

  if (deletedProblems && deletedProblems.length > 0) {
    const ids = deletedProblems.map((p) => p.id);
    await supabase.from("revision_schedules").delete().in("problem_id", ids);
  }

  // Clear topic stats
  await supabase.from("topic_stats").delete().eq("user_id", user.id);

  // Update user with new repo
  const { error: updateError } = await supabase
    .from("users")
    .update({
      repo_owner: owner,
      repo_name: repoName,
      last_synced_at: null,
    })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: `Failed to update: ${updateError.message}` }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    repo_owner: owner,
    repo_name: repoName,
    message: `Repository changed to ${owner}/${repoName}. Click "Sync Repository" to import problems.`,
  });
}
