// ============================================================
// AlgoRecall — GitHub Frontmatter Parser & Metadata Extraction
// ============================================================

import matter from "gray-matter";

export interface ProblemMetadata {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | null;
  dateSolved: string | null;
  platform: string | null;
  platformId: string | null;
  url: string | null;
  tags: string[];
  intuitionMd: string;
  mistakes: string[];
  topic: string;
}

/**
 * Parse README.md content and extract frontmatter + body
 */
export function parseReadme(
  content: string,
  githubPath: string
): ProblemMetadata {
  const { data, content: body } = matter(content);

  return {
    title: data.title || inferTitleFromPath(githubPath),
    difficulty: normalizeDifficulty(data.difficulty),
    dateSolved: data.dateSolved
      ? new Date(data.dateSolved).toISOString().split("T")[0]
      : null,
    platform: data.platform || detectPlatformFromUrl(data.url) || null,
    platformId: data.leetcode?.toString() || data.platformId || null,
    url: data.url || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    intuitionMd: body.trim(),
    mistakes: extractMistakes(body),
    topic: inferTopicFromPath(githubPath),
  };
}

/**
 * Infer topic from folder path
 * e.g., "DSA/Binary_Search/BS01_Problem/README.md" → "Binary Search"
 */
export function inferTopicFromPath(githubPath: string): string {
  const parts = githubPath.split("/");
  // Handle paths like: Binary_Search/BS01_Problem/README.md
  // or: DSA/Binary_Search/BS01_Problem/README.md
  const topicFolder = parts.length >= 4 ? parts[1] : parts[0];
  return topicFolder.replace(/_/g, " ").trim();
}

/**
 * Infer title from problem folder name
 * e.g., "BS01_Binary_Search" → "Binary Search"
 */
function inferTitleFromPath(githubPath: string): string {
  const parts = githubPath.split("/");
  const problemFolder = parts[parts.length - 2] || "Unknown";
  // Remove topic code prefix (e.g., BS01_, ARR02_)
  const withoutPrefix = problemFolder.replace(
    /^[A-Z]{2,4}\d{1,3}_/,
    ""
  );
  return withoutPrefix.replace(/_/g, " ").trim();
}

/**
 * Normalize difficulty to Easy/Medium/Hard or null
 */
function normalizeDifficulty(
  value: unknown
): "Easy" | "Medium" | "Hard" | null {
  if (!value) return null;
  const str = String(value).toLowerCase().trim();
  const map: Record<string, "Easy" | "Medium" | "Hard"> = {
    easy: "Easy",
    e: "Easy",
    "1": "Easy",
    medium: "Medium",
    med: "Medium",
    m: "Medium",
    "2": "Medium",
    hard: "Hard",
    h: "Hard",
    "3": "Hard",
  };
  return map[str] || null;
}

/**
 * Detect platform from URL patterns
 */
function detectPlatformFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.includes("leetcode.com")) return "LeetCode";
  if (url.includes("codeforces.com")) return "Codeforces";
  if (url.includes("geeksforgeeks.org")) return "GeeksForGeeks";
  if (url.includes("neetcode.io")) return "NeetCode";
  if (url.includes("hackerrank.com")) return "HackerRank";
  if (url.includes("interviewbit.com")) return "InterviewBit";
  return "Custom";
}

/**
 * Extract mistakes from the # Mistakes section of README body
 */
function extractMistakes(body: string): string[] {
  const mistakesMatch = body.match(
    /#+\s*Mistakes?\s*\n([\s\S]*?)(?=\n#+\s|\n*$)/i
  );
  if (!mistakesMatch) return [];

  return mistakesMatch[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 0);
}
