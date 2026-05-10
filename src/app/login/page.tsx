"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "repo read:user user:email",
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-2xl shadow-primary/5">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="text-primary">AlgoRecall</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to start your revision journey
              </p>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleGitHubLogin}
            size="lg"
            className="w-full gap-3 text-base"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>

          {/* Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chart-2" />
              <span>We only request read access to your repositories</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chart-2" />
              <span>Your code stays on GitHub — we never store it</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chart-2" />
              <span>Free forever for core features</span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
