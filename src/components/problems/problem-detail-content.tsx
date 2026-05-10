"use client";

import { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Eye, ExternalLink, BookOpen } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Hard: "bg-red-500/15 text-red-400",
};



export default function ProblemDetailContent({ problem, schedule, revisionHistory }: { problem: any; schedule: any; revisionHistory: any[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [notes, setNotes] = useState(problem.user_notes_json?.text || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesRevealed, setNotesRevealed] = useState(false);

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("problems").update({ user_notes_json: { text: notes } }).eq("id", problem.id);
      if (error) throw error;
      toast.success("Notes saved successfully");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleRevise = useCallback(async () => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Always send "medium" to advance exactly 1 step in the spaced repetition sequence (1, 3, 7, 15, 30, 60)
      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: problem.id,
          rating: "medium", 
          time_taken_seconds: 0,
          reveals_used: { code: false, hint: false, intuition: false },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Revision recorded! Next review in ${data.interval_days} day${data.interval_days > 1 ? "s" : ""}.`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to submit revision");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, [problem.id, router]);

  const lastRevisedDate = revisionHistory.length > 0 
    ? new Date(revisionHistory[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Never";

  const isRevisedToday = revisionHistory.length > 0 && 
    new Date(revisionHistory[0].created_at).toDateString() === new Date().toDateString();

  const dateAdded = problem.date_solved || problem.created_at;
  const formattedDateAdded = dateAdded ? new Date(dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown";

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline">{problem.topic}</Badge>
            {problem.difficulty && <Badge variant="outline" className={difficultyColor[problem.difficulty]}>{problem.difficulty}</Badge>}
            {problem.platform && <Badge variant="outline" className="text-muted-foreground">{problem.platform}{problem.platform_id ? ` #${problem.platform_id}` : ""}</Badge>}
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> 
              Added: <span className="font-medium text-foreground">{formattedDateAdded}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 opacity-50" /> 
              Last Revised: <span className={`font-medium ${isRevisedToday ? "text-emerald-400" : "text-foreground"}`}>{isRevisedToday ? "Today" : lastRevisedDate}</span>
            </span>
            {problem.url && (
              <a href={problem.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                <ExternalLink className="h-4 w-4" /> Problem Link
              </a>
            )}
            {schedule && <span>Total Revisions: {schedule.revision_count}</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Button onClick={handleRevise} disabled={submitting} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-sm font-medium">
            <Eye className="h-4 w-4" />
            {submitting ? "Saving..." : "Mark as Revised"}
          </Button>
          <Button onClick={saveNotes} disabled={savingNotes || !notesRevealed} variant="secondary" size="sm" className="w-full">
            {savingNotes ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>

      <Separator className="shrink-0" />

      {/* Focused Notes Editor */}
      <div className="flex-1 flex flex-col min-h-0 bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Your Notes</span>
        </div>
        {!notesRevealed ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-card/30">
            <Button onClick={() => setNotesRevealed(true)} variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Reveal Notes
            </Button>
          </div>
        ) : (
          <textarea 
            className="flex-1 w-full p-6 text-base text-foreground bg-transparent border-none focus:outline-none focus:ring-0 resize-none leading-relaxed"
            placeholder="Add your personal notes, intuition, hints, or approach here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
