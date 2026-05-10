// ============================================================
// AlgoRecall — C++ Solution File Parser
// Extracts metadata from .cpp files + companion data
// Designed for repo structures like: Topic/BS3.cpp, Topic/73.cpp
// ============================================================

/**
 * Known LeetCode problem titles by number for auto-enrichment.
 * This is a subset — the sync engine also tries the LeetCode API.
 */
const KNOWN_LEETCODE: Record<number, { title: string; difficulty: string }> = {
  1: { title: "Two Sum", difficulty: "Easy" },
  9: { title: "Palindrome Number", difficulty: "Easy" },
  33: { title: "Search in Rotated Sorted Array", difficulty: "Medium" },
  34: { title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium" },
  35: { title: "Search Insert Position", difficulty: "Easy" },
  48: { title: "Rotate Image", difficulty: "Medium" },
  69: { title: "Sqrt(x)", difficulty: "Easy" },
  73: { title: "Set Matrix Zeroes", difficulty: "Medium" },
  81: { title: "Search in Rotated Sorted Array II", difficulty: "Medium" },
  153: { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
  162: { title: "Find Peak Element", difficulty: "Medium" },
  704: { title: "Binary Search", difficulty: "Easy" },
};

export interface CppParsedProblem {
  title: string;
  topic: string;
  difficulty: string | null;
  platform: string | null;
  platformId: string | null;
  url: string | null;
  approaches: string[];
  codeContent: string;
  filePath: string;
  svgPath: string | null;
}

/**
 * Parse a filename to extract LeetCode problem number and name.
 *
 * Patterns supported:
 * - "BS 9 162. Find Peak Elements.cpp"  → LC #162, "Find Peak Elements"
 * - "73.cpp"                             → LC #73
 * - "BS1.cpp"                            → No LC, title "BS1"
 * - "BS 11 nth root of m.cpp"            → No LC, title "nth root of m"
 * - "BS10 sqareroot of num.cpp"          → No LC, title "sqareroot of num"
 */
export function parseFilename(filename: string): {
  leetcodeId: number | null;
  titleFromFile: string;
  prefix: string;
} {
  // Remove extension
  const name = filename.replace(/\.cpp$/i, "").trim();

  // Pattern: "BS 9 162. Find Peak Elements" → prefix "BS 9", LC 162, title "Find Peak Elements"
  const lcDotPattern = /^(.+?)\s+(\d+)\.\s*(.+)$/;
  const lcDotMatch = name.match(lcDotPattern);
  if (lcDotMatch) {
    return {
      leetcodeId: parseInt(lcDotMatch[2]),
      titleFromFile: lcDotMatch[3].trim(),
      prefix: lcDotMatch[1].trim(),
    };
  }

  // Pattern: "73.cpp" → Just a number, LC #73
  if (/^\d+$/.test(name)) {
    return {
      leetcodeId: parseInt(name),
      titleFromFile: name,
      prefix: "",
    };
  }

  // Pattern: "BS10 sqareroot of num" → prefix "BS10", title "sqareroot of num"
  const prefixedPattern = /^(BS\d+)\s+(.+)$/i;
  const prefixedMatch = name.match(prefixedPattern);
  if (prefixedMatch) {
    return {
      leetcodeId: null,
      titleFromFile: prefixedMatch[2].trim(),
      prefix: prefixedMatch[1].trim(),
    };
  }

  // Pattern: "BS 11 nth root of m" → prefix "BS", number 11, title "nth root of m"
  const prefixNumPattern = /^(\w+)\s+(\d+)\s+(.+)$/;
  const prefixNumMatch = name.match(prefixNumPattern);
  if (prefixNumMatch) {
    return {
      leetcodeId: null,
      titleFromFile: prefixNumMatch[3].trim(),
      prefix: `${prefixNumMatch[1]} ${prefixNumMatch[2]}`,
    };
  }

  // Fallback: "BS1", "Hashing" → use as-is
  return {
    leetcodeId: null,
    titleFromFile: name,
    prefix: "",
  };
}

/**
 * Extract metadata from the first few comment lines of a C++ file.
 *
 * Patterns detected:
 * - "//leetcode ques:34"
 * - "//leetcode:Q:81. Search in Rotated Sorted Array II"
 * - "// https://leetcode.com/problems/..."
 * - "//Better", "//optimal", "//brute" → approach tags
 * - "//Time O(n)", "//O(logn)" → complexity notes
 */
export function parseComments(content: string): {
  leetcodeId: number | null;
  leetcodeTitle: string | null;
  url: string | null;
  approaches: string[];
  complexityNotes: string[];
} {
  const lines = content.split("\n").slice(0, 30); // First 30 lines only
  let leetcodeId: number | null = null;
  let leetcodeTitle: string | null = null;
  let url: string | null = null;
  const approaches: string[] = [];
  const complexityNotes: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Pattern: //leetcode:Q:81. Search in Rotated Sorted Array II
    const lcQMatch = trimmed.match(/\/\/\s*leetcode\s*:\s*Q\s*:\s*(\d+)\.\s*(.+)/i);
    if (lcQMatch) {
      leetcodeId = parseInt(lcQMatch[1]);
      leetcodeTitle = lcQMatch[2].trim();
      continue;
    }

    // Pattern: //leetcode ques:34
    const lcQuesMatch = trimmed.match(/\/\/\s*leetcode\s*(?:ques|question|q)\s*:\s*(\d+)/i);
    if (lcQuesMatch) {
      leetcodeId = parseInt(lcQuesMatch[1]);
      continue;
    }

    // Pattern: // LC #34 or // leetcode 34
    const lcNumMatch = trimmed.match(/\/\/\s*(?:lc|leetcode)\s*#?\s*(\d+)/i);
    if (lcNumMatch && !leetcodeId) {
      leetcodeId = parseInt(lcNumMatch[1]);
      continue;
    }

    // Pattern: // https://leetcode.com/problems/...
    const urlMatch = trimmed.match(/(https?:\/\/(?:www\.)?leetcode\.com\/problems\/[^\s)]+)/i);
    if (urlMatch) {
      url = urlMatch[1].replace(/\/+$/, "");
      // Try to extract problem slug from URL
      const slugMatch = url.match(/problems\/([^/]+)/);
      if (slugMatch && !leetcodeTitle) {
        leetcodeTitle = slugMatch[1]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
      continue;
    }

    // Approach tags: //Better, //optimal, //brute, //recursive
    const approachMatch = trimmed.match(/^\/\/\s*(better|optimal|brute|naive|recursive|iterative|two[\s-]?pointer|sliding[\s-]?window|dp|greedy|backtrack)/i);
    if (approachMatch) {
      approaches.push(approachMatch[1].trim());
    }

    // Complexity: //Time O(n), //O(logn)
    const complexityMatch = trimmed.match(/\/\/\s*((?:Time|Space)?\s*O\([^)]+\))/i);
    if (complexityMatch) {
      complexityNotes.push(complexityMatch[1].trim());
    }
  }

  return { leetcodeId, leetcodeTitle, url, approaches, complexityNotes };
}

/**
 * Try to look up a LeetCode problem by ID to get title + difficulty.
 */
export function lookupLeetCode(id: number): { title: string; difficulty: string } | null {
  return KNOWN_LEETCODE[id] || null;
}

/**
 * Generate a LeetCode URL from problem ID.
 */
export function leetcodeUrl(id: number): string {
  const info = KNOWN_LEETCODE[id];
  if (info) {
    const slug = info.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    return `https://leetcode.com/problems/${slug}/`;
  }
  return `https://leetcode.com/problems/${id}/`;
}

/**
 * Infer difficulty from topic name and problem patterns.
 */
export function inferDifficulty(topic: string, _title: string): string {
  const topicLower = topic.toLowerCase();
  if (topicLower.includes("basic math") || topicLower.includes("basic")) return "Easy";
  if (topicLower.includes("recursion")) return "Medium";
  if (topicLower.includes("hashing")) return "Easy";
  if (topicLower.includes("binary search")) return "Medium";
  if (topicLower.includes("dp") || topicLower.includes("dynamic")) return "Hard";
  if (topicLower.includes("graph")) return "Hard";
  if (topicLower.includes("tree")) return "Medium";
  return "Medium";
}

/**
 * Main parser: combine filename + content analysis to produce problem metadata.
 */
export function parseCppFile(
  filePath: string,
  content: string,
  companionSvg: string | null
): CppParsedProblem {
  // Extract topic from folder: "Binary Search/BS3.cpp" → "Binary Search"
  const pathParts = filePath.split("/");
  const filename = pathParts[pathParts.length - 1];
  const topic = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : "Uncategorized";

  // Parse filename
  const fileInfo = parseFilename(filename);

  // Parse comments
  const commentInfo = parseComments(content);

  // Resolve LeetCode ID (comments take priority over filename)
  const lcId = commentInfo.leetcodeId || fileInfo.leetcodeId;

  // Resolve title
  let title: string;
  let difficulty: string | null = null;
  let url = commentInfo.url;
  let platform: string | null = null;
  let platformId: string | null = null;

  if (lcId) {
    const lcInfo = lookupLeetCode(lcId);
    // Priority: comment title > lookup > filename
    title = commentInfo.leetcodeTitle || lcInfo?.title || fileInfo.titleFromFile;
    difficulty = lcInfo?.difficulty || null;
    platform = "LeetCode";
    platformId = String(lcId);
    if (!url) url = leetcodeUrl(lcId);
  } else {
    title = fileInfo.titleFromFile;
  }

  // Infer difficulty from topic if not from LeetCode
  if (!difficulty) {
    difficulty = inferDifficulty(topic, title);
  }

  // Clean up title
  title = title
    .replace(/^\d+\.\s*/, "")     // Remove leading "162. "
    .replace(/\s+/g, " ")         // Normalize spaces
    .trim();

  // If title is just a number, use the LeetCode lookup or topic prefix
  if (/^\d+$/.test(title) && lcId) {
    const lcInfo = lookupLeetCode(lcId);
    if (lcInfo) title = lcInfo.title;
    else title = `LeetCode #${lcId}`;
  }

  return {
    title,
    topic: topic === "Coding Solution cpp" || topic === "Coding solution"
      ? (pathParts.length >= 3 ? pathParts[pathParts.length - 3] : "Uncategorized")
      : topic,
    difficulty,
    platform,
    platformId,
    url,
    approaches: commentInfo.approaches,
    codeContent: content,
    filePath,
    svgPath: companionSvg,
  };
}
