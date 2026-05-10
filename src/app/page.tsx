"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Flame,
  Target,
  BarChart3,
  ArrowRight,
  Zap,
  BookOpen,
  Trophy,
} from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Github,
    title: "GitHub-Native",
    description:
      "Push code to GitHub → auto-imported. Zero setup burden, zero manual data entry.",
  },
  {
    icon: Brain,
    title: "Spaced Repetition",
    description:
      "SM-2 algorithm schedules reviews at optimal intervals. Never forget a solved problem again.",
  },
  {
    icon: Target,
    title: "Blind Recall Mode",
    description:
      "Simulate real interview pressure. Only title & tags visible — prove you truly remember.",
  },
  {
    icon: BarChart3,
    title: "Pattern Mastery",
    description:
      "Track mastery per DSA topic. Know exactly where you're strong and where you're weak.",
  },
  {
    icon: Flame,
    title: "Streaks & XP",
    description:
      "Daily streaks, experience points, and levels. Turn revision into a progression game.",
  },
  {
    icon: Trophy,
    title: "Interview Readiness",
    description:
      "Data-driven readiness score. Walk into FAANG interviews with genuine confidence.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect Your GitHub Repo",
    description:
      "Sign in with GitHub and select your DSA repository. We scan it instantly.",
  },
  {
    number: "02",
    title: "Problems Auto-Imported",
    description:
      "Every solution with a README.md is parsed — title, difficulty, tags, notes, diagrams.",
  },
  {
    number: "03",
    title: "Revise & Master",
    description:
      "Smart scheduling tells you what to review daily. Rate your recall, watch mastery grow.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              Algo<span className="text-primary">Recall</span>
            </span>
          </div>
          <Link href="/login">
            <Button variant="default" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              Sign in with GitHub
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-chart-2/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              Powered by Spaced Repetition Science
            </div>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Solve Once.
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Remember Forever.
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stop forgetting solved DSA problems. AlgoRecall imports your GitHub
            solutions, schedules smart revisions, and tracks your mastery — so
            you crack interviews with real confidence.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base">
                <Github className="h-5 w-5" />
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 text-base">
              <BookOpen className="h-5 w-5" />
              See How It Works
            </Button>
          </motion.div>

          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Free forever for core features • No credit card required
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to{" "}
              <span className="text-primary">Master DSA</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Not another online judge. A memory system for developers.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/50 bg-card/50 py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Start in <span className="text-chart-2">3 Minutes</span>
            </h2>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Stop Forgetting?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join developers who are turning their GitHub repos into
              intelligent revision engines.
            </p>
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base">
                <Github className="h-5 w-5" />
                Sign in with GitHub
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4" />
            AlgoRecall © 2026
          </div>
          <p className="text-sm text-muted-foreground">
            Solve once. Remember forever. Crack interviews.
          </p>
        </div>
      </footer>
    </div>
  );
}
