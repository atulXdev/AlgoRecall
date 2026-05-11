# AlgoRecall

AlgoRecall is a powerful web application designed to help developers master algorithms and data structures through automated spaced repetition. By seamlessly integrating with your LeetCode GitHub repository, AlgoRecall analyzes your solved problems, schedules optimal revision dates, and gamifies your learning journey.

## 🚀 Key Features

*   **GitHub Sync Engine:** Automatically syncs your LeetCode solutions directly from your connected GitHub repository. It smartly extracts problem topics, infers difficulty, and reads both code files and `README.md` intuitions.
*   **Smart Auto-Revision (New!):** 
    *   When a *new problem* is synced from your repository, AlgoRecall immediately marks it as revised for today.
    *   When an *existing problem* is updated (e.g., you optimized your solution on LeetCode and pushed the new code), AlgoRecall updates the code and also registers a new revision for today. 
    *   This ensures your daily activity, XP, and streak are automatically updated without manual logging.
*   **Spaced Repetition System (SM-2):** Leverages a customized version of the SuperMemo-2 (SM-2) algorithm. The app adjusts revision intervals based on the problem's difficulty and your confidence level ("Easy", "Medium", "Hard", or "Forgot").
*   **Gamification & Progression:**
    *   Earn **XP** for completing revisions.
    *   Track your **Daily Streak** and maintain a consistent learning habit.
    *   Monitor **Topic Mastery** through an interactive dashboard to see your weakest and strongest algorithm categories.

## 🧠 How it Works

1.  **Connect & Sync:** Link your GitHub repository where you push your LeetCode solutions (e.g., using a LeetCode Chrome Extension).
2.  **Engine Parsing:** The Sync Engine reads the repository tree, grouping related `.cpp`, `.java`, `.py`, `.js`, etc., files into coherent problems.
3.  **Scheduling:** Using the SM-2 algorithm, AlgoRecall sets the `next_revision_date` for each problem.
4.  **Daily Review:** Check your AlgoRecall dashboard daily to see which problems are due for revision. Review your intuition, attempt the problem again, and rate your confidence to schedule the next optimal review date.

## 🛠 Tech Stack

*   **Framework:** Next.js (App Router), React, TypeScript
*   **Styling:** Tailwind CSS
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Spaced Repetition:** Custom SM-2 implementation

## 💻 Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up your environment variables by connecting to your Supabase instance:
```bash
# Add your Supabase URL and Anon Key to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
