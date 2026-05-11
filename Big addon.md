You are a senior staff engineer and product designer. 

Your task is to redesign and refactor the revision scheduling + dashboard psychology of my existing web app “AlgoRecall” WITHOUT breaking any existing functionality.

IMPORTANT:
- Do NOT rewrite the entire app.
- Do NOT remove existing features.
- Do NOT change the current database unnecessarily.
- Do NOT break GitHub sync.
- Do NOT break streaks, XP, analytics, auth, or current revision flow.
- Preserve all existing production-safe logic wherever possible.
- Refactor incrementally and safely.
- Maintain backward compatibility with existing users and tables.
- Keep performance optimized.
- Keep the UI dark themed and visually consistent with current design.

====================================================
APP CONTEXT
====================================================

AlgoRecall is a spaced repetition platform for LeetCode/DSA revision.

Current flow:
- User solves LeetCode problem
- Chrome extension pushes code to GitHub
- AlgoRecall syncs repository
- Problem gets scheduled for revisions
- Current revision intervals:
  1 → 3 → 7 → 15 → 30 days
- App tracks:
  - streak
  - XP
  - weak topics
  - revision history
  - analytics
  - overdue problems

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- React

====================================================
CURRENT MAJOR PROBLEM
====================================================

The app currently creates psychological overload.

Example:
- User already solved 85 LeetCode problems over past months
- User joins AlgoRecall today
- First GitHub sync imports all 85 problems
- App immediately schedules all 85 as “due today”
- Next day they become “1 day overdue”
- User feels stress and guilt
- Dashboard becomes demotivating
- Spaced repetition becomes task debt instead of intelligent learning

This is BAD UX.

The system currently treats:
- old imported problems
- newly solved problems
- current learning topic problems

ALL equally.

This must be redesigned.

====================================================
PRIMARY PRODUCT GOAL
====================================================

The app should optimize for:

CONSISTENCY > COMPLETION

The app must feel like:
- an intelligent DSA coach
NOT:
- a punishment/task debt tracker

====================================================
WHAT NEEDS TO BE IMPLEMENTED
====================================================

Implement the following features carefully and incrementally.

====================================================
1. HISTORICAL IMPORT PROTECTION
====================================================

CRITICAL REQUIREMENT:

When a user syncs for the FIRST TIME:
- historical imported problems must NOT immediately become due.

Instead:
- mark them as “dormant” or “backlog”
- do not activate all at once
- do not show huge overdue counts

Desired behavior:
- user syncs 85 old problems
- app says:
  “Imported 85 historical problems”
- only small manageable subset becomes active daily

IMPLEMENTATION REQUIREMENTS:
- preserve existing revision scheduling logic
- only modify first-time import behavior
- no breaking changes

====================================================
2. ADD PROBLEM STATES
====================================================

Introduce safe extensible problem states.

Suggested states:
- learning
- active
- dormant
- archived

Behavior:
- new problems solved recently → active/learning
- old imported problems → dormant
- inactive old problems → archived

DO NOT overcomplicate schema.

Provide:
- migration strategy
- backward compatibility
- safe default values

====================================================
3. DAILY ACTIVATION QUEUE
====================================================

Implement controlled backlog activation.

Example:
Every day:
- activate only 2–5 dormant problems
- based on:
  - topic weakness
  - recency
  - importance
  - difficulty

Purpose:
- avoid cognitive overload
- smooth backlog recovery

IMPORTANT:
- make this configurable
- user can set:
  “Daily backlog activation limit”

====================================================
4. DAILY REVISION CAP
====================================================

Add configurable daily revision limit.

Example:
User sets:
- 5 revisions/day
or
- 8 revisions/day

The app intelligently selects best revisions.

NEVER:
- flood dashboard with 80+ problems

Instead:
show:
- “Today’s Focus Queue”
- “Backlog Waiting”

NOT:
- “83 overdue”

====================================================
5. REPLACE OVERDUE PSYCHOLOGY
====================================================

Current wording is stressful.

REMOVE or heavily reduce:
- “83 overdue”
- red danger UI overload

REPLACE WITH:
- Focus Queue
- Backlog Pool
- Suggested Reviews
- Recently Neglected
- Weak Topics

The app should motivate, not punish.

====================================================
6. PRIORITY-BASED REVISION SYSTEM
====================================================

Implement weighted revision prioritization.

Priority should consider:
- current learning topic
- weak topics
- overdue amount
- difficulty
- recent activity
- confidence history

Example pseudo formula:

priority =
(topic_focus_weight * 5)
+ (weakness_weight * 4)
+ (difficulty_weight * 2)
+ (days_overdue * 1)

Goal:
Current learning topics matter MORE than ancient backlog.

====================================================
7. CURRENT FOCUS TRACK / LEARNING MODE
====================================================

Add concept of:
“Current Learning Topic”

Example:
- Binary Search
- Graphs
- DP

Behavior:
- prioritize revisions from current topic
- boost related problems
- improve mastery tracking

Possible UI:
“Current Focus: Binary Search”

====================================================
8. QUICK RECALL VS FULL SOLVE
====================================================

Introduce two revision modes.

A. Quick Recall
- read intuition
- mentally recall pattern
- review code quickly
- 1–2 minutes

B. Full Solve
- solve from scratch

Reason:
10 full re-solves/day is unrealistic.

System should intelligently mix:
- few full solves
- several quick recalls

====================================================
9. FORGOTTEN PROBLEM HANDLING
====================================================

If a problem hasn’t been revised for very long:
- don’t show massive overdue count

Instead:
mark:
- “Probably Forgotten”

Then:
- restart lighter revision cycle
- reset intervals gradually

====================================================
10. SAFE DATABASE MIGRATION PLAN
====================================================

Provide:
- SQL migration plan
- schema updates
- indexes if needed
- rollback-safe strategy

DO NOT:
- destroy existing data
- reset schedules
- lose revision history

====================================================
11. UI/UX REQUIREMENTS
====================================================

Keep:
- existing dark theme
- existing dashboard style
- current visual identity

Improve:
- psychological comfort
- clarity
- focus
- calmness

Dashboard should feel:
- manageable
- intelligent
- encouraging

NOT:
- anxiety-inducing

====================================================
12. REQUIRED OUTPUT FORMAT
====================================================

I want a COMPLETE implementation plan including:

1. Architecture changes
2. Database schema updates
3. Migration strategy
4. Scheduler redesign
5. Backward compatibility plan
6. Supabase-safe implementation
7. API changes
8. UI redesign recommendations
9. Component-level breakdown
10. Edge cases
11. Performance considerations
12. State management updates
13. Incremental rollout strategy
14. Testing strategy
15. Exact code structure suggestions
16. Suggested TypeScript interfaces
17. Suggested SQL schemas
18. Revision priority algorithm
19. Daily queue algorithm
20. UX copy recommendations
21. Production-safe rollout steps

IMPORTANT:
Do NOT give generic advice.

Give:
- real production-grade architecture
- detailed implementation plan
- exact technical suggestions
- scalable approach
- psychologically optimized UX decisions

Assume this app may eventually scale to:
- thousands of users
- 10k+ synced problems
- advanced analytics
- AI-powered revision recommendations

Optimize for:
- maintainability
- scalability
- low cognitive overload
- long-term retention
- excellent developer experience

DO NOT simplify the answer.
Be extremely detailed.