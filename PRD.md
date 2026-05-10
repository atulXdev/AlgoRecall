================================================================================
                        PRODUCT REQUIREMENTS DOCUMENT
                AlgoRecall — GitHub-Native DSA Revision & Interview
                           Preparation Platform
================================================================================

Version      : 1.0.0
Status       : Draft — Engineering Ready
Date         : May 2026
Prepared by  : Product & Engineering Team
Audience     : Founders, Engineers, Designers, Investors

================================================================================
TABLE OF CONTENTS
================================================================================

  1.  Executive Summary
  2.  Product Name Options
  3.  Product Vision & Philosophy
  4.  Target Users & Personas
  5.  User Stories & Acceptance Criteria
  6.  Core Philosophy & Differentiators
  7.  Tech Stack
  8.  System Architecture
  9.  GitHub-Native Architecture (Source of Truth)
 10.  Repository Structure Standard
 11.  Feature 01 — Authentication System
 12.  Feature 02 — GitHub Import Engine
 13.  Feature 03 — Automatic Metadata Extraction
 14.  Feature 04 — Spaced Repetition Engine
 15.  Feature 05 — Today Revision Dashboard
 16.  Feature 06 — Streak System
 17.  Feature 07 — Revision Heatmap
 18.  Feature 08 — XP & Level System
 19.  Feature 09 — Achievements & Badges
 20.  Feature 10 — Pattern Tracking System
 21.  Feature 11 — Interview Readiness System
 22.  Feature 12 — Problem Detail Page
 23.  Feature 13 — Blind Recall System
 24.  Feature 14 — Mistake Journal System
 25.  Feature 15 — Analytics System
 26.  Feature 16 — AI Features (Future Roadmap)
 27.  Feature 17 — Search & Filtering
 28.  Feature 18 — Notification System
 29.  Database Design (Complete Schema)
 30.  API Architecture
 31.  UI/UX Design System
 32.  Mobile Responsiveness
 33.  Performance Optimization
 34.  Security
 35.  MVP Prioritization
 36.  Development Roadmap
 37.  Future Features
 38.  Monetization Strategy
 39.  Edge Cases & Tradeoffs
 40.  Scaling Considerations

================================================================================
1. EXECUTIVE SUMMARY
================================================================================

AlgoRecall is an AI-powered, GitHub-native DSA (Data Structures & Algorithms)
revision and interview preparation platform. It solves the single biggest
problem in coding interview preparation: forgetting what you have already solved.

Most developers solve hundreds of LeetCode problems but still fail interviews
because they never revisited those problems. AlgoRecall converts a developer's
existing GitHub DSA repository into an intelligent revision engine powered by
spaced repetition, pattern tracking, recall training, and interview readiness
scoring.

The product is NOT another online judge or LeetCode clone. It is a MEMORY
SYSTEM — a platform that ensures developers retain what they learn, identify
their weak patterns, and walk into FAANG interviews with genuine confidence.

Key Value Propositions:
  - Zero setup burden: Push code to GitHub → auto-imported into the platform
  - Spaced repetition scheduling: never forget a solved problem again
  - Blind recall mode: simulate real interview pressure
  - Pattern mastery tracking: know exactly where you are weak
  - Interview readiness score: data-driven confidence measurement
  - Gamification: streaks, XP, levels, and badges to sustain motivation

Target Market: 5M+ Indian college students actively preparing for off-campus
placements, FAANG, and product-based company roles. Secondary: global LeetCode
and competitive programming community.

Business Model: Freemium SaaS — core features free, AI-powered insights and
advanced analytics behind a premium subscription ($5–9/month).

================================================================================
2. PRODUCT NAME OPTIONS
================================================================================

  Recommended : AlgoRecall
                → Communicates algorithm + memory recall directly
                → Domain: algorecall.io / algorecall.dev
                → Memorable, developer-first, brandable

  Alternatives:
  ┌──────────────────┬──────────────────────────────────────────────────┐
  │ Name             │ Rationale                                        │
  ├──────────────────┼──────────────────────────────────────────────────┤
  │ DSAMind          │ Emphasizes the memory/brain angle                │
  │ PatternLoop      │ Highlights pattern repetition concept            │
  │ RecallCode       │ Direct, functional name                          │
  │ AlgoForge        │ Emphasizes crafting/building mastery             │
  │ DSAFlow          │ Implies workflow + fluency                       │
  │ ReviseDSA        │ Functional, SEO-friendly                         │
  │ RecallGraph      │ Unique, hints at graph of knowledge              │
  └──────────────────┴──────────────────────────────────────────────────┘

Final recommendation: AlgoRecall (primary), PatternLoop (alternate)
Tagline: "Solve once. Remember forever. Crack interviews."

================================================================================
3. PRODUCT VISION & PHILOSOPHY
================================================================================

VISION STATEMENT
  To become the de-facto memory and mastery layer for every developer
  preparing for coding interviews — the system that sits on top of LeetCode,
  Striver, and Codeforces and ensures that effort is never wasted.

PHILOSOPHY
  The platform is built on three foundational beliefs:

  1. SOLVING ≠ KNOWING
     Solving a problem once does not mean you can solve it under interview
     pressure 2 months later. Retention requires active, spaced recall.

  2. GITHUB IS THE DEVELOPER'S SECOND BRAIN
     Developers already push their code to GitHub. The platform should meet
     them there — not force a new workflow. GitHub is the source of truth.

  3. DATA REVEALS WHAT FEELING CANNOT
     You think you know Binary Search. The data says you failed it 3 times
     in the last 30 days. Trust the data. Train the gaps.

WHAT ALGORECALL IS:
  ✅ A memory system for DSA
  ✅ A revision engine powered by spaced repetition
  ✅ A recall training system (Blind Recall Mode)
  ✅ A pattern mastery tracker
  ✅ An interview readiness dashboard
  ✅ A GitHub-native developer productivity tool

WHAT ALGORECALL IS NOT:
  ❌ An online judge or code execution platform
  ❌ A LeetCode clone
  ❌ A video tutorial platform
  ❌ A passive problem listing site

================================================================================
4. TARGET USERS & PERSONAS
================================================================================

PRIMARY PERSONAS
────────────────────────────────────────────────────────────────────────────────
PERSONA 1: "The Grinder"
  Name        : Rohit, 21, B.Tech CSE, Tier-2 college, Jaipur
  Goal        : Get into a product-based company (Flipkart, Swiggy, Razorpay)
  Pain points :
    - Solves 3–5 problems daily but forgets them within 2 weeks
    - No structured revision system
    - Doesn't know which topics are weakest
    - Loses motivation after 2–3 weeks of grinding
  Behavior    :
    - Follows Striver A2Z sheet religiously
    - Pushes code to GitHub for portfolio visibility
    - Active on Discord communities
  AlgoRecall value:
    - Auto-imports his GitHub solutions
    - Schedules revisions automatically
    - Shows him that DP is his weak point
    - Streak system keeps him coming back daily

────────────────────────────────────────────────────────────────────────────────
PERSONA 2: "The FAANG Aspirant"
  Name        : Priya, 23, Final year, IIT Bombay
  Goal        : Get into Google or Microsoft
  Pain points :
    - Solved 400+ problems but confidence is still low
    - Cannot recall medium-hard problems under pressure
    - Needs to identify truly forgotten problems
  Behavior    :
    - Maintains a very organized GitHub DSA repository
    - Writes detailed notes per problem
    - Tracks everything in a Notion doc (too manual)
  AlgoRecall value:
    - Blind recall mode simulates real interviews
    - Interview readiness score gives data-backed confidence
    - Auto-imports her already-organized repo with zero effort

────────────────────────────────────────────────────────────────────────────────
PERSONA 3: "The Returner"
  Name        : Aditya, 27, 3 years SWE experience
  Goal        : Switch from service company to product company
  Pain points :
    - Has not done DSA seriously in 3 years
    - Doesn't remember where to start
    - No time for long grinding sessions (9–6 job)
    - Needs focused 30-minute daily revision sessions
  Behavior    :
    - Was active on LeetCode during college
    - Will start a fresh GitHub DSA repo
  AlgoRecall value:
    - Guided onboarding sets up his repo structure
    - "Today's revision" limits overwhelm to a focused list
    - Pattern-based weakness identification saves time

────────────────────────────────────────────────────────────────────────────────
SECONDARY PERSONAS
  - Bootcamp students building a portfolio
  - Competitive programmers tracking Codeforces problems
  - Interview coaches recommending a platform to students
  - CS professors recommending structured revision

================================================================================
5. USER STORIES & ACCEPTANCE CRITERIA
================================================================================

EPIC 1: ONBOARDING & AUTHENTICATION
────────────────────────────────────────────────────────────────────────────────
Story 1.1
  AS A new user
  I WANT TO sign in with my GitHub account
  SO THAT I can connect my existing DSA repository without creating new accounts

  Acceptance Criteria:
  - GitHub OAuth login works on web and mobile browsers
  - After OAuth, user is redirected to onboarding flow
  - User can select their DSA repository from a list of their GitHub repos
  - If no repo exists, user sees a guide to create one with the correct structure
  - Session persists across browser sessions (14-day JWT refresh)
  - User can disconnect GitHub and delete their account from settings

────────────────────────────────────────────────────────────────────────────────
Story 1.2
  AS A returning user
  I WANT TO see my dashboard immediately after login
  SO THAT I know exactly what to revise today

  Acceptance Criteria:
  - Dashboard loads within 2 seconds of login
  - Today's revision list is pre-computed, not computed on page load
  - Streak status is visible above the fold
  - If no revisions today, dashboard shows motivational state and upcoming tasks

────────────────────────────────────────────────────────────────────────────────
EPIC 2: GITHUB IMPORT
────────────────────────────────────────────────────────────────────────────────
Story 2.1
  AS A user with a GitHub DSA repository
  I WANT problems to automatically appear in AlgoRecall when I push to GitHub
  SO THAT I never have to manually enter problem data

  Acceptance Criteria:
  - Webhook registered on user's repo during onboarding
  - New problem folder pushed to GitHub appears in dashboard within 60 seconds
  - Markdown frontmatter fields (title, difficulty, tags, platform, dateSolved)
    are correctly parsed and stored
  - Invalid or incomplete frontmatter triggers a "sync warning" notification
  - SVG diagrams in problem folders render on the problem detail page
  - Code files (solution.cpp, solution.py, etc.) are linked correctly

────────────────────────────────────────────────────────────────────────────────
Story 2.2
  AS A user
  I WANT to manually trigger a full repo sync
  SO THAT I can recover from missed webhooks

  Acceptance Criteria:
  - "Sync Repository" button available in settings
  - Full sync scans entire repo and identifies new/updated/deleted problems
  - Sync progress shown with a progress indicator
  - Sync completes in under 30 seconds for repos with < 500 problems
  - Sync results show: X problems added, Y updated, Z warnings

────────────────────────────────────────────────────────────────────────────────
EPIC 3: REVISION SYSTEM
────────────────────────────────────────────────────────────────────────────────
Story 3.1
  AS A user
  I WANT to see my due revisions every day
  SO THAT I follow a structured revision plan without having to decide what to do

  Acceptance Criteria:
  - "Due Today" list shows all problems whose next_revision_date <= today
  - Problems are sorted by: overdue (oldest first) → due today → confidence desc
  - Completing a revision requires selecting a recall rating (Easy/Medium/Hard/Forgot)
  - Next revision date auto-calculated based on rating
  - Streak increments when at least 1 revision is completed that day

────────────────────────────────────────────────────────────────────────────────
Story 3.2
  AS A user
  I WANT the revision intervals to adapt based on how well I recall problems
  SO THAT hard problems are shown more often and mastered ones less frequently

  Acceptance Criteria:
  - Easy rating → interval multiplied by 2.5
  - Medium rating → interval stays same or increases by 1 step
  - Hard rating → interval resets to 1 day
  - Forgot rating → interval resets to 1 day, confidence drops by 1 level
  - Algorithm handles edge cases: new problems always start at Day 1 interval

────────────────────────────────────────────────────────────────────────────────
EPIC 4: PROBLEM EXPERIENCE
────────────────────────────────────────────────────────────────────────────────
Story 4.1
  AS A user doing a revision
  I WANT to practice blind recall before seeing the solution
  SO THAT I simulate real interview conditions

  Acceptance Criteria:
  - Problem page starts in "Blind Mode" by default during revision sessions
  - Only title and tags are visible initially
  - User can choose to reveal: Hint → Intuition → Solution (stepwise)
  - "Start Timer" button starts a countdown (user-configurable, default 20 min)
  - After session, user rates recall: Easy / Medium / Hard / Forgot

================================================================================
6. CORE DIFFERENTIATORS
================================================================================

  ┌─────────────────────────────┬─────────────────┬────────────────┬────────────┐
  │ Feature                     │ AlgoRecall      │ LeetCode       │ Notion DSA │
  ├─────────────────────────────┼─────────────────┼────────────────┼────────────┤
  │ Spaced Repetition           │ ✅ Built-in     │ ❌             │ ❌ Manual  │
  │ GitHub as Source of Truth   │ ✅ Native       │ ❌             │ ❌         │
  │ Auto Import from Git Push   │ ✅              │ ❌             │ ❌         │
  │ Blind Recall Mode           │ ✅              │ ❌             │ ❌         │
  │ Pattern Mastery Score       │ ✅              │ ⚠️ Basic       │ ❌         │
  │ Interview Readiness Score   │ ✅              │ ❌             │ ❌         │
  │ SVG Diagram Rendering       │ ✅              │ ❌             │ ❌         │
  │ Mistake Journal             │ ✅              │ ❌             │ ✅ Manual  │
  │ XP + Levels                 │ ✅              │ ⚠️ Badges only │ ❌         │
  │ Revision Heatmap            │ ✅              │ ✅             │ ❌         │
  │ Free Core Features          │ ✅              │ ✅ Partial     │ ✅         │
  └─────────────────────────────┴─────────────────┴────────────────┴────────────┘

================================================================================
7. TECH STACK
================================================================================

FRONTEND
  Framework       : Next.js 14+ (App Router)
  Language        : TypeScript (strict mode)
  Styling         : Tailwind CSS v3
  Component lib   : shadcn/ui (Radix UI primitives)
  Animation       : Framer Motion
  Charts          : Recharts
  Markdown        : react-markdown + remark-gfm + rehype-highlight
  Frontmatter     : gray-matter
  SVG rendering   : Native <img> + dangerouslySetInnerHTML (sanitized)
  State management: Zustand (client state) + React Query (server state)
  Icons           : Lucide React

BACKEND (Serverless via Next.js API Routes)
  Platform        : Vercel (Serverless Functions)
  Database        : Supabase (PostgreSQL)
  Auth            : Supabase Auth with GitHub OAuth provider
  Real-time       : Supabase Realtime (for sync status updates)
  File storage    : Not needed (GitHub serves as file store)
  Cron jobs       : Vercel Cron (daily revision scheduling)
  Rate limiting   : Upstash Redis (optional, Phase 2)

GITHUB INTEGRATION
  OAuth scopes    : repo (read), user:email, read:user
  Webhooks        : push events on selected repository
  API             : GitHub REST API v3 (Octokit)
  Content fetching: GitHub Contents API (base64 decode)

FUTURE AI
  Provider        : OpenAI API (gpt-4o for notes, gpt-3.5-turbo for hints)
  Embeddings      : OpenAI text-embedding-3-small (for semantic search)

MONITORING & ANALYTICS
  Error tracking  : Sentry
  Analytics       : Vercel Analytics + PostHog (user behavior)
  Logs            : Vercel logs

================================================================================
8. SYSTEM ARCHITECTURE
================================================================================

HIGH-LEVEL ARCHITECTURE DIAGRAM

  ┌──────────────────────────────────────────────────────────────────┐
  │                        USER'S BROWSER                            │
  │    Next.js App (React) — Vercel CDN — static assets cached       │
  └───────────────────────────┬──────────────────────────────────────┘
                              │ HTTPS
  ┌───────────────────────────▼──────────────────────────────────────┐
  │                   NEXT.JS (Vercel)                               │
  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
  │  │  App Router  │  │  API Routes  │  │   Cron Jobs (Vercel)   │ │
  │  │  (RSC + CSR) │  │  /api/*      │  │   Daily schedule regen │ │
  │  └──────────────┘  └──────┬───────┘  └────────────────────────┘ │
  └─────────────────────────  │  ─────────────────────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │   SUPABASE          │
                   │  ┌───────────────┐  │
                   │  │  PostgreSQL   │  │
                   │  │  Auth         │  │
                   │  │  Realtime     │  │
                   │  └───────────────┘  │
                   └─────────────────────┘
                              ▲
                   ┌──────────┴──────────┐
                   │   GITHUB            │
                   │  Webhooks → API     │
                   │  Contents API       │
                   │  OAuth              │
                   └─────────────────────┘

DATA FLOW — PUSH TO DASHBOARD
  1. User pushes commit to GitHub DSA repo
  2. GitHub sends push webhook to /api/webhook/github
  3. Webhook handler validates HMAC-SHA256 signature
  4. Handler extracts added/modified files from commit payload
  5. For each new/modified README.md:
     a. Fetch raw content via GitHub Contents API
     b. Parse frontmatter with gray-matter
     c. Extract topic from folder path
     d. Upsert problem record in Supabase
     e. If new problem → create revision schedule entry
  6. Dashboard query re-runs → new problem appears
  7. Supabase Realtime pushes update to open browser tabs

================================================================================
9. GITHUB-NATIVE ARCHITECTURE
================================================================================

PRINCIPLE: GITHUB IS THE SOURCE OF TRUTH
  The Supabase database is a synchronized MIRROR of the GitHub repository.
  The website is a visualization and intelligence layer on top of that mirror.
  User data lives in GitHub — AlgoRecall reads it, analyzes it, and enhances it.

SYNC MODES
  ┌──────────────────┬─────────────────────────────────────────────────┐
  │ Mode             │ Description                                     │
  ├──────────────────┼─────────────────────────────────────────────────┤
  │ Webhook Sync     │ Real-time. Triggered on each push.              │
  │                  │ Only processes changed files.                   │
  │                  │ Primary sync mechanism.                         │
  ├──────────────────┼─────────────────────────────────────────────────┤
  │ Manual Sync      │ User-triggered full repo scan.                  │
  │                  │ Walks entire folder tree.                       │
  │                  │ Handles missed webhooks.                        │
  ├──────────────────┼─────────────────────────────────────────────────┤
  │ Cron Fallback    │ Runs nightly at 2 AM UTC.                       │
  │                  │ Checks for repos with >24h sync gap.            │
  │                  │ Triggers incremental scan.                      │
  └──────────────────┴─────────────────────────────────────────────────┘

GITHUB OAUTH SCOPES REQUIRED
  - repo : read-only access to public and private repositories
  - user:email : email for account linking
  - read:user : display name and avatar
  NOTE: We explicitly request read-only permissions. Never write back to repo.

WEBHOOK REGISTRATION FLOW
  1. User completes OAuth login
  2. Onboarding asks user to select their DSA repo
  3. Backend calls GitHub API: POST /repos/{owner}/{repo}/hooks
     Payload: { events: ["push"], config: { url, secret, content_type } }
  4. Store webhook_id and webhook_secret in user record (encrypted)
  5. On webhook receipt, validate X-Hub-Signature-256 header

================================================================================
10. REPOSITORY STRUCTURE STANDARD
================================================================================

REQUIRED FOLDER STRUCTURE

  DSA/
  ├── Arrays/
  │   ├── ARR01_Two_Sum/
  │   │   ├── solution.cpp          ← primary solution
  │   │   ├── solution.py           ← alternate language (optional)
  │   │   ├── README.md             ← REQUIRED — frontmatter + notes
  │   │   └── diagram.svg           ← optional visualization
  │   └── ARR02_Best_Time_To_Buy/
  │       ├── solution.cpp
  │       └── README.md
  ├── Binary_Search/
  ├── Dynamic_Programming/
  ├── Graphs/
  ├── Trees/
  ├── Trie/
  ├── Sliding_Window/
  ├── Greedy/
  ├── Backtracking/
  ├── Heaps/
  └── Linked_Lists/

REQUIRED README.md FRONTMATTER FORMAT

  ---
  title: Two Sum
  leetcode: 1
  difficulty: Easy
  url: https://leetcode.com/problems/two-sum/
  dateSolved: 2026-05-10
  platform: LeetCode
  tags:
    - arrays
    - hash-map
  ---

  # Intuition
  Use a hash map to store complement → index.
  For each element, check if its complement exists in the map.

  # Approach
  1. Iterate through array once
  2. For each num, compute complement = target - num
  3. Check hash map; if found, return indices
  4. Otherwise insert num → index into map

  # Complexity
  Time: O(n)
  Space: O(n)

  # Mistakes
  - Forgot to handle duplicate numbers in constraints
  - Initially tried O(n²) brute force — didn't think of hash map first

SUPPORTED PLATFORMS
  - LeetCode
  - Codeforces
  - GeeksForGeeks
  - NeetCode
  - Striver A2Z (internal notation)
  - HackerRank
  - InterviewBit
  - Custom (default if not matched)

FILENAME CONVENTIONS
  Problem folder: {TOPIC_CODE}{NN}_{Problem_Title_Snake_Case}
  Example: BS01_Binary_Search, DP07_Longest_Common_Subsequence

  Topic codes are optional but improve auto-detection:
  ARR → Arrays, BS → Binary Search, DP → Dynamic Programming,
  GR → Graphs, TR → Trees, TRI → Trie, SW → Sliding Window,
  GRD → Greedy, BT → Backtracking, HP → Heaps, LL → Linked Lists

================================================================================
11. FEATURE 01 — AUTHENTICATION SYSTEM
================================================================================

PURPOSE
  Provide seamless, secure GitHub OAuth authentication that extracts necessary
  permissions for repository access, and links GitHub identity to the user's
  AlgoRecall account stored in Supabase.

SUPABASE AUTH FLOW
  1. User clicks "Sign in with GitHub"
  2. Next.js redirects to Supabase OAuth endpoint
  3. Supabase redirects to GitHub OAuth consent screen
  4. GitHub returns auth code to Supabase callback URL
  5. Supabase exchanges code for access/refresh tokens
  6. Supabase creates user in auth.users table
  7. Database trigger fires → creates user record in public.users
  8. GitHub access token stored (encrypted) in user record
  9. Session cookie set (HttpOnly, Secure, SameSite=Strict)
  10. User redirected to /onboarding (first time) or /dashboard

SESSION MANAGEMENT
  - Access token: 1-hour JWT (Supabase default)
  - Refresh token: 14-day rolling window
  - Refresh happens silently in background via Supabase client
  - Token stored in httpOnly cookie (not localStorage) to prevent XSS
  - On expiry, user redirected to login with redirect_to param preserved

ONBOARDING FLOW (First-Time Users)
  Step 1: Welcome screen — explain GitHub-native concept
  Step 2: Repository selection — list user's GitHub repos, user selects DSA repo
           - If none exist: show template and "Create from Template" button
             linking to github.com/algorecall/dsa-template
  Step 3: Initial scan — progress bar while repo is scanned for first time
  Step 4: Problems found — summary: "X problems found across Y topics"
  Step 5: First revision scheduled — "Your first revisions are set for tomorrow"
  Step 6: Dashboard tour (optional, dismissible overlay)

SETTINGS PANEL
  - Change selected repository
  - Disconnect GitHub (stops webhook, clears sync)
  - Delete account (GDPR-compliant, soft delete → hard delete in 30 days)
  - Notification preferences
  - Theme preference (dark/light)
  - Default problem view mode (Blind/Normal)

GITHUB PERMISSIONS (Minimal Scope)
  - repo: required for private repo access (if user has private DSA repo)
  - Alternative: public_repo scope if repo is public (narrower scope)
  - Never request write permissions

ERROR HANDLING
  - GitHub OAuth failure → friendly error page with retry button
  - Repo access revoked → banner on dashboard with re-auth prompt
  - Token expiry → silent refresh; if refresh fails → re-auth redirect
  - Account already exists with same email → merge accounts prompt

================================================================================
12. FEATURE 02 — GITHUB IMPORT ENGINE
================================================================================

PURPOSE
  The most critical system. Automatically converts a GitHub repository push into
  structured problem records in the database, with revision schedules generated
  immediately.

WEBHOOK ARCHITECTURE

  GitHub Push → POST /api/webhook/github → Signature Validation
    → Identify changed README.md files → Fetch content via Contents API
      → Parse frontmatter → Upsert to DB → Generate revision entry
        → Real-time push to dashboard

WEBHOOK ENDPOINT: /api/webhook/github
  Method: POST
  Headers:
    X-GitHub-Event: push
    X-Hub-Signature-256: sha256=<HMAC of body using webhook secret>
    X-GitHub-Delivery: <unique delivery UUID>

  Handler Logic (Pseudocode):
  ─────────────────────────────────────────────────────
  function handleWebhook(req, res):
    1. Validate X-Hub-Signature-256 using HMAC-SHA256
       if invalid → return 401
    2. Parse payload → extract commits array
    3. Collect all affected file paths from:
       commit.added + commit.modified + commit.removed
    4. Filter to paths matching pattern: */README.md
    5. For each README.md path:
       a. Determine topic folder from path (e.g., "Binary_Search")
       b. Determine problem folder from path
       c. Fetch README.md content via GitHub Contents API
       d. Decode base64 content
       e. Parse with gray-matter
       f. Build problem record (see schema below)
       g. Upsert into problems table (conflict on github_path)
       h. If new problem: create revision_schedule entry
          (next_revision_date = dateSolved + 1 day)
    6. For removed files: mark problems as deleted (soft delete)
    7. Log sync event in sync_logs table
    8. Return 200 OK
  ─────────────────────────────────────────────────────

WEBHOOK SECURITY VALIDATION
  const signature = req.headers['x-hub-signature-256'];
  const expectedSig = 'sha256=' + hmac_sha256(webhookSecret, rawBody);
  if (!timingSafeEqual(signature, expectedSig)) { return 401; }

  NOTE: Use crypto.timingSafeEqual to prevent timing attacks.
  Store webhook secret per-user in Supabase (encrypted column).

GITHUB CONTENTS API USAGE
  GET /repos/{owner}/{repo}/contents/{path}?ref={commit_sha}
  Response: { content: "<base64>", encoding: "base64", sha: "..." }
  Decode: Buffer.from(content, 'base64').toString('utf-8')

RETRY SYSTEM
  - Webhook processing wrapped in try/catch
  - On failure: log to sync_logs with status = 'failed', error = message
  - Retry queue: Vercel Cron checks sync_logs for failed entries every hour
  - Max retries: 3; after 3 failures → status = 'permanently_failed'
  - User notified via in-app banner for permanently failed syncs

CRON FALLBACK STRATEGY
  - Vercel Cron job runs daily at 2 AM UTC
  - Identifies users where:
      last_synced_at < NOW() - INTERVAL '24 hours'
    OR sync_logs.status = 'failed' in last 24 hours
  - For each: triggers full incremental sync
  - Compares GitHub tree SHA with stored SHA to detect changes

DUPLICATE PREVENTION
  - problems table has UNIQUE constraint on (user_id, github_path)
  - Upsert uses ON CONFLICT (user_id, github_path) DO UPDATE
  - Prevents duplicates even if webhook fires multiple times for same commit
  - github_path = canonical path relative to repo root

SVG RENDERING
  - diagram.svg in problem folder is fetched via Contents API
  - Raw SVG stored in problems.diagram_svg column (TEXT)
  - On render: DOMPurify sanitizes SVG to prevent XSS
  - Rendered with dangerouslySetInnerHTML on problem detail page

CODE LINKING
  - solution.cpp, solution.py, etc. are linked to GitHub
  - URL constructed: https://github.com/{owner}/{repo}/blob/{branch}/{path}
  - Code NOT fetched/stored in DB (GitHub serves as file storage)
  - Code displayed via GitHub embed or redirect to GitHub

INCREMENTAL SYNC (Full Scan Flow)
  1. Fetch repository tree: GET /repos/{owner}/{repo}/git/trees/HEAD?recursive=1
  2. Filter tree to all README.md paths
  3. Fetch each README.md using Contents API (batched, max 30 concurrent)
  4. Parse and upsert each problem
  5. Mark problems in DB whose github_path no longer exists in tree (soft delete)
  6. Update users.last_synced_at

SYNC STATES
  ┌────────────────────┬─────────────────────────────────────────────┐
  │ State              │ Description                                 │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ pending            │ Webhook received, processing not started    │
  │ processing         │ Actively fetching and parsing files         │
  │ synced             │ Successfully processed                      │
  │ failed             │ Error during processing, will retry         │
  │ permanently_failed │ 3 retries exhausted, user notified          │
  │ skipped            │ No README.md changes detected               │
  └────────────────────┴─────────────────────────────────────────────┘

MARKDOWN RENDERING
  - README.md body (below frontmatter) rendered with react-markdown
  - Syntax highlighting via rehype-highlight (highlight.js)
  - Math support via rehype-katex (optional, Phase 2)
  - Sanitization via rehype-sanitize

================================================================================
13. FEATURE 03 — AUTOMATIC METADATA EXTRACTION
================================================================================

PURPOSE
  Extract maximum metadata from the repository structure and file naming
  conventions so users never need to fill forms manually.

METADATA SOURCES (Priority Order)
  1. Markdown frontmatter (highest priority, explicit)
  2. Folder structure (auto-inferred)
  3. File naming convention (auto-inferred)
  4. Platform URL patterns (auto-detected)

FRONTMATTER FIELD DEFINITIONS
  ┌──────────────┬──────────┬─────────────────────────────────────────┐
  │ Field        │ Required │ Description                             │
  ├──────────────┼──────────┼─────────────────────────────────────────┤
  │ title        │ YES      │ Problem display name                    │
  │ difficulty   │ YES      │ Easy / Medium / Hard                    │
  │ dateSolved   │ YES      │ ISO date (YYYY-MM-DD)                   │
  │ platform     │ No       │ LeetCode/Codeforces/GFG/Custom          │
  │ leetcode     │ No       │ LeetCode problem number                 │
  │ url          │ No       │ Problem URL                             │
  │ tags         │ No       │ Array of tag strings                    │
  └──────────────┴──────────┴─────────────────────────────────────────┘

TOPIC INFERENCE FROM FOLDER
  The parent directory of the problem folder maps to the topic:
  - "Binary_Search/" → topic = "Binary Search"
  - "Dynamic_Programming/" → topic = "Dynamic Programming"
  - "Graphs/" → topic = "Graphs"
  - Custom folders auto-added as new topics

  Implementation:
  function inferTopic(githubPath: string): string {
    const parts = githubPath.split('/');
    // DSA/Binary_Search/BS01_Problem/README.md → parts[1]
    const topicFolder = parts.length >= 4 ? parts[1] : parts[0];
    return topicFolder.replace(/_/g, ' ').trim();
  }

PLATFORM DETECTION FROM URL
  If url field is present, auto-detect platform:
  - leetcode.com → LeetCode
  - codeforces.com → Codeforces
  - geeksforgeeks.org → GeeksForGeeks
  - neetcode.io → NeetCode
  - hackerrank.com → HackerRank
  - Otherwise → Custom

DIFFICULTY NORMALIZATION
  Accepted inputs → Normalized value:
  - "Easy", "easy", "E", "1" → Easy
  - "Medium", "medium", "M", "2" → Medium
  - "Hard", "hard", "H", "3" → Hard
  - Unknown → null (shows as "Unrated" in UI)

TAG AUTO-SUGGESTION (Phase 2)
  If tags array is empty, infer from:
  - Topic folder (e.g., Binary Search → [binary-search])
  - Problem title keywords (e.g., "Sliding Window Maximum" → [sliding-window])
  - AI classification (Phase 2)

VALIDATION & WARNINGS
  - Missing title → use folder name as title, flag with sync_warning
  - Missing difficulty → store null, show yellow badge in UI
  - Invalid dateSolved → use commit timestamp as fallback
  - Malformed frontmatter → store raw content, show sync_warning
  - Log all warnings in sync_logs.warnings (JSON array)

================================================================================
14. FEATURE 04 — SPACED REPETITION ENGINE
================================================================================

PURPOSE
  The CORE ENGINE. Ensures users review problems at optimal intervals to
  maximize long-term retention, adapting based on how well each review goes.

ALGORITHM DESIGN
  Based on SM-2 (SuperMemo 2) with modifications for DSA problem context.

  BASE INTERVALS (Initial Schedule)
  ┌────────────────────┬──────────────────────────────────────────┐
  │ Revision #         │ Days After Previous Revision             │
  ├────────────────────┼──────────────────────────────────────────┤
  │ 1st revision       │ Day 1 (day after solving)                │
  │ 2nd revision       │ Day 3                                    │
  │ 3rd revision       │ Day 7                                    │
  │ 4th revision       │ Day 15                                   │
  │ 5th revision       │ Day 30                                   │
  │ 6th revision       │ Day 60                                   │
  │ 7th+ revision      │ Day 90, 180, 365 (long-term maintenance) │
  └────────────────────┴──────────────────────────────────────────┘

RECALL RATING SYSTEM
  After each revision, user selects one of four ratings:

  ┌────────────────────┬──────────────────────────────────────────────┐
  │ Rating             │ Effect on Interval                           │
  ├────────────────────┼──────────────────────────────────────────────┤
  │ Easy               │ interval = current_interval × easeFactor     │
  │                    │ easeFactor increases by 0.15                 │
  │                    │ confidence_level increases by 1              │
  ├────────────────────┼──────────────────────────────────────────────┤
  │ Medium             │ interval stays same or moves 1 step forward  │
  │                    │ easeFactor unchanged                         │
  ├────────────────────┼──────────────────────────────────────────────┤
  │ Hard               │ interval = interval × 0.5 (halved)           │
  │                    │ easeFactor decreases by 0.15 (min 1.3)       │
  │                    │ confidence_level stays same                  │
  ├────────────────────┼──────────────────────────────────────────────┤
  │ Forgot Completely  │ interval resets to 1 day                     │
  │                    │ easeFactor decreases by 0.3 (min 1.3)        │
  │                    │ confidence_level decreases by 1 (min 1)      │
  │                    │ problem flagged as "recently_failed"         │
  └────────────────────┴──────────────────────────────────────────────┘

CONFIDENCE LEVELS
  Level 1: Forgotten / Very Weak
  Level 2: Struggling
  Level 3: Familiar
  Level 4: Confident
  Level 5: Mastered

ADAPTIVE INTERVAL CALCULATION (Pseudocode)
  ─────────────────────────────────────────────────────────────────────
  function calculateNextInterval(rating, currentInterval, easeFactor, revisionNum):

    switch rating:
      case 'easy':
        newInterval = currentInterval * easeFactor
        newEaseFactor = easeFactor + 0.15
        return { interval: ceil(newInterval), easeFactor: newEaseFactor }

      case 'medium':
        // Advance to next base interval
        newInterval = BASE_INTERVALS[revisionNum + 1] ?? currentInterval * 1.3
        return { interval: newInterval, easeFactor: easeFactor }

      case 'hard':
        newInterval = max(1, floor(currentInterval * 0.5))
        newEaseFactor = max(1.3, easeFactor - 0.15)
        return { interval: newInterval, easeFactor: newEaseFactor }

      case 'forgot':
        newEaseFactor = max(1.3, easeFactor - 0.3)
        return { interval: 1, easeFactor: newEaseFactor }

  BASE_INTERVALS = [1, 3, 7, 15, 30, 60, 90, 180, 365]
  DEFAULT_EASE_FACTOR = 2.5
  ─────────────────────────────────────────────────────────────────────

OVERDUE DETECTION
  A problem is overdue if:
    revision_schedule.next_revision_date < CURRENT_DATE AND status = 'pending'

  Overdue penalty: interval does NOT reset on first overdue encounter.
  But if overdue > 7 days: treat as 'forgot' by default on next session start.

DIFFICULTY WEIGHTING
  Problems inherit a difficulty weight affecting initial easeFactor:
    Easy   → initial easeFactor = 2.8
    Medium → initial easeFactor = 2.5
    Hard   → initial easeFactor = 2.2

REVISION COMPLETION EVENT
  On completing a revision:
  1. Record revision_log entry (timestamp, rating, time_taken_seconds)
  2. Update revision_schedule:
     - last_revised_at = NOW()
     - next_revision_date = NOW() + newInterval days
     - revision_count += 1
     - ease_factor = newEaseFactor
     - confidence_level updated
  3. Update problem.confidence_level
  4. Update user streak (see Feature 06)
  5. Award XP (see Feature 08)
  6. Check achievement triggers (see Feature 09)
  7. Update topic pattern scores (see Feature 10)

DATABASE SCHEMA FOR REVISION ENGINE

  TABLE: revision_schedules
  ─────────────────────────────────────────────────────────────────────
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE
  problem_id          UUID REFERENCES problems(id) ON DELETE CASCADE
  revision_count      INT DEFAULT 0
  next_revision_date  DATE NOT NULL
  last_revised_at     TIMESTAMPTZ
  ease_factor         DECIMAL(4,2) DEFAULT 2.5
  current_interval    INT DEFAULT 1  -- days
  confidence_level    INT DEFAULT 3  -- 1-5
  status              TEXT DEFAULT 'pending' -- pending/completed/skipped
  created_at          TIMESTAMPTZ DEFAULT NOW()
  UNIQUE (user_id, problem_id)

  TABLE: revision_logs
  ─────────────────────────────────────────────────────────────────────
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id)
  problem_id          UUID REFERENCES problems(id)
  rating              TEXT NOT NULL  -- easy/medium/hard/forgot
  time_taken_seconds  INT
  revision_number     INT
  interval_before     INT
  interval_after      INT
  notes               TEXT
  created_at          TIMESTAMPTZ DEFAULT NOW()
  INDEX (user_id, created_at)
  INDEX (problem_id, created_at)

================================================================================
15. FEATURE 05 — TODAY REVISION DASHBOARD
================================================================================

PURPOSE
  The primary page users see on login. Shows everything needed for today's
  revision session without cognitive overhead — one glance, instant action.

PAGE SECTIONS (Top to Bottom)

  ┌──────────────────────────────────────────────────────────────────┐
  │ HEADER ROW                                                       │
  │ "Good morning, Rohit 🔥 3-day streak"   [Today: May 10, 2026]  │
  └──────────────────────────────────────────────────────────────────┘
  ┌─────────────────┬─────────────────┬─────────────────────────────┐
  │  STAT CARD       │  STAT CARD      │  STAT CARD                  │
  │  Due Today: 8    │  Overdue: 3     │  Completed Today: 2         │
  └─────────────────┴─────────────────┴─────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │  TODAY'S REVISION LIST                                           │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 🔴 OVERDUE — 3 problems (oldest first)                     │ │
  │  │   • Longest Common Subsequence [DP] [Hard] — 5 days late   │ │
  │  │   • Word Break [DP] [Medium] — 3 days late                 │ │
  │  │   • Dijkstra's Algorithm [Graph] [Medium] — 1 day late     │ │
  │  ├────────────────────────────────────────────────────────────┤ │
  │  │ 📅 DUE TODAY — 5 problems                                  │ │
  │  │   • Binary Search [BS] [Easy]                              │ │
  │  │   • Merge Intervals [Arrays] [Medium]                      │ │
  │  │   • ...                                                    │ │
  │  └────────────────────────────────────────────────────────────┘ │
  └──────────────────────────────────────────────────────────────────┘
  ┌─────────────────────────────┬────────────────────────────────────┐
  │  WEAK TOPICS                │  REVISION CALENDAR                 │
  │  DP: 40% mastery            │  [GitHub-style heatmap]            │
  │  Graphs: 30% mastery        │                                    │
  │  Backtracking: 25% mastery  │                                    │
  └─────────────────────────────┴────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │  UPCOMING HEAVY DAYS                                             │
  │  May 13: 12 revisions due  |  May 17: 8 revisions due           │
  └──────────────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │  RECENTLY FAILED PROBLEMS (last 7 days "forgot" ratings)         │
  │  [Problem cards with red badge]                                  │
  └──────────────────────────────────────────────────────────────────┘

PRIORITIZATION LOGIC
  Problems are sorted in this exact order:
  1. Overdue (sorted by days overdue, descending — most overdue first)
  2. Due today (sorted by confidence level ascending — weakest first)
  3. High-priority weak (confidence = 1 or 2, due within 3 days)

PROBLEM CARD DESIGN
  Each card shows:
  - Problem title
  - Topic badge (color-coded)
  - Difficulty badge
  - Platform icon (LeetCode/CF/GFG)
  - Days overdue label (if applicable)
  - Confidence level indicator (1–5 dots)
  - [Start Revision] button → opens Problem Detail in Blind Mode

EMPTY STATE
  If no revisions due:
  "You're all caught up! 🎉 Your next revision is in X days."
  Show: upcoming revision calendar + suggested new problems to solve

MOBILE EXPERIENCE
  - Stat cards collapse to 2-column grid
  - Today's list becomes full-width card stack
  - Swipe right = "Completed", swipe left = "Skip for now"
  - Bottom navigation bar: Dashboard / Problems / Analytics / Profile

================================================================================
16. FEATURE 06 — STREAK SYSTEM
================================================================================

PURPOSE
  Create daily habits through streak tracking. Psychologically, streaks are
  among the most effective retention mechanisms (Duolingo data: streak users
  retain 5× longer). AlgoRecall tracks two parallel streaks.

STREAK TYPES
  ┌──────────────────────┬──────────────────────────────────────────────┐
  │ Streak Type          │ Criteria for Daily Increment                 │
  ├──────────────────────┼──────────────────────────────────────────────┤
  │ Revision Streak      │ At least 1 revision completed today          │
  │ Solve Streak         │ At least 1 new problem pushed to GitHub      │
  └──────────────────────┴──────────────────────────────────────────────┘

STREAK RULES
  - Day is defined as midnight-to-midnight in user's local timezone
  - User's timezone stored at onboarding (detected from browser)
  - Streak increments when condition met for the FIRST time in a day
  - Streak resets to 0 if condition not met by end of day
  - Solve streak depends on GitHub push events (dateSolved field)

STREAK METRICS TRACKED
  - current_revision_streak (days)
  - current_solve_streak (days)
  - longest_revision_streak (days, all time)
  - longest_solve_streak (days, all time)
  - weekly_revision_days (count of days with revision in last 7 days)
  - monthly_revision_days (count of days with revision in last 30 days)

STREAK FREEZE (Phase 2)
  - Premium feature: 3 freezes per month
  - Consuming a freeze prevents streak reset for 1 missed day
  - UI shows "Streak Freeze Available" and allows manual activation

STREAK DISPLAY
  - Persistent in top navigation bar: 🔥 47
  - Hover/click shows: Revision streak, Solve streak, Longest ever
  - Milestone celebrations: 7, 14, 30, 60, 100, 200, 365 days
    → Confetti animation + achievement unlocked modal

DATABASE SCHEMA
  TABLE: streaks
  ─────────────────────────────────────────────────────────────────────
  id                      UUID PRIMARY KEY
  user_id                 UUID REFERENCES users(id) UNIQUE
  current_revision_streak INT DEFAULT 0
  current_solve_streak    INT DEFAULT 0
  longest_revision_streak INT DEFAULT 0
  longest_solve_streak    INT DEFAULT 0
  last_revision_date      DATE
  last_solve_date         DATE
  streak_freezes_remaining INT DEFAULT 0
  updated_at              TIMESTAMPTZ DEFAULT NOW()

STREAK UPDATE LOGIC (Daily Cron)
  Run nightly at 23:59 user-local time:
  If last_revision_date != TODAY:
    If streak_freezes_remaining > 0: decrement freeze, preserve streak
    Else: reset current_revision_streak = 0

================================================================================
17. FEATURE 07 — REVISION HEATMAP
================================================================================

PURPOSE
  GitHub-style contribution heatmap showing daily revision and solve activity.
  Creates a visual representation of consistency — a powerful motivator.

DESIGN SPEC
  - 52-week grid (1 year view), each cell = 1 day
  - Cell color intensity based on activity count:
    0 revisions → gray (#161b22)
    1-2          → light green (#0e4429)
    3-5          → medium green (#006d32)
    6-9          → bright green (#26a641)
    10+          → vivid green (#39d353)
  - Hover tooltip: "May 10 — 7 revisions, 2 new problems"
  - Click on day → Day summary modal

FILTER OPTIONS
  - All Activity (revisions + new problems)
  - Revisions Only
  - New Problems Only
  - By Topic (e.g., "Show only DP activity")

DATA MODEL
  TABLE: daily_activity
  ─────────────────────────────────────────────────────────────────────
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  activity_date   DATE NOT NULL
  revision_count  INT DEFAULT 0
  new_problems    INT DEFAULT 0
  topics_touched  TEXT[] -- array of topic names
  xp_earned       INT DEFAULT 0
  UNIQUE (user_id, activity_date)

  This table is updated on every revision_log insert via database trigger.

INTERACTION
  - Mobile: tap cell → bottom sheet with day summary
  - Desktop: hover tooltip + click for detail modal

LONGEST ACTIVE PERIOD INDICATOR
  Below the heatmap: "Your longest active period: 47 days (Jan–Feb 2026)"
  Highlight this period in a different color on the grid.

================================================================================
18. FEATURE 08 — XP & LEVEL SYSTEM
================================================================================

PURPOSE
  Gamification through experience points and levels. Transforms daily revision
  from a chore into a progression game. XP rewards consistent behavior.

XP AWARDS
  ┌──────────────────────────────────────────┬──────────────┐
  │ Action                                   │ XP Awarded   │
  ├──────────────────────────────────────────┼──────────────┤
  │ New Easy problem imported                │ +5 XP        │
  │ New Medium problem imported              │ +10 XP       │
  │ New Hard problem imported                │ +20 XP       │
  │ Revision rated Easy                      │ +15 XP       │
  │ Revision rated Medium                    │ +10 XP       │
  │ Revision rated Hard                      │ +8 XP        │
  │ Revision rated Forgot (honesty bonus)    │ +3 XP        │
  │ Completing all due revisions for the day │ +25 XP       │
  │ 7-day streak milestone                   │ +50 XP       │
  │ 30-day streak milestone                  │ +200 XP      │
  │ Completing a topic (10+ problems)        │ +100 XP      │
  │ First revision of a problem (any rating) │ +5 XP        │
  └──────────────────────────────────────────┴──────────────┘

LEVEL SYSTEM
  ┌───────────┬────────────────────┬───────────────────────────────┐
  │ Level     │ Title              │ XP Required (Cumulative)      │
  ├───────────┼────────────────────┼───────────────────────────────┤
  │ 1         │ Beginner           │ 0                             │
  │ 2         │ Explorer           │ 100                           │
  │ 3         │ Problem Solver     │ 300                           │
  │ 4         │ Pattern Seeker     │ 700                           │
  │ 5         │ Pattern Hunter     │ 1,500                         │
  │ 6         │ Algorithm Ninja    │ 3,000                         │
  │ 7         │ Interview Ready    │ 5,000                         │
  │ 8         │ FAANG Contender    │ 8,000                         │
  │ 9         │ FAANG Slayer       │ 12,000                        │
  │ 10        │ DSA Legend         │ 20,000                        │
  └───────────┴────────────────────┴───────────────────────────────┘

LEVEL UP EXPERIENCE
  - Full-screen animation on level up (particle burst + badge reveal)
  - "You've reached Level 5: Pattern Hunter!" modal
  - Shareable card generated (Twitter/LinkedIn share button)
  - New level badge appears on public profile and dashboard

DATABASE SCHEMA
  TABLE: xp_logs
  ─────────────────────────────────────────────────────────────────────
  id          UUID PRIMARY KEY
  user_id     UUID REFERENCES users(id)
  action      TEXT  -- e.g., 'revision_easy', 'streak_milestone'
  xp_amount   INT
  metadata    JSONB -- e.g., { problem_id: "...", streak_days: 7 }
  created_at  TIMESTAMPTZ DEFAULT NOW()

  users table includes:
  total_xp    INT DEFAULT 0
  level       INT DEFAULT 1

ANTI-ABUSE
  - XP from revisions capped at 100/day to prevent gaming
  - New problem XP only awarded once per problem (first import)
  - Streak milestone XP requires streak to be genuine (not frozen)

================================================================================
19. FEATURE 09 — ACHIEVEMENTS & BADGES
================================================================================

PURPOSE
  Achievements recognize milestones and provide non-linear motivation.
  Each badge tells a story of the user's journey.

ACHIEVEMENT CATALOG
  ┌─────────────────────────────┬────────────────────────────────────────────┐
  │ Badge Name                  │ Unlock Condition                           │
  ├─────────────────────────────┼────────────────────────────────────────────┤
  │ 🔥 First Flame              │ First revision completed                   │
  │ 🔥 Week Warrior             │ 7-day revision streak                      │
  │ 🔥 Month Master             │ 30-day revision streak                     │
  │ 🔥 Centurion                │ 100-day revision streak                    │
  │ 💯 Century Club             │ 100 problems solved                        │
  │ 🎯 200 Milestone            │ 200 problems solved                        │
  │ 🔍 Binary Search Master     │ 10+ BS problems, avg confidence ≥ 4        │
  │ 🕸 Graph Conqueror          │ 10+ Graph problems, avg confidence ≥ 4     │
  │ 💡 DP Survivor              │ Completed 5 DP problems (hardest topic)    │
  │ 🔁 Revision Machine         │ 50 total revisions completed               │
  │ 🧠 Total Recall             │ Rate 10 consecutive revisions "Easy"       │
  │ 😤 Honest Learner           │ Rate 10 revisions as "Forgot"              │
  │ ⚡ Speed Reviewer           │ Complete revision in < 5 minutes           │
  │ 🌅 Early Riser              │ Complete revision before 8 AM              │
  │ 🌙 Night Owl                │ Complete revision after 10 PM              │
  │ 📚 Full Stack               │ Solve problem from 5 different platforms   │
  │ 🏆 Pattern Hunter           │ Reach Level 5 in XP system                │
  │ 🎖 FAANG Slayer             │ Interview readiness score ≥ 80%            │
  └─────────────────────────────┴────────────────────────────────────────────┘

UI PRESENTATION
  - Achievements page: grid of badges, locked = grayscale + locked icon
  - Hover: badge name + unlock condition
  - Unlocked: colored + unlock date
  - Achievement unlock: toast notification + optional modal
  - Profile: top 3 badges displayed prominently

DATABASE SCHEMA
  TABLE: achievement_definitions
  id, name, description, icon, criteria_json, xp_reward

  TABLE: user_achievements
  id, user_id, achievement_id, unlocked_at, metadata_json

================================================================================
20. FEATURE 10 — PATTERN TRACKING SYSTEM
================================================================================

PURPOSE
  Track mastery per DSA topic/pattern. Show users exactly where they are
  strong and where they are weak — the foundation of smart preparation.

TRACKED PATTERNS
  Arrays, Binary Search, Linked Lists, Stacks & Queues, Trees, Graphs,
  Dynamic Programming, Trie, Sliding Window, Two Pointers, Greedy,
  Backtracking, Heaps/Priority Queue, Math & Number Theory, Bit Manipulation,
  Segment Trees, Disjoint Sets (DSU)

MASTERY SCORE CALCULATION (Per Topic)
  mastery_score = (
    (avg_confidence_level / 5) × 0.50 +
    (problems_solved / target_count) × 0.25 +
    (revision_completion_rate) × 0.15 +
    (recent_recall_accuracy) × 0.10
  ) × 100

  Where:
  - avg_confidence_level = mean confidence across all topic problems
  - target_count = recommended minimum problems per topic (configurable)
  - revision_completion_rate = completed_revisions / scheduled_revisions (last 30d)
  - recent_recall_accuracy = % of last 10 topic revisions rated Easy or Medium

TOPIC CARD DISPLAY
  Each topic shows:
  - Topic name and icon
  - Mastery score (percentage)
  - Progress bar (color: red < 40%, yellow 40-70%, green > 70%)
  - Problems solved count
  - Confidence level: Weak / Developing / Proficient / Expert
  - Last revised date
  - Next revision due date

WEAKEST TOPICS SURFACE
  Home dashboard shows bottom 3 topics by mastery score with:
  - "Your weakest area — 3 problems due for revision"
  - Quick link to all problems in that topic

DATABASE
  TABLE: topic_stats
  ─────────────────────────────────────────────────────────────────────
  id                  UUID PRIMARY KEY
  user_id             UUID REFERENCES users(id)
  topic_name          TEXT NOT NULL
  problems_solved     INT DEFAULT 0
  avg_confidence      DECIMAL(3,2)
  mastery_score       DECIMAL(5,2)
  last_problem_date   DATE
  last_revised_at     TIMESTAMPTZ
  UNIQUE (user_id, topic_name)

  Recalculated nightly via Cron job or on each revision completion.

================================================================================
21. FEATURE 11 — INTERVIEW READINESS SYSTEM
================================================================================

PURPOSE
  Convert raw activity data into a single, actionable interview readiness score.
  Users know exactly how prepared they are for their target companies.

READINESS SCORE CALCULATION
  Overall_Readiness = Σ (topic_weight × topic_readiness) / Σ(weights)

  Topic weights (based on FAANG interview frequency):
  Arrays          : weight 1.5
  Dynamic Programming : weight 1.5
  Trees           : weight 1.4
  Graphs          : weight 1.3
  Binary Search   : weight 1.2
  Backtracking    : weight 1.1
  Sliding Window  : weight 1.1
  Greedy          : weight 1.0
  Heaps           : weight 1.0
  Trie            : weight 0.8
  Others          : weight 0.7

READINESS DASHBOARD
  ┌─────────────────────────────────────────────────────────────────┐
  │  INTERVIEW READINESS SCORE                                      │
  │                                                                 │
  │             ◉ 68%                                               │
  │      [Large circular gauge]                                     │
  │      "Getting There — Keep Revising"                            │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │  TOPIC BREAKDOWN                                                 │
  │  Arrays      ████████████████████ 92%  ✅ Strong               │
  │  Trees       ██████████████       72%  ⚠️ Good                 │
  │  DP          ████████             40%  🔴 Weak                  │
  │  Graphs      ██████               30%  🔴 Weak                  │
  │  Backtrack   ████                 20%  🔴 Critical Gap          │
  └──────────────────────────────────────────────────────────────────┘
  ┌──────────────────────────────────────────────────────────────────┐
  │  ACTION PLAN                                                     │
  │  1. Revise 3 overdue DP problems today                           │
  │  2. Solve 5 more Graph problems this week                        │
  │  3. Start Backtracking (0 problems solved)                       │
  └──────────────────────────────────────────────────────────────────┘

CONFIDENCE TREND CHART
  Line chart showing readiness_score over last 90 days.
  Shows if user is improving or plateauing.

FORGOTTEN PATTERNS ALERT
  Problems not revised in > 45 days with confidence < 3:
  "You may have forgotten 8 problems. Schedule a catch-up session."

TARGET COMPANY MODE (Phase 2)
  User selects target: Google / Amazon / Microsoft / Flipkart
  System adjusts topic weights based on company-specific interview patterns.
  Shows company-specific readiness score.

================================================================================
22. FEATURE 12 — PROBLEM DETAIL PAGE
================================================================================

PURPOSE
  The primary workspace for a revision session. Displays all information about
  a problem and supports multiple revision modes.

URL STRUCTURE
  /problems/{problem-id}
  /problems/{problem-id}?mode=blind  (Blind Recall Mode)
  /problems/{problem-id}?mode=review (Full Review Mode)

PAGE LAYOUT (Standard Review Mode)

  ┌────────────────────────────────────────────────────────────────┐
  │ ← Back    Two Sum [Arrays] [Easy] [LeetCode #1]    🔗 GitHub  │
  │           Confidence: ●●●○○  |  Revised: 4 times             │
  │           Next revision: May 17   Tags: arrays, hash-map       │
  ├────────────────────────────────────────────────────────────────┤
  │ [MODE TABS]  Blind Recall | Hint Only | Review | Interview Sim │
  ├───────────────────────────────────┬────────────────────────────┤
  │  📝 NOTES (from README.md)        │  📊 SVG DIAGRAM            │
  │                                   │  [rendered diagram.svg]    │
  │  # Intuition                      │                            │
  │  Use hash map for O(n) lookup     │                            │
  │                                   │                            │
  │  # Approach                       │                            │
  │  1. Iterate with hash map         │                            │
  │  2. Check complement              │                            │
  │                                   │                            │
  │  # Complexity                     │                            │
  │  Time: O(n) | Space: O(n)         │                            │
  ├───────────────────────────────────┴────────────────────────────┤
  │  ⚠️ MISTAKE JOURNAL                                            │
  │  "Forgot that complement must be found BEFORE inserting"        │
  ├────────────────────────────────────────────────────────────────┤
  │  💻 VIEW CODE ON GITHUB  [External link button]                │
  ├────────────────────────────────────────────────────────────────┤
  │  📈 REVISION HISTORY                                           │
  │  May 5 — Easy (12 min) | Apr 22 — Medium | Apr 10 — Hard      │
  ├────────────────────────────────────────────────────────────────┤
  │  RATE THIS REVISION: [Easy] [Medium] [Hard] [Forgot]           │
  └────────────────────────────────────────────────────────────────┘

REVISION MODES
  ┌────────────────────┬─────────────────────────────────────────────┐
  │ Mode               │ What's Visible                              │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Blind Recall       │ Title + Tags + Timer only                   │
  │                    │ Reveal buttons: Hint → Intuition → Code     │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Hint Only          │ Title + Tags + Hints only                   │
  │                    │ No full solution visible                    │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Review Mode        │ Full notes + solution link visible          │
  │                    │ Default for solved review (not blind)       │
  ├────────────────────┼─────────────────────────────────────────────┤
  │ Interview Sim      │ Timer + Blind + locked reveals for 20 min   │
  │                    │ Only reveal after timer ends                │
  └────────────────────┴─────────────────────────────────────────────┘

KEYBOARD SHORTCUTS
  Space   → Start/pause timer
  1/2/3/4 → Rate as Easy/Medium/Hard/Forgot
  H       → Toggle hints
  S       → Toggle solution
  Esc     → Exit to dashboard

RELATED PROBLEMS
  At bottom: "More problems in Arrays — 15 more" (sidebar on desktop)

================================================================================
23. FEATURE 13 — BLIND RECALL SYSTEM
================================================================================

PURPOSE
  The most interview-relevant feature. Forces active recall instead of passive
  review. Science shows active recall improves long-term retention by 50%+
  compared to passive re-reading (Karpicke & Blunt, 2011).

WHY BLIND RECALL WORKS
  In a real interview, you see only the problem title and constraints.
  You must derive the approach from scratch. Blind recall mode simulates this
  exact pressure. Passive review (reading your notes) creates an illusion
  of knowledge. Blind recall exposes true recall ability.

UX FLOW

  1. User clicks [Start Revision] from dashboard
  2. Problem page opens in Blind Mode by default
  3. Screen shows:
     ┌────────────────────────────────────────────────┐
     │                                                │
     │   Two Sum                                      │
     │   Tags: arrays, hash-map    Difficulty: Easy   │
     │                                                │
     │   ⏱ 20:00  [Start Timer]                      │
     │                                                │
     │   Think through your approach first.           │
     │   Ready to check hints?                        │
     │                                                │
     │   [Show Hint]  [Show Intuition]  [Show Code]   │
     │                                                │
     └────────────────────────────────────────────────┘

  4. User mentally solves (or attempts to solve)
  5. User reveals hints progressively if needed
  6. Timer tracks time taken
  7. After reviewing, user rates recall quality:
     Easy = recalled instantly
     Medium = needed hints
     Hard = needed full solution
     Forgot = couldn't recall at all

REVEAL BUTTON TRACKING
  - Track which reveals were used (hint/intuition/code)
  - Store in revision_log.metadata
  - Used in analytics: "You needed code reveal for 70% of Hard problems"

INTERVIEW SIMULATION MODE
  - Timer: 25 minutes (configurable)
  - Reveals locked for 10 minutes
  - Encourages attempting before peeking
  - End-of-session score: Time taken + reveals used

================================================================================
24. FEATURE 14 — MISTAKE JOURNAL SYSTEM
================================================================================

PURPOSE
  Structured logging of mistakes made while solving and revising. Patterns
  in mistakes reveal systematic knowledge gaps that raw revision doesn't expose.

MISTAKE TYPES (Categories)
  - Algorithm Logic Error (wrong approach)
  - Boundary Condition (off-by-one, binary search boundaries)
  - Integer Overflow (forgot long long or bigint)
  - Null/Edge Case (empty array, single element)
  - Data Structure Choice (should have used heap, not sorted array)
  - Time/Space Analysis (wrong complexity estimate)
  - Implementation Bug (correct idea, wrong code)
  - Pattern Not Recognized (didn't see it was a sliding window problem)

MISTAKE JOURNAL UI
  On problem detail page, Mistakes section is editable:
  - Existing mistakes from README.md displayed
  - "Add Mistake" button → inline text input (synced back to... DB only)
  - Note: We do NOT write back to GitHub (read-only)
  - Mistakes added via UI stored in problems.user_notes_json

MISTAKE ANALYTICS (Phase 2)
  - Cross-problem mistake frequency analysis
  - "You made boundary condition errors in 8 problems"
  - Automatic tag: problems with mistake type = "boundary" get a 🔴 flag

DATABASE
  Mistakes from README.md frontmatter stored in:
    problems.mistakes TEXT[] (parsed from # Mistakes section)

  User-added mistakes (platform-side):
    problems.user_notes_json JSONB → { "mistakes": [...], "notes": "..." }

================================================================================
25. FEATURE 15 — ANALYTICS SYSTEM
================================================================================

PURPOSE
  Give users data-driven visibility into their preparation quality.
  Move from gut feeling ("I think I know DP") to data ("DP mastery: 42%").

ANALYTICS PAGES

  1. OVERVIEW
     - Total problems solved
     - Total revisions completed
     - Overall mastery score
     - Revision accuracy (% rated Easy or Medium)
     - Problems forgotten in last 30 days

  2. REVISION ANALYTICS
     - Daily revision counts (bar chart, last 30 days)
     - Revision completion rate (% of due revisions completed each day)
     - Rating distribution pie chart: Easy/Medium/Hard/Forgot
     - Average time per revision (trend line)

  3. TOPIC ANALYTICS
     - Radar/spider chart of topic mastery scores
     - Topic-by-topic bar chart (sorted weakest to strongest)
     - Problem count per topic
     - Revision frequency per topic

  4. RECALL ANALYTICS
     - Forgetting curve per problem (confidence over time)
     - % problems at each confidence level
     - Average interval at each confidence level
     - "Forgotten problems" list (rated Forgot in last 14 days)

  5. CONSISTENCY ANALYTICS
     - Current and longest streaks
     - Weekly consistency score (% of days with revision)
     - Monthly consistency heatmap
     - Best day of week / time of day for revisions

CHART LIBRARY: Recharts
  - LineChart: readiness score over time
  - BarChart: daily revisions
  - PieChart: rating distribution
  - RadarChart: topic mastery radar
  - AreaChart: cumulative problems solved

================================================================================
26. FEATURE 16 — AI FEATURES (FUTURE ROADMAP)
================================================================================

PLANNED AI FEATURES (Phase 2–3)

  1. AI-GENERATED INTUITION SUMMARIES
     - If user's README.md has no Intuition section
     - AI reads problem title + tags + solution code
     - Generates a concise 3-5 line intuition summary
     - Stored in problems.ai_intuition_text
     - OpenAI: gpt-4o with structured output prompt

  2. AI HINT GENERATOR
     - On Blind Recall mode, instead of revealing full notes
     - AI generates progressive hints based on problem type
     - Hint 1: "Think about what data structure gives O(1) lookup"
     - Hint 2: "Consider the complement of each number"
     - API: gpt-4o with few-shot prompt per topic

  3. AI WEAK TOPIC RECOMMENDATIONS
     - Analyzes revision history + confidence scores
     - Generates a prioritized weekly study plan
     - "Focus on DP this week: solve 3 new problems + revise 5 old ones"

  4. AI MISTAKE PATTERN ANALYSIS
     - Scans mistake journals across all problems
     - Clusters mistakes by type
     - "You consistently forget boundary conditions in Binary Search"

  5. AI INTERVIEW SIMULATOR (Premium)
     - Chat-based mock interview
     - AI acts as interviewer: asks follow-ups, evaluates approach
     - Uses problem data + user's solution for context

  6. AI TOPIC CLASSIFICATION
     - If problem folder is in "Uncategorized/"
     - AI reads title + notes → infers correct topic
     - Auto-assigns topic tag

ARCHITECTURE FOR AI INTEGRATION
  - Next.js API route: /api/ai/{feature}
  - Server-side only (API key never exposed to client)
  - OpenAI API called with structured system prompt
  - Results cached in Supabase for 7 days (avoid repeated API calls)
  - Rate limited: max 10 AI requests/user/day (free tier)
  - Premium: 100 AI requests/user/day

================================================================================
27. FEATURE 17 — SEARCH & FILTERING
================================================================================

GLOBAL SEARCH
  - Search bar in navigation (keyboard shortcut: Cmd+K / Ctrl+K)
  - Searches problem titles (fuzzy match using Fuse.js)
  - Shows results as user types (debounced 300ms)
  - Results grouped: Exact Match | Topic Match | Tag Match
  - Keyboard navigation (arrow keys + enter)

PROBLEMS LIST PAGE
  Filter panel (sidebar on desktop, bottom sheet on mobile):

  ┌──────────────────────────────────────────────┐
  │ FILTERS                              [Reset]  │
  ├──────────────────────────────────────────────┤
  │ Topic:     [All ▼] [Arrays] [DP] [Graphs]... │
  │ Difficulty:[All ▼] [Easy]  [Medium] [Hard]   │
  │ Platform:  [All ▼] [LeetCode] [CF] [GFG]     │
  │ Status:    [All] [Due Today] [Overdue]        │
  │            [Mastered] [Weak]                  │
  │ Confidence:[All] [1] [2] [3] [4] [5]         │
  │ Tags:      [search tags...]                   │
  └──────────────────────────────────────────────┘

SORT OPTIONS
  - Due date (soonest first)
  - Confidence (lowest first — for focused weak study)
  - Date added (newest first)
  - Title (alphabetical)
  - Difficulty (Easy → Hard or Hard → Easy)

SAVED FILTERS (Phase 2)
  User can save filter combinations as named views:
  "DP Weak Problems" = { topic: DP, confidence: [1,2] }
  Quick-access from dashboard sidebar.

================================================================================
28. FEATURE 18 — NOTIFICATION SYSTEM
================================================================================

IN-APP NOTIFICATIONS (MVP)
  - Toast on revision completion: "✅ Revised! Next due in 7 days"
  - Banner for sync warnings: "⚠️ 3 problems have incomplete frontmatter"
  - Achievement unlocked modal
  - Streak at-risk warning (if no revision by 8 PM): banner in app
  - Level up modal

EMAIL NOTIFICATIONS (Phase 2)
  Trigger: if user hasn't opened app in 2 days
  Subject: "You have 12 overdue revisions, Rohit 🔴"
  Body: list top 5 overdue problems, CTA button
  Provider: Resend or SendGrid
  Unsubscribe: one-click, compliant with CAN-SPAM/GDPR

PUSH NOTIFICATIONS (Phase 3)
  - Web push via PWA service worker
  - Daily reminder at user-preferred time
  - "Your DP revision is 3 days overdue"

TELEGRAM BOT (Phase 3)
  - Daily digest sent to Telegram
  - Commands: /due, /streak, /weak
  - One-tap revision confirmation

================================================================================
29. DATABASE DESIGN (COMPLETE SCHEMA)
================================================================================

NOTE: All tables use PostgreSQL via Supabase.
UUID primary keys generated via gen_random_uuid().
Row-Level Security (RLS) enabled on all tables.
All user data scoped to user_id.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: users
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  github_id           BIGINT UNIQUE NOT NULL
  github_username     TEXT NOT NULL
  github_avatar_url   TEXT
  email               TEXT UNIQUE
  display_name        TEXT
  repo_owner          TEXT           -- github username of repo owner
  repo_name           TEXT           -- selected DSA repository name
  repo_branch         TEXT DEFAULT 'main'
  webhook_id          BIGINT         -- GitHub webhook ID
  webhook_secret      TEXT           -- encrypted
  github_access_token TEXT           -- encrypted
  last_synced_at      TIMESTAMPTZ
  total_xp            INT DEFAULT 0
  level               INT DEFAULT 1
  timezone            TEXT DEFAULT 'Asia/Kolkata'
  theme               TEXT DEFAULT 'dark'
  onboarding_done     BOOLEAN DEFAULT FALSE
  created_at          TIMESTAMPTZ DEFAULT NOW()
  updated_at          TIMESTAMPTZ DEFAULT NOW()
  deleted_at          TIMESTAMPTZ    -- soft delete
  INDEX (github_id)
  INDEX (repo_owner, repo_name)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: problems
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE
  github_path         TEXT NOT NULL   -- relative path in repo
  title               TEXT NOT NULL
  topic               TEXT NOT NULL
  difficulty          TEXT            -- Easy/Medium/Hard/null
  platform            TEXT            -- LeetCode/Codeforces/etc
  platform_id         TEXT            -- problem number/ID on platform
  url                 TEXT            -- problem URL
  date_solved         DATE
  tags                TEXT[]
  intuition_md        TEXT            -- parsed body of README.md
  mistakes            TEXT[]          -- parsed Mistakes section
  diagram_svg         TEXT            -- raw sanitized SVG content
  solution_files      JSONB           -- [{ filename, extension, github_url }]
  user_notes_json     JSONB           -- platform-side notes/mistakes
  ai_intuition_text   TEXT            -- AI-generated (Phase 2)
  confidence_level    INT DEFAULT 3   -- 1-5
  sync_status         TEXT DEFAULT 'synced' -- synced/warning/error
  sync_warnings       JSONB           -- array of warning messages
  is_deleted          BOOLEAN DEFAULT FALSE
  created_at          TIMESTAMPTZ DEFAULT NOW()
  updated_at          TIMESTAMPTZ DEFAULT NOW()
  UNIQUE (user_id, github_path)
  INDEX (user_id, topic)
  INDEX (user_id, date_solved)
  INDEX (user_id, difficulty)
  INDEX (user_id, is_deleted)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: revision_schedules
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE
  problem_id          UUID REFERENCES problems(id) ON DELETE CASCADE
  revision_count      INT DEFAULT 0
  next_revision_date  DATE NOT NULL
  last_revised_at     TIMESTAMPTZ
  ease_factor         DECIMAL(4,2) DEFAULT 2.5
  current_interval    INT DEFAULT 1     -- days until next revision
  confidence_level    INT DEFAULT 3     -- mirror of problems.confidence_level
  status              TEXT DEFAULT 'pending'  -- pending/active/mastered
  created_at          TIMESTAMPTZ DEFAULT NOW()
  updated_at          TIMESTAMPTZ DEFAULT NOW()
  UNIQUE (user_id, problem_id)
  INDEX (user_id, next_revision_date)   -- critical for daily query
  INDEX (user_id, status)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: revision_logs
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id)
  problem_id          UUID REFERENCES problems(id)
  rating              TEXT NOT NULL  -- easy/medium/hard/forgot
  time_taken_seconds  INT
  revision_number     INT            -- which revision this was (1st, 2nd, ...)
  interval_before     INT            -- days before this revision
  interval_after      INT            -- days until next after this
  ease_before         DECIMAL(4,2)
  ease_after          DECIMAL(4,2)
  reveals_used        JSONB          -- { hint: bool, intuition: bool, code: bool }
  notes               TEXT
  created_at          TIMESTAMPTZ DEFAULT NOW()
  INDEX (user_id, created_at)
  INDEX (problem_id, created_at)
  INDEX (user_id, rating, created_at)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: topic_stats
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id             UUID REFERENCES users(id)
  topic_name          TEXT NOT NULL
  problems_solved     INT DEFAULT 0
  avg_confidence      DECIMAL(3,2) DEFAULT 3.0
  mastery_score       DECIMAL(5,2) DEFAULT 0
  revision_count      INT DEFAULT 0
  last_problem_date   DATE
  last_revised_at     TIMESTAMPTZ
  updated_at          TIMESTAMPTZ DEFAULT NOW()
  UNIQUE (user_id, topic_name)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: streaks
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id                  UUID REFERENCES users(id) UNIQUE
  current_revision_streak  INT DEFAULT 0
  current_solve_streak     INT DEFAULT 0
  longest_revision_streak  INT DEFAULT 0
  longest_solve_streak     INT DEFAULT 0
  last_revision_date       DATE
  last_solve_date          DATE
  streak_freezes_remaining INT DEFAULT 0
  updated_at               TIMESTAMPTZ DEFAULT NOW()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: daily_activity
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id          UUID REFERENCES users(id)
  activity_date    DATE NOT NULL
  revision_count   INT DEFAULT 0
  new_problems     INT DEFAULT 0
  topics_touched   TEXT[]
  xp_earned        INT DEFAULT 0
  UNIQUE (user_id, activity_date)
  INDEX (user_id, activity_date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: xp_logs
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id      UUID REFERENCES users(id)
  action       TEXT NOT NULL
  xp_amount    INT NOT NULL
  metadata     JSONB
  created_at   TIMESTAMPTZ DEFAULT NOW()
  INDEX (user_id, created_at)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: achievement_definitions
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
  slug         TEXT UNIQUE NOT NULL
  name         TEXT NOT NULL
  description  TEXT
  icon         TEXT
  criteria     JSONB
  xp_reward    INT DEFAULT 0

TABLE: user_achievements
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id         UUID REFERENCES users(id)
  achievement_id  UUID REFERENCES achievement_definitions(id)
  unlocked_at     TIMESTAMPTZ DEFAULT NOW()
  metadata        JSONB
  UNIQUE (user_id, achievement_id)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLE: sync_logs
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id        UUID REFERENCES users(id)
  sync_type      TEXT NOT NULL  -- webhook/manual/cron
  status         TEXT NOT NULL  -- pending/processing/synced/failed/perm_failed
  files_added    INT DEFAULT 0
  files_updated  INT DEFAULT 0
  files_removed  INT DEFAULT 0
  warnings       JSONB          -- array of warning objects
  error_message  TEXT
  retry_count    INT DEFAULT 0
  github_delivery TEXT          -- X-GitHub-Delivery header value
  started_at     TIMESTAMPTZ DEFAULT NOW()
  completed_at   TIMESTAMPTZ
  INDEX (user_id, started_at)
  INDEX (status, started_at)   -- for cron retry queries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROW LEVEL SECURITY POLICIES (Applied to all tables)
  Example for problems table:
  ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Users can only access own problems" ON problems
    USING (auth.uid() = user_id);

DATABASE FUNCTIONS (Supabase PostgreSQL Functions)

  1. fn_update_streak_on_revision()
     Trigger: AFTER INSERT ON revision_logs
     Updates streaks table, daily_activity table, topic_stats table

  2. fn_award_xp(user_id, action, amount, metadata)
     Inserts xp_logs, updates users.total_xp, checks for level up

  3. fn_check_achievements(user_id)
     Checks all achievement criteria, inserts new user_achievements

  4. fn_recalculate_topic_stats(user_id, topic_name)
     Recalculates mastery_score in topic_stats

================================================================================
30. API ARCHITECTURE
================================================================================

BASE URL: /api (Next.js API Routes, deployed on Vercel Serverless)

AUTH MIDDLEWARE
  All protected routes check Supabase session:
  - Extract token from Authorization header or cookie
  - Verify with supabase.auth.getUser()
  - Attach user to request context
  - Return 401 if invalid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: POST /api/webhook/github
  Auth     : No (but HMAC-SHA256 verified)
  Purpose  : Receive GitHub push webhook
  Request  : Raw body (needed for signature validation)
  Response : 200 OK (always, to prevent GitHub retries on 5xx)
  Timeout  : 30s (process async, respond immediately)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: GET /api/problems
  Auth     : Required
  Query    : topic, difficulty, platform, status, confidence, page, limit
  Response :
  {
    "problems": [...],
    "total": 150,
    "page": 1,
    "limit": 20,
    "filters_applied": {}
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: GET /api/problems/{id}
  Auth     : Required
  Response :
  {
    "problem": { ...all fields },
    "revision_schedule": { next_date, revision_count, confidence },
    "revision_history": [ ...last 10 logs ],
    "related_problems": [ ...same topic, max 5 ]
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: POST /api/revisions
  Auth     : Required
  Purpose  : Submit a revision rating
  Body     :
  {
    "problem_id": "uuid",
    "rating": "easy|medium|hard|forgot",
    "time_taken_seconds": 720,
    "reveals_used": { "hint": false, "intuition": true, "code": false },
    "notes": "Needed to look at mid calculation"
  }
  Response :
  {
    "next_revision_date": "2026-05-17",
    "interval_days": 7,
    "xp_awarded": 15,
    "streak_updated": true,
    "achievement_unlocked": null
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: GET /api/dashboard
  Auth     : Required
  Response :
  {
    "due_today": [ ...problems ],
    "overdue": [ ...problems ],
    "recently_failed": [ ...problems ],
    "weak_topics": [ ...topic_stats ],
    "streak": { revision: 7, solve: 3, longest: 14 },
    "upcoming_heavy_days": [ { date, count } ],
    "readiness_score": 68
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: POST /api/sync/trigger
  Auth     : Required
  Purpose  : Manually trigger full repository sync
  Response : { "sync_log_id": "uuid", "status": "processing" }

ENDPOINT: GET /api/sync/status/{sync_log_id}
  Auth     : Required
  Response : { "status": "synced", "files_added": 5, "warnings": [] }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENDPOINT: GET /api/analytics/overview
ENDPOINT: GET /api/analytics/topics
ENDPOINT: GET /api/analytics/revisions?period=30d
ENDPOINT: GET /api/analytics/heatmap?year=2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CACHING STRATEGY
  - Dashboard endpoint: cached per user, 5-minute TTL (Vercel Edge Cache)
  - Analytics: cached per user, 30-minute TTL
  - Problem detail: no cache (must be fresh for revision)
  - Static pages (landing, docs): Vercel CDN indefinite cache with revalidation

RATE LIMITING (Phase 2 with Upstash Redis)
  - /api/sync/trigger: max 5/hour per user
  - /api/revisions: max 200/day per user
  - /api/webhook/github: no user limit (GitHub IPs allowlisted)
  - Global: 1000 req/min per IP (DDoS protection)

================================================================================
31. UI/UX DESIGN SYSTEM
================================================================================

DESIGN PHILOSOPHY
  Inspired by: GitHub (data-dense, clean) + Linear (fast, keyboard-driven)
  + Duolingo (gamified, motivating) + Obsidian (developer-native)

  Principles:
  1. INFORMATION DENSITY: Show maximum useful data with minimum noise
  2. SPEED: Every interaction responds < 100ms (optimistic UI updates)
  3. DARK FIRST: Default dark mode, light mode toggle
  4. KEYBOARD FIRST: All actions accessible via keyboard shortcuts
  5. MOBILE CAPABLE: Full functionality on mobile browsers

COLOR SYSTEM (Dark Mode Default)
  Background primary   : #0d1117  (GitHub dark)
  Background secondary : #161b22
  Background tertiary  : #21262d
  Border default       : #30363d
  Text primary         : #e6edf3
  Text secondary       : #8b949e
  Text muted           : #6e7681
  Accent blue          : #58a6ff
  Accent green         : #3fb950
  Accent yellow        : #d29922
  Accent red           : #f85149
  Accent purple        : #bc8cff
  Success              : #238636
  Warning              : #9e6a03
  Error                : #da3633

TYPOGRAPHY
  Primary font    : Inter (system UI fallback: -apple-system)
  Monospace       : JetBrains Mono (code blocks)
  Base size       : 14px
  Scale           : 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40px
  Line height     : 1.5 (prose), 1.2 (headings)

SPACING SYSTEM (4px base unit)
  4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px

COMPONENT LIBRARY (shadcn/ui)
  Base components: Button, Input, Badge, Card, Dialog, Tabs, Progress,
                   Tooltip, Select, Command (for search), Calendar,
                   DropdownMenu, Toast, Sheet (mobile drawer)

  Custom components:
  - ProblemCard: consistent problem display
  - RevisionButton: Easy/Medium/Hard/Forgot rating buttons
  - StreakBadge: fire emoji + count
  - TopicBadge: color-coded per topic
  - ConfidenceIndicator: 5-dot confidence visual
  - HeatmapGrid: GitHub-style activity heatmap
  - ReadinessGauge: circular gauge chart
  - RevealButton: progressive disclosure button

NAVIGATION STRUCTURE
  Desktop (sidebar):
  ├── Dashboard (Today's revisions)
  ├── Problems (full library)
  ├── Analytics
  ├── Achievements
  ├── Settings
  └── [User avatar + streak in top right]

  Mobile (bottom tab bar):
  ├── 🏠 Home (Dashboard)
  ├── 📚 Problems
  ├── 📊 Stats
  └── 👤 Profile

ANIMATION GUIDELINES (Framer Motion)
  - Page transitions: fade-in 150ms ease-out
  - Card hover: scale(1.01) 100ms ease
  - Achievement unlock: spring animation + confetti
  - Reveal buttons: slide-down 200ms ease-out
  - Streak increment: bounce scale 300ms
  - All animations respect prefers-reduced-motion

ACCESSIBILITY
  - WCAG 2.1 AA compliance
  - All interactive elements keyboard accessible
  - ARIA labels on icon-only buttons
  - Focus rings visible (not removed)
  - Color not sole indicator (also icons/text for severity)
  - Screen reader tested with VoiceOver / NVDA

================================================================================
32. MOBILE RESPONSIVENESS
================================================================================

BREAKPOINTS
  Mobile   : < 768px
  Tablet   : 768px – 1024px
  Desktop  : > 1024px

MOBILE-FIRST DESIGN
  Problem cards: full-width, single column
  Dashboard stats: 2-column grid
  Navigation: bottom tab bar
  Revision session: full-screen card mode
  Filters: bottom sheet drawer

MOBILE-SPECIFIC UX PATTERNS
  - Swipe right on problem card → Mark revised
  - Swipe left → Skip for today
  - Pull to refresh on dashboard
  - Sticky "Rate This Revision" bar at screen bottom during session
  - Large tap targets (minimum 44×44px)

PERFORMANCE ON MOBILE
  - Code splitting per route (Next.js automatic)
  - Images lazy-loaded
  - SVG diagrams rendered only when in viewport
  - React Query caches API responses (no redundant fetches on tab switch)
  - Service Worker (PWA, Phase 2) for offline revision capability

================================================================================
33. PERFORMANCE OPTIMIZATION
================================================================================

SSR / ISR STRATEGY
  - Landing page      : Static (no SSR needed)
  - Dashboard         : Server Component (SSR, per-request)
  - Problem detail    : SSR + client hydration
  - Analytics         : CSR with React Query (stale-while-revalidate)
  - Problem list      : SSR with streaming (Next.js Suspense)

DATABASE QUERY OPTIMIZATION
  - Composite index on (user_id, next_revision_date) for daily query
  - Materialized view for dashboard stats (refreshed every 5 min via Cron)
  - pagination with cursor-based (not offset) for problems list
  - DB connection pooling via Supabase connection pooler (PgBouncer)

MARKDOWN OPTIMIZATION
  - Parse frontmatter only once at sync time → store parsed JSON in DB
  - Body rendered client-side via react-markdown (not stored)
  - Code highlighting via highlight.js (loaded lazily)

SVG OPTIMIZATION
  - SVGs sanitized at sync time with DOMPurify (server-side)
  - Sanitized SVG stored in DB (TEXT column)
  - Rendered with dangerouslySetInnerHTML (safe after sanitization)
  - Max SVG size: 200KB (warn user if larger)

API RESPONSE TIMES (Targets)
  Dashboard    : < 300ms (server-side, pre-computed stats)
  Problem list : < 200ms (paginated, indexed)
  Revision POST: < 150ms (simple upsert + trigger)
  Webhook      : < 100ms to respond (async processing)

================================================================================
34. SECURITY
================================================================================

OAUTH SECURITY
  - OAuth state parameter used to prevent CSRF on callback
  - Token exchanged server-side only (never in client code)
  - GitHub access token encrypted in DB using AES-256-GCM
  - Encryption key stored in Vercel environment variables

WEBHOOK SECURITY
  - HMAC-SHA256 signature validation on every webhook
  - Raw body used for signature (not parsed body)
  - crypto.timingSafeEqual used to prevent timing attacks
  - Webhook secret unique per user, stored encrypted

SUPABASE RLS
  - Row Level Security on all tables: users can only access own data
  - Service role key (used in API routes) never exposed to client
  - Anon key used only for auth flows (limited permissions)

XSS PREVENTION
  - SVG content sanitized with DOMPurify before storage and render
  - Markdown rendered with rehype-sanitize
  - No innerHTML except for sanitized SVG/markdown
  - Content-Security-Policy headers configured in Vercel

SQL INJECTION PREVENTION
  - Supabase JavaScript client uses parameterized queries exclusively
  - Never string-concatenate user input into SQL
  - Database function inputs validated at function level

API SECURITY
  - All user-facing API routes require Supabase auth session
  - Resource ownership validated on every request
  - Problem IDs checked against user_id before any operation
  - Webhook endpoint accepts only GitHub IP ranges (allowlist, Phase 2)

TOKEN HANDLING
  - JWT stored in HttpOnly, Secure, SameSite=Strict cookie
  - Never stored in localStorage
  - Refresh token rotation enabled (Supabase default)

DEPENDENCY SECURITY
  - npm audit run in CI pipeline
  - Dependabot configured for automated security updates
  - No user-controllable server-side code execution

================================================================================
35. MVP PRIORITIZATION
================================================================================

MUST HAVE (Week 1–2, Core Loop)
  ✅ GitHub OAuth Authentication
  ✅ Repository selection and webhook registration
  ✅ GitHub Import Engine (webhook + manual sync)
  ✅ Markdown frontmatter parsing
  ✅ Problems database and display
  ✅ Spaced repetition engine (basic 6-interval schedule)
  ✅ Today Dashboard (due today + overdue list)
  ✅ Problem Detail Page (Review Mode)
  ✅ Revision submission (Easy/Medium/Hard/Forgot ratings)
  ✅ Basic Streak System
  ✅ Mobile responsive layout

SHOULD HAVE (Week 3–4)
  ⚡ Blind Recall Mode
  ⚡ XP and Level System
  ⚡ Revision Heatmap
  ⚡ Topic Pattern Tracking
  ⚡ Basic Analytics (overview + topic chart)
  ⚡ Search and Filtering
  ⚡ SVG Diagram Rendering
  ⚡ Interview Readiness Score

NICE TO HAVE (Phase 2)
  💡 Achievements and Badges
  💡 Mistake Journal (platform-side notes)
  💡 Email Notifications
  💡 AI Hint Generator
  💡 Streak Freeze System
  💡 Keyboard Shortcuts
  💡 Advanced Analytics
  💡 PWA / Offline Support
  💡 Public Profile Page

DO NOT BUILD IN MVP
  ❌ AI Interview Simulator
  ❌ Telegram/Discord notifications
  ❌ Team/collaborative features
  ❌ Browser extension
  ❌ Leaderboards
  ❌ Target company mode

================================================================================
36. DEVELOPMENT ROADMAP
================================================================================

WEEK 1: FOUNDATION
  Day 1–2: Project setup
    - Next.js 14 + TypeScript + Tailwind + shadcn/ui
    - Supabase project, schema migration, RLS policies
    - GitHub OAuth via Supabase Auth
    - Environment config (Vercel)

  Day 3–4: Core data layer
    - All database tables created
    - Supabase client configured (server + browser)
    - Auth middleware for API routes
    - User creation trigger (on GitHub OAuth)

  Day 5–7: GitHub Import Engine
    - Webhook registration on repo selection
    - /api/webhook/github endpoint
    - gray-matter frontmatter parsing
    - Problem upsert logic
    - Initial full scan on onboarding

WEEK 2: CORE FEATURES
  Day 8–9: Spaced Repetition Engine
    - revision_schedules generation on import
    - Interval calculation algorithm
    - /api/revisions POST endpoint
    - Daily cron for overdue detection

  Day 10–11: Today Dashboard
    - /api/dashboard endpoint
    - Dashboard page with React components
    - Due today list, overdue list, stat cards
    - Mobile layout

  Day 12–14: Problem Detail Page
    - Problem page with all sections
    - Markdown rendering
    - Revision rating buttons
    - Revision history

WEEK 3: ENGAGEMENT SYSTEMS
  Day 15–16: Streak System
    - Streak calculation and display
    - Streak update on revision
    - Daily streak check cron

  Day 17–18: Blind Recall Mode
    - Mode switching on problem page
    - Progressive reveal buttons
    - Timer component

  Day 19–21: XP + Analytics
    - XP award on revision
    - Level calculation
    - Heatmap component
    - Basic analytics page

WEEK 4: POLISH & LAUNCH
  Day 22–23: Search + Filtering
    - Problems list with filters
    - Global search with Cmd+K

  Day 24–25: Mobile polish
    - Bottom navigation
    - Swipe interactions
    - Touch optimization

  Day 26–28: Testing & Launch prep
    - End-to-end testing (Playwright)
    - Performance audit
    - Security review
    - Landing page
    - ProductHunt launch kit

MONTH 2: PHASE 2
  - Achievements & Badges
  - Interview Readiness Score
  - Topic Pattern Tracking
  - Email notification system
  - AI Hint Generator (OpenAI)
  - Public profiles

MONTH 3: PHASE 3
  - AI Interview Simulator (Premium)
  - Streak Freeze (Premium)
  - Target Company Mode
  - PWA with offline support
  - Advanced mistake analytics

LONG-TERM VISION (6–12 months)
  - Mobile app (React Native or Expo)
  - VSCode extension for in-editor revision
  - Browser extension (LeetCode → auto-create folder structure)
  - Team/company mode for hiring prep
  - Community: shared flashcard decks per topic
  - Leaderboards and competitive revision

================================================================================
37. FUTURE FEATURES
================================================================================

PUBLIC PROFILES
  - /u/{github_username} public page
  - Shows: problems solved count, topic mastery chart, current streak
  - Shareable URL for resumes and LinkedIn
  - Privacy toggle (public/private)

LEADERBOARDS
  - Weekly XP leaderboard among friends
  - College-based leaderboard (using email domain)
  - Global leaderboard (opt-in)

BROWSER EXTENSION (LeetCode Companion)
  - Detects when user submits on LeetCode
  - Auto-creates folder structure in GitHub repo
  - Prompts for tags and difficulty
  - Push confirmation → problem auto-imported to AlgoRecall

CONTEST MODE
  - Virtual contest simulation
  - Timed problem set from user's library
  - Score and rank at end

VSCODE EXTENSION
  - While writing solution in VSCode
  - Sidebar shows: problem info, hints, your previous notes
  - "Mark as solved" button triggers GitHub commit

COLLABORATIVE REVISION
  - Pair up with a friend
  - Solve same problem set
  - Compare notes and approaches
  - Accountability partner system

MOBILE APP (Phase 4)
  - React Native (Expo)
  - Full revision experience on mobile
  - Push notifications native
  - Offline mode with local SQLite sync

AI TUTOR
  - Conversational AI for problem walkthroughs
  - Asks Socratic questions to guide thinking
  - Doesn't give direct answer, guides toward it

================================================================================
38. MONETIZATION STRATEGY
================================================================================

FREE TIER
  - Unlimited problems (up to 1 connected repo)
  - All core revision features
  - Basic analytics
  - Streak tracking
  - Standard spaced repetition

PREMIUM TIER ($6/month or $49/year)
  - AI-generated hints and intuitions
  - Advanced analytics with trend forecasting
  - Multiple repository support
  - Email/Telegram notifications
  - Streak freeze (3/month)
  - Target company readiness mode
  - Priority webhook processing
  - Public profile customization
  - AI Interview Simulator (10 sessions/month)

TEAM TIER ($15/user/month)
  - All Premium features
  - Team dashboard for coaches/mentors
  - Shared problem sets
  - Team leaderboard
  - Admin analytics

MONETIZATION TIMELINE
  Month 1–2 : Free only (grow user base, validate core product)
  Month 3   : Launch Premium ($6/month), target 5% conversion
  Month 6   : Team tier, target bootcamps and coaching institutes
  Month 12  : API for developers / other EdTech integrations

REVENUE PROJECTIONS (Conservative)
  Month 3  : 1,000 users, 50 premium = $300/month
  Month 6  : 5,000 users, 250 premium = $1,500/month
  Month 12 : 20,000 users, 1,000 premium = $6,000/month

================================================================================
39. EDGE CASES & TRADEOFFS
================================================================================

EDGE CASES TO HANDLE

  1. User renames a problem folder in GitHub
     → github_path changes → treated as new problem + old soft-deleted
     → FIX: Match on title + dateSolved as secondary dedup key

  2. User deletes README.md but keeps solution file
     → webhook detects removal → soft-delete problem
     → FIX: Warn user in UI that problem was removed from GitHub

  3. Frontmatter is completely missing
     → Parse failure → infer from folder name + commit date
     → Store with sync_warning

  4. GitHub API rate limits hit during full scan
     → 5,000 req/hour per authenticated user
     → For 500-problem repo: ~1,000 API calls → safe
     → For 2,000+ problems: use tree API (1 call for all paths) + batch content

  5. User's repo is private, token expires
     → GitHub API returns 401 → flag user in DB → show re-auth banner

  6. Webhook delivery fails (GitHub retry)
     → GitHub retries with same X-GitHub-Delivery ID
     → Deduplicate using github_delivery column in sync_logs

  7. Multiple commits in one push (squash/merge)
     → Payload contains all commits → process all changed files
     → Aggregate all added/modified/removed across all commits

  8. User changes dateSolved in frontmatter
     → Revision schedule should recompute from new date
     → TRADEOFF: Reset revision history or preserve it
     → Decision: Preserve history, adjust next_revision_date from today

  9. SVG with JavaScript inside (XSS risk)
     → DOMPurify strips all <script> and event handlers
     → SVG interactions (pure CSS) still work

  10. User revises 100 problems in one day (data entry)
      → XP cap per day prevents gaming
      → Revision logs stored normally for analytics accuracy

TRADEOFFS

  T1: GitHub as source of truth vs. in-app editing
      → Chose GitHub because developers already use it
      → Tradeoff: can't edit problem notes on the platform
      → Mitigation: allow platform-side notes (not synced back to GitHub)

  T2: Webhook vs. polling
      → Chose webhooks for real-time sync
      → Tradeoff: webhook can miss events (network issues)
      → Mitigation: Cron fallback + manual sync button

  T3: SM-2 vs. custom algorithm
      → Chose SM-2 variant (proven, simple to understand)
      → Tradeoff: not as adaptive as FSRS (newer algorithm)
      → Mitigation: Future upgrade path to FSRS in Phase 2

  T4: Storing SVG in DB vs. fetching from GitHub
      → Chose storing in DB for performance
      → Tradeoff: DB size grows; SVGs can be up to 200KB each
      → Mitigation: Store only if < 200KB; else render via GitHub raw URL

================================================================================
40. SCALING CONSIDERATIONS
================================================================================

USER SCALE MILESTONES

  Phase 1 (0–1,000 users):
    Single Supabase project on free/pro plan
    Vercel hobby/pro plan
    No Redis needed
    GitHub API within rate limits (5,000/hr per token)

  Phase 2 (1,000–10,000 users):
    Supabase pro plan (more connections, compute)
    Upstash Redis for caching and rate limiting
    Webhook queue (Bull/BullMQ via Upstash Redis)
    Async webhook processing (respond 200 immediately, process in background)

  Phase 3 (10,000–100,000 users):
    Separate webhook processing service (Node.js worker on Railway/Render)
    Database read replicas for analytics queries
    CDN for static assets (already via Vercel)
    OpenAI API budget management (token throttling per user tier)

  Phase 4 (100,000+ users):
    Microservices split: auth-service, sync-service, revision-service
    Event streaming (Kafka or Supabase Realtime at scale)
    Multi-region Supabase (upcoming feature)
    Custom rate limiting per user tier

DATABASE SCALING
  - Partition revision_logs by created_at (monthly partitions)
  - Archive daily_activity > 2 years to cold storage
  - Index-only scans for dashboard queries
  - Connection pooling: PgBouncer (Supabase managed)
  - Max connections: scale Supabase compute tier

GITHUB API SCALING
  - Cache GitHub repo tree for 5 minutes (avoid redundant scans)
  - Use conditional requests (ETag/If-None-Match) to save quota
  - Per-user token means 5,000 req/hr × users = linear scaling
  - GitHub App (future): 15,000 req/hr shared pool for verified app

MULTI-TENANT ARCHITECTURE
  - Data fully isolated via user_id + RLS
  - No shared mutable state between users
  - Each user's webhook secret is unique
  - Horizontal scaling: Vercel serverless scales automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  AlgoRecall PRD v1.0.0
  Confidential — Internal Engineering & Product Document
  "Solve once. Remember forever. Crack interviews."