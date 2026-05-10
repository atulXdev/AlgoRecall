import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProblemDetailContent from "@/components/problems/problem-detail-content";

export default async function ProblemDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string }> }) {
  const { id } = await params;
  const { mode } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: problem } = await supabase.from("problems").select("*").eq("id", id).eq("user_id", user.id).single();
  if (!problem) notFound();

  const { data: schedule } = await supabase.from("revision_schedules").select("*").eq("problem_id", id).eq("user_id", user.id).single();

  const { data: revisionHistory } = await supabase.from("revision_logs").select("*").eq("problem_id", id).eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);

  return <ProblemDetailContent problem={problem} schedule={schedule} revisionHistory={revisionHistory || []} />;
}
