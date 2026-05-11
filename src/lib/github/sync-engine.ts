// ============================================================
// AlgoRecall — GitHub Sync Engine (v2)
// Optimized for LeetCode Chrome Extension repos:
//   {ID}-{ProblemName}/{ID}-{ProblemName}.cpp + README.md
// Also supports flat repos with .cpp/.java/.py files
// ============================================================

import { getInitialEaseFactor, calculateNextInterval } from "@/lib/spaced-repetition/engine";
import type { SupabaseClient } from "@supabase/supabase-js";

const IGNORE_DIRS = [".vscode", ".git", "node_modules", ".github"];
const CODE_EXTENSIONS = [".cpp", ".java", ".py", ".js", ".ts", ".c", ".go", ".rs"];

export interface SyncResult {
  totalFiles: number;
  newProblems: number;
  updatedProblems: number;
  skipped: number;
  errors: string[];
}

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
}

// --------------- LEETCODE TOPIC CLASSIFICATION ---------------
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Array": ["array", "subarray", "matrix", "zeroes", "rotate", "sorted", "merge", "consecutive", "duplicat", "permutation", "shuffle", "spiral"],
  "Binary Search": ["binary", "search", "searchin", "find", "peak", "sqrt", "minimum", "rotated", "koko"],
  "Two Pointers": ["twosum", "two-sum", "3sum", "threesum", "move", "remove-element", "container"],
  "Linked List": ["linked", "list", "cycle", "palindrome", "twin", "middle", "design"],
  "String": ["string", "palindrome", "reverse", "anagram", "vowel", "lower", "prefix", "word", "parenthes", "subsequence", "isomorphic", "dna"],
  "Hash Table": ["hash", "group", "anagram", "duplicate", "intersection", "unique", "character"],
  "Sliding Window": ["sliding", "window", "maximum-average", "minimum-size", "distinct-subarrays", "longest-substring"],
  "Stack": ["valid-parenthes", "stack"],
  "Math": ["palindrome-number", "fibonacci", "tribonacci", "power", "roman", "nim", "excel", "plus-one", "happy"],
  "Dynamic Programming": ["dp", "stock", "stone", "climbing", "fibonacci", "tribonacci"],
  "Sorting": ["sort", "color", "merge-sorted"],
};

/**
 * Classify a problem into a topic based on its name.
 */
function classifyTopic(problemName: string): string {
  const lower = problemName.toLowerCase().replace(/\s+/g, "");
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw.replace(/-/g, "")))) {
      return topic;
    }
  }
  return "General";
}

/**
 * Infer difficulty from LeetCode problem ID ranges and known problems.
 */
function inferDifficulty(lcId: number, problemName: string): string {
  // Well-known problem difficulties
  const KNOWN: Record<number, string> = {
    1: "Easy", 9: "Easy", 13: "Easy", 14: "Easy", 20: "Easy", 26: "Easy",
    27: "Easy", 28: "Easy", 35: "Easy", 53: "Medium", 54: "Medium",
    58: "Easy", 66: "Easy", 73: "Medium", 75: "Medium", 81: "Medium",
    88: "Easy", 121: "Easy", 122: "Medium", 125: "Easy", 136: "Easy",
    141: "Easy", 142: "Medium", 151: "Medium", 153: "Medium", 162: "Medium",
    167: "Medium", 169: "Easy", 171: "Easy", 187: "Medium", 189: "Medium",
    202: "Easy", 205: "Easy", 209: "Medium", 217: "Easy", 219: "Easy",
    234: "Easy", 268: "Easy", 283: "Easy", 287: "Medium", 292: "Easy",
    326: "Easy", 33: "Medium", 34: "Medium", 344: "Easy", 345: "Easy",
    349: "Easy", 387: "Easy", 414: "Easy", 48: "Medium", 485: "Easy",
    49: "Medium", 540: "Medium", 643: "Easy", 680: "Easy", 709: "Easy",
    724: "Easy", 838: "Medium", 875: "Medium", 908: "Easy", 909: "Medium",
    917: "Easy", 1013: "Easy", 1019: "Easy", 1236: "Easy", 1421: "Easy",
    1528: "Easy", 1580: "Easy", 1603: "Easy", 1752: "Easy", 1791: "Easy",
    1878: "Easy", 2048: "Easy", 2058: "Easy", 2236: "Medium", 2552: "Medium",
    2572: "Medium", 2917: "Easy", 3: "Medium", 2: "Medium", 15: "Medium",
    3512: "Medium", 3846: "Medium", 4141: "Easy",
  };
  if (KNOWN[lcId]) return KNOWN[lcId];
  
  // Heuristic: longer problem names tend to be harder
  const nameLen = problemName.length;
  if (nameLen > 40) return "Medium";
  if (lcId > 2000) return "Medium";
  return "Easy";
}

/**
 * Convert PascalCase/camelCase to readable title.
 * "KokoEatingBananas" → "Koko Eating Bananas"
 * "SearchinRotatedSortedArrayII" → "Search in Rotated Sorted Array II"
 */
function pascalToTitle(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    // Fix "I I" → "II", "I i" → "Ii"
    .replace(/\bI\s+I\b/g, "II")
    .replace(/\bI\s+i\b/g, "Ii");
}

/**
 * Generate a LeetCode URL from the problem title.
 */
function generateLeetCodeUrl(folderName: string): string {
  // "875-KokoEatingBananas" → "koko-eating-bananas"
  const parts = folderName.split("-");
  parts.shift(); // Remove the ID
  const slug = parts.join("-").toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  // Simpler: just use the folder name directly
  const cleanSlug = folderName.replace(/^\d+-/, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return `https://leetcode.com/problems/${cleanSlug}/`;
}

// --------------- GITHUB API ---------------

async function fetchRepoTree(
  owner: string, repo: string, token?: string
): Promise<{ items: GitHubTreeItem[]; branch: string }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "AlgoRecall-Sync",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Get default branch
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) throw new Error(`Failed to fetch repo info: ${repoRes.status} - ${await repoRes.text()}`);
  const repoData = await repoRes.json();
  const branch = repoData.default_branch || "main";

  // Get full tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );
  if (!treeRes.ok) throw new Error(`Failed to fetch tree: ${treeRes.status}`);
  const treeData = await treeRes.json();

  return {
    items: treeData.tree.filter((i: GitHubTreeItem) => i.type === "blob"),
    branch,
  };
}

async function fetchFileContent(
  owner: string, repo: string, path: string, branch: string, token?: string
): Promise<string> {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`;
  const headers: Record<string, string> = { "User-Agent": "AlgoRecall-Sync" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.text();
}

// --------------- MAIN SYNC ---------------

export async function syncRepository(
  supabase: SupabaseClient,
  userId: string,
  owner: string,
  repo: string,
  token?: string
): Promise<SyncResult> {
  const result: SyncResult = {
    totalFiles: 0, newProblems: 0, updatedProblems: 0, skipped: 0, errors: [],
  };

  try {
    const { data: user } = await supabase.from("users").select("last_synced_at").eq("id", userId).single();
    const isFirstSync = !user?.last_synced_at;

    const { items, branch } = await fetchRepoTree(owner, repo, token);

    // Group files by folder: "875-KokoEatingBananas" → { code: [...], readme: ... }
    const folderMap = new Map<string, {
      codeFiles: GitHubTreeItem[];
      readme: GitHubTreeItem | null;
      folderPath: string;
    }>();

    for (const item of items) {
      if (IGNORE_DIRS.some((d) => item.path.startsWith(d + "/") || item.path.includes("/" + d + "/"))) continue;

      const parts = item.path.split("/");
      if (parts.length < 2) continue; // Skip root-level files

      const folder = parts[0];
      const fileName = parts[parts.length - 1];

      // Skip non-problem folders
      if (folder.startsWith(".")) continue;

      if (!folderMap.has(folder)) {
        folderMap.set(folder, { codeFiles: [], readme: null, folderPath: folder });
      }
      const entry = folderMap.get(folder)!;

      if (fileName.toLowerCase() === "readme.md") {
        entry.readme = item;
      } else {
        const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        if (CODE_EXTENSIONS.includes(ext)) {
          entry.codeFiles.push(item);
        }
      }
    }

    // Get ALL problems for this user (including soft-deleted) so we can
    // match on github_path and restore/update rather than insert duplicates.
    const { data: existingProblems } = await supabase
      .from("problems")
      .select("id, github_path, github_sha, is_deleted, platform_id")
      .eq("user_id", userId);

    // Primary lookup: exact github_path (folder name)
    const existingByPath = new Map(
      (existingProblems || []).map((p) => [p.github_path, p])
    );
    // Secondary lookup: case-insensitive folder path (handles casing changes by extension)
    const existingByPathLower = new Map(
      (existingProblems || []).map((p) => [p.github_path.toLowerCase(), p])
    );
    // Tertiary lookup: by LeetCode problem ID (handles completely renamed folders for same problem)
    const existingByLcId = new Map(
      (existingProblems || [])
        .filter((p) => p.platform_id)
        .map((p) => [p.platform_id, p])
    );

    result.totalFiles = folderMap.size;

    for (const [folder, entry] of folderMap) {
      if (entry.codeFiles.length === 0) continue;

      try {
        // Parse folder name: "875-KokoEatingBananas" → { id: 875, name: "KokoEatingBananas" }
        const folderMatch = folder.match(/^(\d+)-(.+)$/);
        let lcId: number | null = null;
        let rawName: string = folder;

        if (folderMatch) {
          lcId = parseInt(folderMatch[1]);
          rawName = folderMatch[2];
        }

        const title = pascalToTitle(rawName);
        const topic = classifyTopic(rawName);
        const difficulty = lcId ? inferDifficulty(lcId, title) : "Medium";

        // Use the primary code file (first one, or the one matching folder name)
        const primaryCode = entry.codeFiles.find((f) =>
          f.path.toLowerCase().includes(folder.toLowerCase())
        ) || entry.codeFiles[0];

        // Resolve existing record using 3-level fallback to prevent duplicates:
        // 1. Exact folder name match (most common case)
        // 2. Case-insensitive folder name match (extension sometimes changes casing)
        // 3. Same LeetCode problem ID in a differently-named folder
        const existing =
          existingByPath.get(folder) ??
          existingByPathLower.get(folder.toLowerCase()) ??
          (lcId ? existingByLcId.get(String(lcId)) : undefined);

        // Skip if the code file SHA hasn't changed (nothing new to sync)
        if (existing && existing.github_sha === primaryCode.sha) {
          // But if it was soft-deleted, restore it without re-fetching content
          if (existing.is_deleted) {
            await supabase
              .from("problems")
              .update({ is_deleted: false, github_path: folder, updated_at: new Date().toISOString() })
              .eq("id", existing.id);
          }
          result.skipped++;
          continue;
        }

        // Fetch code content
        const codeContent = await fetchFileContent(owner, repo, primaryCode.path, branch, token);

        // Fetch README if exists
        let readmeContent: string | null = null;
        if (entry.readme) {
          try {
            readmeContent = await fetchFileContent(owner, repo, entry.readme.path, branch, token);
          } catch {
            // README fetch failed, proceed without it
          }
        }

        // Build the intuition/notes markdown
        const ext = primaryCode.path.substring(primaryCode.path.lastIndexOf(".") + 1);
        let intuitionMd = "";
        if (readmeContent) {
          intuitionMd += `## Problem Description\n\n${readmeContent}\n\n---\n\n`;
        }
        intuitionMd += `## Solution\n\n\`\`\`${ext}\n${codeContent.substring(0, 3000)}\n\`\`\``;

        const url = lcId ? generateLeetCodeUrl(folder) : null;

          const problemData = {
            user_id: userId,
            title,
            topic,
            difficulty,
            platform: lcId ? "LeetCode" : null,
            platform_id: lcId ? String(lcId) : null,
            url,
            github_path: folder,
            github_sha: primaryCode.sha,
            github_url: `https://github.com/${owner}/${repo}/tree/${branch}/${encodeURIComponent(folder)}`,
            intuition_md: intuitionMd,
            tags: [topic.toLowerCase()],
            confidence_level: 3,
            is_deleted: false,
            state: isFirstSync ? "dormant" : "active",
          };

        if (existing) {
          // Update existing problem (and restore if it was soft-deleted)
          await supabase
            .from("problems")
            .update({ ...problemData, updated_at: new Date().toISOString() })
            .eq("id", existing.id);

          // If the problem was soft-deleted, ensure a revision schedule exists
          if (existing.is_deleted) {
            const { data: existingSchedule } = await supabase
              .from("revision_schedules")
              .select("*")
              .eq("problem_id", existing.id)
              .maybeSingle();

            await markAsRevisedToday(supabase, userId, existing.id, difficulty, existingSchedule);
            result.newProblems++; // treat restored problems as "new" in the count
          } else {
            result.updatedProblems++;
            const { data: existingSchedule } = await supabase
              .from("revision_schedules")
              .select("*")
              .eq("problem_id", existing.id)
              .maybeSingle();

            await markAsRevisedToday(supabase, userId, existing.id, difficulty, existingSchedule);
          }
        } else {
          const { data: newProblem, error: insertError } = await supabase
            .from("problems")
            .insert(problemData)
            .select("id")
            .single();

          if (insertError) {
            result.errors.push(`Insert ${folder}: ${insertError.message}`);
            continue;
          }

          // Create revision schedule
          if (newProblem) {
            if (isFirstSync) {
              // For first sync, just insert a dormant schedule (far future or just default, but dashboard will filter it)
              const today = new Date().toISOString().split("T")[0];
              await supabase.from("revision_schedules").insert({
                user_id: userId,
                problem_id: newProblem.id,
                next_revision_date: today,
                ease_factor: getInitialEaseFactor(difficulty),
                current_interval: 0,
                revision_count: 0,
                confidence_level: 3,
              });
            } else {
              await markAsRevisedToday(supabase, userId, newProblem.id, difficulty);
            }
          }
          result.newProblems++;
        }

        // Rate limiting
        await new Promise((r) => setTimeout(r, 30));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        result.errors.push(`${folder}: ${msg}`);
      }
    }

    // Update user
    await supabase
      .from("users")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", userId);

    // Log sync
    await supabase.from("sync_logs").insert({
      user_id: userId,
      sync_type: "manual",
      status: result.errors.length > 0 ? "partial" : "success",
      files_added: result.newProblems,
      files_updated: result.updatedProblems,
      files_removed: 0,
      error_message: result.errors.length > 0 ? result.errors.join("; ") : null,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

    // Update topic stats
    await updateTopicStats(supabase, userId);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    result.errors.push(`Sync failed: ${msg}`);
  }

  return result;
}

async function updateTopicStats(supabase: SupabaseClient, userId: string) {
  const { data: problems } = await supabase
    .from("problems")
    .select("topic, confidence_level")
    .eq("user_id", userId)
    .eq("is_deleted", false);

  if (!problems || problems.length === 0) return;

  const topicGroups: Record<string, { count: number; totalConf: number }> = {};
  for (const p of problems) {
    const t = p.topic || "General";
    if (!topicGroups[t]) topicGroups[t] = { count: 0, totalConf: 0 };
    topicGroups[t].count++;
    topicGroups[t].totalConf += p.confidence_level || 3;
  }

  for (const [topicName, stats] of Object.entries(topicGroups)) {
    const avg = stats.totalConf / stats.count;
    const mastery = (avg / 5) * 100;

    const { data: existing } = await supabase
      .from("topic_stats")
      .select("id")
      .eq("user_id", userId)
      .eq("topic_name", topicName)
      .single();

    const payload = {
      problems_solved: stats.count,
      mastery_score: Math.round(mastery),
      avg_confidence: Math.round(avg * 100) / 100,
    };

    if (existing) {
      await supabase.from("topic_stats").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("topic_stats").insert({
        user_id: userId,
        topic_name: topicName,
        ...payload,
      });
    }
  }
}

async function markAsRevisedToday(
  supabase: SupabaseClient,
  userId: string,
  problemId: string,
  difficulty: string,
  existingSchedule?: any
) {
  let currentInterval = 0;
  let memoryStrength = 0;
  let revisionCount = 0;
  let scheduleId = null;

  if (existingSchedule) {
    currentInterval = existingSchedule.current_interval || 0;
    memoryStrength = existingSchedule.memory_strength || 0;
    revisionCount = existingSchedule.revision_count || 0;
    scheduleId = existingSchedule.id;
  }

  const result = calculateNextInterval({
    mode: "full",
    confidence: "perfect", // Synced problems assume a perfect full solve
    currentInterval,
    memoryStrength,
    revisionNumber: revisionCount,
  });

  const nextDate = result.nextRevisionDate.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const scheduleData = {
    user_id: userId,
    problem_id: problemId,
    next_revision_date: nextDate,
    memory_strength: result.newMemoryStrength,
    health_status: result.newHealthStatus,
    current_interval: result.newInterval,
    revision_count: revisionCount + 1,
    confidence_level: result.newHealthStatus === "mastered" ? 5 : 3,
    last_revised_at: new Date().toISOString()
  };

  if (scheduleId) {
    await supabase.from("revision_schedules").update(scheduleData).eq("id", scheduleId);
  } else {
    await supabase.from("revision_schedules").insert(scheduleData);
  }

  await supabase.from("problems").update({ confidence_level: result.newHealthStatus === "mastered" ? 5 : 3 }).eq("id", problemId);

  await supabase.from("revision_logs").insert({
    user_id: userId,
    problem_id: problemId,
    rating: "easy",
    confidence_rating: "perfect",
    time_taken_seconds: 0,
    revision_number: revisionCount + 1,
    interval_before: currentInterval,
    interval_after: result.newInterval,
    memory_strength_before: memoryStrength,
    memory_strength_after: result.newMemoryStrength,
    health_before: existingSchedule?.health_status || "relearning",
    health_after: result.newHealthStatus,
    reveals_used: 0,
    notes: "Solved on LeetCode (Synced)",
    mode: "full"
  });
  
  try {
    const { data: existingDaily } = await supabase.from("daily_activity").select("*").eq("user_id", userId).eq("activity_date", today).maybeSingle();
    const xpAmount = 5; 
    if (existingDaily) {
      await supabase.from("daily_activity").update({ revision_count: existingDaily.revision_count + 1, xp_earned: existingDaily.xp_earned + xpAmount }).eq("id", existingDaily.id);
    } else {
      await supabase.from("daily_activity").insert({ user_id: userId, activity_date: today, revision_count: 1, xp_earned: xpAmount });
    }

    const { data: streak } = await supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle();
    if (streak) {
      const lastDate = streak.last_revision_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let newStreak = streak.current_revision_streak;

      if (lastDate === today) {
        // Already revised today
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      await supabase.from("streaks").update({
        current_revision_streak: newStreak,
        longest_revision_streak: Math.max(streak.longest_revision_streak, newStreak),
        last_revision_date: today,
      }).eq("id", streak.id);
    }
  } catch (e) {
    console.error("Failed to update daily stats during sync", e);
  }
}

