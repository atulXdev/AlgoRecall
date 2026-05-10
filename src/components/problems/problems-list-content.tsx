"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Hard: "bg-red-500/15 text-red-400",
};

export default function ProblemsListContent({ problems, topics }: { problems: any[]; topics: string[] }) {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = problems;
    if (search) result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (topicFilter !== "all") result = result.filter((p) => p.topic === topicFilter);
    if (difficultyFilter !== "all") result = result.filter((p) => p.difficulty === difficultyFilter);

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title": return a.title.localeCompare(b.title);
        case "difficulty": {
          const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
        }
        case "confidence": return (a.confidence_level || 3) - (b.confidence_level || 3);
        default: return 0;
      }
    });
    return result;
  }, [problems, search, topicFilter, difficultyFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Problems</h1>
          <p className="text-muted-foreground text-sm">{problems.length} problems in your library</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search problems..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={topicFilter} onValueChange={(v) => setTopicFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Topic" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v ?? "newest")}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="confidence">Confidence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problem Cards */}
      {filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">{problems.length === 0 ? "No problems yet" : "No matching problems"}</h3>
            <p className="text-sm text-muted-foreground">{problems.length === 0 ? "Connect your GitHub repo and push some solutions to get started." : "Try adjusting your filters."}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((problem, i) => (
            <motion.div key={problem.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}>
              <Link href={`/problems/${problem.id}`}>
                <Card className="border-border/50 hover:border-primary/20 transition-all group cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{problem.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{problem.topic}</Badge>
                        {problem.difficulty && <Badge variant="outline" className={`text-[10px] ${difficultyColor[problem.difficulty]}`}>{problem.difficulty}</Badge>}
                        {problem.platform && <Badge variant="outline" className="text-[10px] text-muted-foreground">{problem.platform}</Badge>}
                        {problem.tags?.slice(0, 3).map((tag: string) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div key={l} className={`h-2 w-2 rounded-full ${l <= (problem.confidence_level || 3) ? "bg-primary" : "bg-muted"}`} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
