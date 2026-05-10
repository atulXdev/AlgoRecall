"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Trophy,
  Settings,
  Brain,
  Flame,
  LogOut,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface UserProfile {
  display_name: string;
  github_username: string;
  github_avatar_url: string;
  total_xp: number;
  level: number;
}

interface Problem {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
}

// ── Command Palette ────────────────────────────────────────────────────────────
function SearchPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filtered, setFiltered] = useState<Problem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load problems once
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("problems")
        .select("id, title, topic, difficulty")
        .eq("is_deleted", false)
        .order("title");
      setProblems(data ?? []);
      setFiltered(data ?? []);
    })();
    inputRef.current?.focus();
  }, []);

  // Filter on query change
  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      q
        ? problems.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.topic?.toLowerCase().includes(q) ||
              p.difficulty?.toLowerCase().includes(q)
          )
        : problems
    );
    setActiveIdx(0);
  }, [query, problems]);

  // Keyboard navigation
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (filtered[activeIdx]) {
          router.push(`/problems/${filtered[activeIdx].id}`);
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, activeIdx, router, onClose]
  );

  const diffColor: Record<string, string> = {
    Easy: "text-emerald-400",
    Medium: "text-amber-400",
    Hard: "text-red-400",
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ maxHeight: "70vh" }}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search problems..."
            className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 hover:bg-accent"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 57px)" }}>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No problems found
            </p>
          ) : (
            filtered.slice(0, 50).map((p, i) => (
              <button
                key={p.id}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                  i === activeIdx ? "bg-primary/10 text-primary" : "hover:bg-accent"
                )}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => {
                  router.push(`/problems/${p.id}`);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate font-medium">{p.title}</span>
                  {p.topic && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {p.topic}
                    </span>
                  )}
                </div>
                {p.difficulty && (
                  <span className={cn("text-xs font-semibold flex-shrink-0 ml-2", diffColor[p.difficulty])}>
                    {p.difficulty}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Layout ───────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("users")
        .select("display_name, github_username, github_avatar_url, total_xp, level")
        .eq("id", authUser.id)
        .single();

      if (profile) setUser(profile);

      const { data: streakData } = await supabase
        .from("streaks")
        .select("current_revision_streak")
        .eq("user_id", authUser.id)
        .single();

      if (streakData) setStreak(streakData.current_revision_streak);
    }
    loadUser();
  }, []);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Brain className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold tracking-tight">
          Algo<span className="text-primary">Recall</span>
        </span>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.github_avatar_url} />
            <AvatarFallback>
              {user?.display_name?.[0] || user?.github_username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate text-foreground">
              {user?.display_name || user?.github_username || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              Level {user?.level || 1} • {user?.total_xp || 0} XP
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Search palette */}
      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-sidebar md:block">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent transition-colors">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Search bar — now clickable */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search problems...</span>
            <kbd className="ml-8 rounded border border-border bg-background px-1.5 py-0.5 text-xs">
              ⌘K
            </kbd>
          </button>

          <div className="md:hidden" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-400">
              <Flame className="h-4 w-4" />
              {streak}
            </div>

            {/* Avatar (mobile) */}
            <Avatar className="h-8 w-8 md:hidden">
              <AvatarImage src={user?.github_avatar_url} />
              <AvatarFallback>
                {user?.github_username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
