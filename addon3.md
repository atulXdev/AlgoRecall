You are a senior staff engineer, cognitive learning systems architect, scalable backend designer, and UX psychologist.

Your task is to perform a FINAL production-grade refinement pass on my existing DSA spaced repetition platform “AlgoRecall”.

IMPORTANT:
This is NOT a rewrite.
This is a precision architecture refinement and intelligence upgrade.

====================================================
CRITICAL NON-NEGOTIABLE RULES
=============================

DO NOT:

* rewrite the app from scratch
* remove existing features
* break existing revision history
* break GitHub sync
* break XP/streak systems
* break auth
* break Supabase compatibility
* break current dashboard UX
* reset user progress
* create unnecessary complexity
* introduce unstable architecture
* over-engineer microservices
* regress psychological improvements

PRESERVE:

* current dark theme
* current UI identity
* existing APIs wherever possible
* current production-safe flows
* existing migrations
* current queue logic as baseline
* backward compatibility

All changes MUST:

* be incremental
* rollback-safe
* scalable
* composable
* maintainable
* psychologically optimized
* production-grade

====================================================
CURRENT SYSTEM STATUS
=====================

Already implemented:
✅ Dormant historical imports
✅ Focus Queue
✅ Daily revision cap
✅ Current focus topic
✅ Quick Recall vs Full Solve
✅ Confidence-based revisions
✅ Memory strength system
✅ Problem health states
✅ Pattern tagging support
✅ Psychological dashboard redesign
✅ Adaptive scheduling foundation
✅ XP/streak systems
✅ Topic mastery
✅ Weak topic analytics
✅ Supabase migrations
✅ SM-2 derived engine
✅ Health-based UX

Current stack:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Supabase PostgreSQL

====================================================
PRIMARY GOAL
============

Upgrade AlgoRecall from:
“Very good revision app”

into:
“Elite adaptive interview prep memory operating system”

The platform should feel:

* intelligent
* calm
* adaptive
* psychologically safe
* scientifically believable
* deeply personalized

NOT:

* stressful
* gameable
* metric-inflated
* task-debt-driven

====================================================
CRITICAL ARCHITECTURE PROBLEMS TO FIX
=====================================

The following issues MUST be solved comprehensively.

====================================================

1. SEPARATE MEMORY FROM DIFFICULTY
   ====================================================

CRITICAL ISSUE:
Currently memory_strength may incorrectly penalize difficult problems.

Example:
Hard DP problems naturally produce lower confidence.

That does NOT mean weak memory.

IMPLEMENT:
Separate cognitive complexity from memory strength.

Add:

```ts
cognitive_complexity: number
```

Suggested scale:
1–10

Purpose:

* represent inherent difficulty
* independent from user memory

Scheduling MUST consider BOTH:

* memory_strength
* cognitive_complexity

Need:

* exact formulas
* migration strategy
* UI usage
* scheduling adjustments
* analytics integration

====================================================
2. ANTI-GAMING / ANTI-CHEESE SYSTEM
===================================

CRITICAL ISSUE:
Users can spam Quick Recall to inflate:

* XP
* streaks
* memory strength

Implement:
diminishing returns system.

Requirements:

* repeated quick recalls reduce gains
* repeated low-effort revisions produce lower XP
* repeated shallow reviews reduce memory gain
* detect spam patterns
* preserve legitimate use

Need:

* anti-cheese heuristics
* cooldown logic
* rolling revision windows
* XP decay formulas
* queue adjustment penalties

====================================================
3. RECALL STABILITY TRACKING
============================

Current system may overweight latest revision.

Need:
rolling memory stability.

Example:
Recent history:

* Perfect
* Perfect
* Forgot
* Partial
* Perfect

This indicates unstable memory.

Implement:

```ts
recall_stability_score
```

Purpose:

* measure consistency of recall
* detect fragile memory
* influence resurfacing frequency

Need:

* rolling window formulas
* weighted history calculations
* scheduling integration
* dashboard integration

====================================================
4. PATTERN MASTERY SYSTEM
=========================

CRITICAL FEATURE.

Currently:
problem-level memory exists.

Need:
pattern-level mastery intelligence.

Example:
If user solves:

* Aggressive Cows
* Allocate Books
* Split Array Largest Sum

System infers:
Binary Search on Answer mastery improving.

Implement:

```ts
pattern_mastery_score
```

Separate from:
problem memory.

Requirements:

* aggregate mastery from multiple problems
* pattern confidence estimation
* pattern transfer detection
* weak pattern analytics
* resurfacing based on patterns
* future AI extensibility

Need:

* schema design
* aggregation logic
* queue integration
* mastery thresholds

====================================================
5. QUEUE BALANCING SYSTEM
=========================

Current danger:
queue may over-focus weak areas.

Need balanced queue composition.

Required queue distribution:

* 40% current topic reinforcement
* 30% weak recovery
* 20% stabilization reviews
* 10% random resurfacing

Queue should avoid:

* tunnel vision
* burnout
* repetitive topic fatigue

Need:

* exact balancing algorithm
* weighted queue generation
* fallback handling
* session balancing

====================================================
6. RANDOM RESURFACING SYSTEM
============================

Implement intelligent random resurfacing.

Purpose:

* prevent illusion of permanent mastery
* improve long-term retention
* maintain breadth

Example:
“You haven’t seen Union Find in 74 days.”

Requirements:

* randomness with intelligence
* avoid overload
* respect current cognitive load
* low frequency
* psychologically friendly resurfacing

Need:

* scheduling rules
* resurfacing probability formulas
* cooldowns

====================================================
7. TIME-TO-RECALL TRACKING
==========================

IMPORTANT FEATURE.

Track:
how quickly user remembered.

Fast recall = stronger memory.
Slow recall = fragile memory.

Implement:

```ts
recall_latency_ms
```

Need:

* timing capture architecture
* frontend instrumentation
* scheduling integration
* memory score adjustments
* UX recommendations

====================================================
8. COGNITIVE LOAD ESTIMATION
============================

Dashboard must estimate:
mental workload.

Examples:

* Light Day
* Medium Day
* Deep Focus Day

Display:

* estimated time
* expected difficulty
* mental load

Purpose:
reduce subconscious anxiety.

Need:

* cognitive load formulas
* session complexity scoring
* UI components
* queue estimation logic

====================================================
9. RECOVERY MODE SYSTEM
=======================

CRITICAL PSYCHOLOGY FEATURE.

If user misses:
3–7 days

DO NOT:
dump giant backlog.

Instead:
activate Recovery Mode.

Behavior:

* reduced queue
* lighter sessions
* motivational UX
* backlog shielding

Need:

* burnout detection
* inactivity heuristics
* adaptive queue reduction
* recovery scheduling logic
* recovery XP balancing

====================================================
10. DERIVED ANALYTICS TABLES
============================

CRITICAL SCALABILITY FIX.

Current danger:
expensive live calculations.

Need precomputed summaries.

Implement derived tables:

* user_memory_summary
* pattern_mastery_summary
* daily_retention_snapshot
* queue_cache
* user_behavior_metrics

Need:

* cron architecture
* incremental aggregation
* Supabase optimization
* indexing strategy
* invalidation rules

====================================================
11. MEMORY DECAY SIMULATION
===========================

Implement passive decay system.

Memory strength should naturally decay over time.

Purpose:
make memory system realistic.

Requirements:

* nightly decay jobs
* topic-specific decay coefficients
* decay floors
* inactivity penalties
* mastery protection

Need:

* decay formulas
* cron strategy
* optimization plan

====================================================
12. LEARNING VELOCITY SYSTEM
============================

Track:
how quickly user stabilizes patterns.

Implement:

```ts
learning_velocity_score
```

Purpose:

* adaptive scheduling
* interview readiness estimation
* learning analytics
* personalization

Need:

* scoring formulas
* trend tracking
* dashboard integration

====================================================
13. MOMENTUM SYSTEM
===================

Current systems focus too much on weakness.

Need:
positive reinforcement layer.

Examples:

* “Binary Search momentum rising”
* “DP recovery improving”
* “Sliding Window stabilized”

Need:

* momentum calculations
* positive trend detection
* dashboard cards
* motivational UX copy

====================================================
14. PATTERN DEPENDENCY GRAPH
============================

ADVANCED LEARNING FEATURE.

Implement dependency relationships between patterns.

Examples:
DP on Subsequences depends on:

* recursion
* memoization
* subset transitions

Purpose:

* intelligent learning paths
* weak prerequisite detection
* personalized recommendations

Need:

* graph schema
* dependency traversal
* prerequisite scoring
* recommendation engine

====================================================
15. MANUAL FREEZE / PAUSE MODE
==============================

Implement safe pause system.

Examples:

* exams
* burnout
* vacations

Features:

* pause memory decay
* pause streak penalties
* reduce notifications
* preserve user psychology

Need:

* pause scheduling
* streak handling
* decay suspension
* recovery re-entry flow

====================================================
16. PERFORMANCE + SCALABILITY REQUIREMENTS
==========================================

Optimize for:

* thousands of users
* 100k+ problems
* heavy analytics
* future AI features

Need:

* query optimization
* indexes
* caching
* materialized summaries
* pagination
* lazy loading
* cron batching
* edge function recommendations

====================================================
17. UX + PSYCHOLOGY REQUIREMENTS
================================

The app must feel:

* calm
* intelligent
* forgiving
* adaptive
* motivating

Avoid:

* guilt
* impossible workloads
* anxiety
* noisy metrics
* manipulative gamification

Encourage:

* consistency
* deep recall
* sustainable habits
* pattern intuition
* interview confidence

====================================================
18. REQUIRED OUTPUT FORMAT
==========================

Provide EXTREMELY detailed production-grade guidance including:

1. Database schema updates
2. Exact SQL migrations
3. TypeScript interfaces
4. Scheduling engine redesign
5. Queue balancing algorithms
6. Memory formulas
7. Decay formulas
8. Stability formulas
9. Anti-cheese systems
10. Pattern mastery logic
11. Derived analytics architecture
12. Cron design
13. API changes
14. Dashboard redesign suggestions
15. Component-level architecture
16. Edge case handling
17. Rollback-safe migration strategy
18. Testing strategy
19. Scaling considerations
20. Future AI extensibility
21. Incremental rollout strategy

DO NOT give generic advice.

Provide real production-grade system architecture and implementation guidance suitable for a scalable long-term SaaS platform.
