"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, RefreshCw, Sun, Moon, LogOut, Trash2, Link2, ArrowRight } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/github";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showRepoInput, setShowRepoInput] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [changingRepo, setChangingRepo] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setTheme(data.theme || "dark");
      }
    }
    load();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    document.documentElement.classList.toggle("light");
    const supabase = createClient();
    await supabase.from("users").update({ theme: newTheme }).eq("id", profile.id);
    toast.success(`Theme switched to ${newTheme} mode`);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Sync complete!", {
          description: `${data.newProblems} new, ${data.updatedProblems} updated`,
        });
        // Reload profile to show updated timestamp
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: updated } = await supabase.from("users").select("*").eq("id", user.id).single();
          if (updated) setProfile(updated);
        }
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch {
      toast.error("Sync failed — check your connection");
    } finally {
      setSyncing(false);
    }
  };

  const handleChangeRepo = async () => {
    if (!newRepoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }
    setChangingRepo(true);
    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: newRepoUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Repository changed!");
        setShowRepoInput(false);
        setNewRepoUrl("");
        // Update profile locally
        setProfile((prev: any) => ({
          ...prev,
          repo_owner: data.repo_owner,
          repo_name: data.repo_name,
          last_synced_at: null,
        }));
      } else {
        toast.error(data.error || "Failed to change repository");
      }
    } catch {
      toast.error("Failed to change repository");
    } finally {
      setChangingRepo(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!profile) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">GitHub Username</span>
            <span className="text-sm font-medium">@{profile.github_username}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm">{profile.email || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Level</span>
            <Badge variant="secondary">Level {profile.level} • {profile.total_xp} XP</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Repository */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Github className="h-4 w-4" /> Connected Repository</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {profile.repo_name ? (
            <>
              <div className="flex items-center justify-between">
                <a
                  href={`https://github.com/${profile.repo_owner}/${profile.repo_name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {profile.repo_owner}/{profile.repo_name}
                </a>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last synced</span>
                <span className="text-sm">{profile.last_synced_at ? new Date(profile.last_synced_at).toLocaleString() : "Never"}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleSync} disabled={syncing}>
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync Repository"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowRepoInput(!showRepoInput)}
                >
                  Change Repository
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">No repository connected</p>
              <Button variant="outline" size="sm" onClick={() => setShowRepoInput(true)}>Connect Repository</Button>
            </div>
          )}

          {/* Change Repo Input */}
          {showRepoInput && (
            <div className="border border-border/50 rounded-lg p-4 space-y-3 bg-accent/20">
              <p className="text-sm font-medium">
                {profile.repo_name ? "Change Repository" : "Connect Repository"}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.repo_name
                  ? "⚠️ This will remove all current problems and import from the new repo."
                  : "Enter your GitHub repository URL to start importing problems."}
              </p>
              <Input
                placeholder="https://github.com/username/repo or username/repo"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="bg-background"
              />
              <div className="flex gap-2">
                <Button size="sm" className="gap-2" onClick={handleChangeRepo} disabled={changingRepo}>
                  {changingRepo ? (
                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Changing...</>
                  ) : (
                    <><ArrowRight className="h-3.5 w-3.5" /> {profile.repo_name ? "Switch Repo" : "Connect"}</>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowRepoInput(false); setNewRepoUrl(""); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <Button variant="outline" size="sm" className="gap-2" onClick={toggleTheme}>
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "dark" ? "Dark" : "Light"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader><CardTitle className="text-base text-red-400">Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="gap-2" onClick={handleLogout}><LogOut className="h-4 w-4" /> Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
