import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProblemsListContent from "@/components/problems/problems-list-content";

export default async function ProblemsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: problems } = await supabase
    .from("problems")
    .select("*, revision_schedules(next_revision_date, confidence_level, revision_count)")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  const { data: topics } = await supabase
    .from("problems")
    .select("topic")
    .eq("user_id", user.id)
    .eq("is_deleted", false);

  const uniqueTopics = [...new Set(topics?.map((t) => t.topic) || [])].sort();

  return <ProblemsListContent problems={problems || []} topics={uniqueTopics} />;
}
