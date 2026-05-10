"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Search, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRepoSubmit = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a repository URL or owner/repo");
      return;
    }

    setLoading(true);

    // Parse repo URL or owner/repo format
    let owner = "";
    let repo = "";
    const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (urlMatch) {
      owner = urlMatch[1];
      repo = urlMatch[2].replace(".git", "");
    } else if (repoUrl.includes("/")) {
      [owner, repo] = repoUrl.split("/");
    } else {
      toast.error("Please enter a valid GitHub repo URL or owner/repo format");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("users").update({
      repo_owner: owner,
      repo_name: repo,
      onboarding_done: true,
    }).eq("id", user.id);

    if (error) {
      toast.error("Failed to save repository");
      setLoading(false);
      return;
    }

    setStep(3);
    setLoading(false);

    // Redirect to dashboard after brief success state
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">Algo<span className="text-primary">Recall</span></span>
          </div>
          <h1 className="text-2xl font-bold">Set Up Your Repo</h1>
          <p className="text-muted-foreground mt-1">Connect your GitHub DSA repository</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 w-16 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50 bg-card/80">
                <CardContent className="p-6 text-center space-y-4">
                  <Github className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h2 className="text-lg font-semibold">GitHub is Your Source of Truth</h2>
                  <p className="text-sm text-muted-foreground">AlgoRecall reads your GitHub DSA repository. Push problems there, and they automatically appear here with smart revision scheduling.</p>
                  <Button onClick={() => setStep(2)} className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border/50 bg-card/80">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-center">Enter Your DSA Repository</h2>
                  <p className="text-sm text-muted-foreground text-center">Paste your GitHub repo URL or enter in owner/repo format</p>
                  <Input placeholder="e.g., username/dsa-solutions or https://github.com/..." value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="text-center" />
                  <Button onClick={handleRepoSubmit} disabled={loading} className="w-full gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {loading ? "Connecting..." : "Connect Repository"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="p-6 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-400" />
                  <h2 className="text-lg font-semibold text-emerald-400">Repository Connected!</h2>
                  <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
