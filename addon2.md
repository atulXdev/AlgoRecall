You are a senior staff engineer, learning systems architect, cognitive UX expert, and scalable product designer.

Your task is to upgrade my existing production-ready DSA spaced repetition platform “AlgoRecall” into a psychologically optimized, memory-state-driven intelligent learning system.

IMPORTANT RULES:

* DO NOT rewrite the app from scratch.
* DO NOT break existing functionality.
* DO NOT remove existing features.
* DO NOT reset user progress.
* DO NOT break GitHub sync.
* DO NOT break streaks, XP, revision logs, analytics, auth, or scheduling.
* Maintain full backward compatibility.
* Keep migrations safe and incremental.
* Keep Supabase compatibility.
* Preserve current dark theme and visual identity.
* Optimize for scalability and maintainability.
* Prefer incremental architecture evolution over massive rewrites.

====================================================
CURRENT APP CONTEXT
===================

AlgoRecall is a DSA + LeetCode revision platform.

Current stack:

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* Supabase PostgreSQL

Current features already implemented:

* GitHub sync engine
* LeetCode repository parsing
* Auto revision scheduling
* Dormant historical imports
* Focus Queue instead of Overdue
* Daily revision cap
* Current Focus Topic
* Quick Recall vs Full Solve
* Topic mastery
* XP and streaks
* Revision logs
* SM-2 inspired scheduling
* Weak topic tracking
* Dashboard analytics

Current revision intervals:
1 → 3 → 7 → 15 → 30 days

====================================================
PRIMARY GOAL
============

Transform AlgoRecall from:

* schedule-based revision app

into:

* memory-state-driven intelligent interview prep system

The app should feel like:

* an intelligent DSA memory coach

NOT:

* a stressful task debt tracker

Optimize for:

* long-term retention
* interview readiness
* sustainable consistency
* low cognitive overload
* pattern mastery
* adaptive learning

====================================================
FEATURES TO IMPLEMENT
=====================

====================================================

1. MEMORY STRENGTH SYSTEM
   ====================================================

Introduce:
memory_strength: number

Range:
0–100

Purpose:
The system should understand how strongly a user remembers a problem instead of relying only on revision dates.

Requirements:

* scalable formula
* configurable weights
* future extensibility
* safe migration strategy

Memory strength should increase from:

* successful quick recalls
* successful full solves
* repeated successful revisions
* fast solve time
* high confidence ratings

Memory strength should decrease from:

* forgot completely
* long inactivity
* many skips
* low confidence
* slow solve time
* repeated failures

Need:

* exact formulas
* TypeScript utilities
* SQL schema changes
* migration examples
* recalculation strategies
* cron recommendations
* edge case handling

====================================================
2. CONFIDENCE-BASED REVISION FEEDBACK
=====================================

Current system only supports:

* Quick Recall
* Full Solve

Upgrade revision flow to support:

* revision mode
  PLUS
* confidence rating

Confidence options:

* Perfect Recall
* Partial Recall
* Needed Hint
* Forgot Completely

Requirements:

* confidence affects scheduling
* confidence affects memory strength
* confidence affects XP
* confidence affects health status

Need:

* exact weighting logic
* UI flow recommendations
* scheduling adjustments
* Supabase schema updates

====================================================
3. SAFER QUICK RECALL SCHEDULING
================================

IMPORTANT:
Quick Recall must not advance intervals aggressively.

Recognition ≠ mastery.

Implement:

* Quick Recall = lower interval multiplier
* Full Solve = full interval multiplier
* Forgot = partial reset

Need:

* exact interval formulas
* safe scheduling logic
* edge case handling

====================================================
4. PROBLEM HEALTH SYSTEM
========================

Introduce psychologically friendly memory health states.

Examples:

* Strong
* Fragile
* Forgotten
* Mastered
* Relearning

Purpose:
Replace stressful overdue psychology.

Health should derive from:

* memory strength
* confidence history
* inactivity
* revision consistency

Need:

* thresholds
* scoring logic
* UI badges
* colors
* dashboard integration

====================================================
5. PATTERN-LEVEL LEARNING SYSTEM
================================

Current app tracks broad topics.

Need granular pattern tracking.

Examples:

* Binary Search on Answer
* Monotonic Predicate
* Prefix Sum Hashmap
* Sliding Window Fixed
* Sliding Window Variable
* Greedy Interval
* DP State Compression
* BFS Multi Source
* Topological Sort

Requirements:

* scalable tagging system
* many-to-many relation design
* mastery calculations
* weak pattern analytics
* AI-ready future tagging architecture

Need:

* schema design
* APIs
* analytics architecture
* dashboard recommendations

====================================================
6. SESSION-BASED REVISION SYSTEM
================================

Current:
flat problem queue

Need:
session-based revisions

Examples:
Morning Session:

* 2 Binary Search
* 1 Quick Recall
* 1 Forgotten Recovery

Purpose:
Reduce overwhelm.

Requirements:

* smart grouping algorithm
* balanced difficulty
* estimated session time
* cognitive load balancing

Need:

* session generation algorithm
* UI flow
* schema recommendations

====================================================
7. ENERGY-BASED MODES
=====================

Introduce:

* Low Energy
* Normal
* Deep Focus

Behavior:
Low Energy:

* easier recalls
* lighter sessions
* fewer hard problems

Deep Focus:

* harder problems
* more full solves
* stronger reinforcement

Need:

* queue adaptation logic
* scoring changes
* UI controls
* personalization strategy

====================================================
8. ADAPTIVE DAILY LOAD SYSTEM
=============================

Current:
fixed revision limit

Need:
adaptive revision load

Examples:

* consistent users → slightly increase load
* burnout signs → reduce load
* missed streaks → recovery mode

Need:

* burnout heuristics
* consistency scoring
* load adaptation formulas
* user override support

====================================================
9. RETENTION ANALYTICS
======================

Add meaningful retention metrics:

* 7-day retention
* 30-day retention
* relearning rate
* weak patterns
* strongest patterns
* memory decay trends

Need:

* exact formulas
* dashboard widgets
* aggregation queries
* caching strategy
* Supabase optimization

====================================================
10. RELEARNING DETECTION
========================

Detect when forgotten problems become remembered again.

Example:
Recovered after decay.

Purpose:
Reduce guilt psychology.

Need:

* detection logic
* XP rewards
* badge ideas
* motivational UX copy

====================================================
11. TOPIC-SPECIFIC DECAY CURVES
===============================

Different DSA topics decay differently.

Examples:

* Arrays decay slowly
* DP decays faster
* Bitmasking decays aggressively

Need:

* configurable decay coefficients
* scheduling integration
* tuning support

====================================================
12. INTERVIEW MODE
==================

Introduce:
Interview Preparation Mode

Inputs:

* interview date
* target company
* focus topics

System prioritizes:

* high-frequency patterns
* weak areas
* medium/hard problems
* rapid reinforcement

Need:

* interview countdown logic
* urgency balancing
* queue adaptation
* UX recommendations

====================================================
13. ARCHITECTURE REQUIREMENTS
=============================

Provide:

1. DB schema updates
2. Safe SQL migrations
3. TypeScript interfaces
4. Scheduling engine redesign
5. Queue generation algorithm
6. Session generation logic
7. API changes
8. Supabase optimization
9. Cron architecture
10. Caching strategy
11. Performance considerations
12. State management strategy
13. Rollout strategy
14. Testing strategy
15. Edge cases
16. Rollback-safe migration strategy

====================================================
14. UX REQUIREMENTS
===================

The app should feel:

* calm
* adaptive
* intelligent
* forgiving
* motivating

Avoid:

* guilt
* massive overdue warnings
* impossible workloads

Encourage:

* sustainable consistency
* pattern mastery
* deep recall
* interview readiness

====================================================
15. REQUIRED OUTPUT FORMAT
==========================

Provide EXTREMELY detailed implementation guidance including:

* production architecture
* schema designs
* SQL migrations
* TypeScript models
* memory formulas
* scheduling formulas
* queue prioritization
* health scoring
* retention calculations
* dashboard redesign
* component-level breakdown
* scaling considerations
* future AI extensibility
* phased rollout plan

DO NOT give generic advice.

Provide production-grade engineering guidance suitable for a scalable real-world SaaS application.
