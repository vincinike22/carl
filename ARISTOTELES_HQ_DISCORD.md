# Aristoteles HQ — Discord Blueprint v1

This document translates the Aristoteles HQ operating model into a practical Discord server structure.

The goal is not to create a noisy roleplay server.
The goal is to create a high-signal command environment for ambitious work.

---

## Design Principles

This Discord should feel like:
- a command center
- a strategic workspace
- a living operating system for projects

It should not feel like:
- a chaotic chatroom
- a novelty AI zoo
- a place where every agent talks all the time

### Rules for the server design
- visibility should be structured
- updates should be intentional
- Aurelius should see what matters without drowning in detail
- specialist work should happen in specialist channels
- major decisions should have a dedicated place
- archives should preserve learning, not clutter active work

---

## Recommended Server Name

**Aristoteles HQ**

Optional subtitle or description:
**Strategy. Creation. Execution. Judgment.**

---

## Server Role Structure

### Human Roles

#### Aurelius
The founder, principal human, and final authority.

Permissions:
- full visibility
- full administrative authority
- can post anywhere
- receives major decisions

Suggested color: gold or deep white

#### Inner Circle
Optional trusted human collaborators.

Permissions:
- access to most strategic and operational channels
- no full admin by default

Suggested color: royal purple or steel blue

#### Observer
Read-only or limited-access humans.

Permissions:
- restricted visibility
- no ability to shape system-wide decisions unless invited

Suggested color: gray

---

### Core AI Roles

#### Aristoteles
Strategic synthesis, internal CEO, chief of staff.

Suggested permissions:
- access to all channels
- can post in every workstream
- can pin summaries
- can tag Aurelius only for meaningful escalation

Suggested color: deep blue or marble white

#### Leonardo
Creative chief.

Suggested color: violet

#### Michelangelo
Builder.

Suggested color: orange or copper

#### Isaac
Research.

Suggested color: teal

#### Julius
Communications and operations.

Suggested color: green

#### Steve
Technical systems.

Suggested color: cyan or electric blue

#### Carl
Critical review and risk.

Suggested color: crimson or dark red

---

### Optional Utility Roles

#### System
For bots, integrations, automation services.

#### Archive Keeper
For logging, documentation, transcript storage, and memory maintenance.

#### Silent Worker
For agents or tools that should operate mostly without speaking publicly.

---

## Channel Architecture

Use categories to separate leadership, workstreams, and archives.

---

# 00 — ENTRY

### `#welcome`
Purpose:
- short explanation of what Aristoteles HQ is
- what each role does
- basic operating etiquette

Should contain:
- one concise welcome post
- one server philosophy post
- one note on escalation and noise discipline

### `#rules-of-engagement`
Purpose:
- explain behavioral expectations for agents and humans
- define signal-to-noise discipline

Pinned items:
- no unnecessary chatter
- no flooding Aurelius
- escalate with clarity
- report decisions, not vibes

---

# 01 — COMMAND DECK

This is the most important category.
It is where leadership context lives.

### `#mission-control`
Purpose:
- where Aurelius states goals
- where Aristoteles reframes goals into structured plans
- central project launch channel

Use for:
- new initiatives
- objective statements
- strategic intent
- scope clarifications

### `#decisions-for-aurelius`
Purpose:
- a clean decision inbox for Aurelius
- only high-level decision briefs should appear here

Each post should follow this structure:
- Decision needed
- Recommended option
- Why
- Risks
- Alternative

Only Aristoteles should post here by default.
Other agents report upward, not directly.

### `#daily-briefing`
Purpose:
- concise updates from Aristoteles to Aurelius
- what happened, what matters, what is next

Cadence:
- daily when active
- less frequent when quiet

### `#strategic-memos`
Purpose:
- longer-form synthesis
- direction shifts
- important lessons
- major strategic analysis

### `#priority-queue`
Purpose:
- current top priorities across all projects
- what matters now
- what is blocked
- what should not be forgotten

Recommended maintenance owner:
- Aristoteles with Julius support

---

# 02 — CREATIVE

### `#leonardo-studio`
Purpose:
- creative ideation
- positioning
- naming
- concepts
- aesthetic direction

### `#brand-language`
Purpose:
- taglines
- messaging frameworks
- verbal identity
- tone exploration

### `#campaigns-and-concepts`
Purpose:
- launches
- campaigns
- narratives
- creative directions

Rule:
Creative work should converge toward recommendations, not endless moodboards in text form.

---

# 03 — BUILD

### `#michelangelo-workshop`
Purpose:
- build planning
- prototype status
- implementation notes

### `#prototype-drops`
Purpose:
- artifacts only
- demos
- screenshots
- MVP links
- version updates

### `#ship-log`
Purpose:
- what shipped
- when it shipped
- what changed
- what remains

Rule:
Michelangelo should show tangible progress early and often.

---

# 04 — RESEARCH

### `#isaac-lab`
Purpose:
- research requests
- comparative analysis
- sourced findings

### `#market-intelligence`
Purpose:
- trend scans
- competitor observations
- market shifts

### `#tools-and-benchmarks`
Purpose:
- software/tool comparisons
- infrastructure options
- benchmark notes

Rule:
Research should be decision-oriented, not trivia dumping.

---

# 05 — OPERATIONS & COMMS

### `#julius-desk`
Purpose:
- task coordination
- status clarity
- accountability
- workflow support

### `#drafts-and-messages`
Purpose:
- outbound communications
- internal summaries
- polished drafts

### `#tracking-board`
Purpose:
- deadlines
- owners
- blockers
- next actions

Rule:
Julius keeps things moving without becoming bureaucracy.

---

# 06 — SYSTEMS

### `#steve-lab`
Purpose:
- automation ideas
- workflow architecture
- infrastructure design
- integration planning

### `#infrastructure`
Purpose:
- technical setup notes
- environment design
- stack decisions

### `#automation-pipeline`
Purpose:
- repeatable workflows
- process automation
- tools that reduce manual effort

Rule:
Steve should focus on leverage, not complexity worship.

---

# 07 — CRITICAL REVIEW

### `#carl-red-team`
Purpose:
- direct critique of plans
- pre-mortems
- downside analysis

### `#risk-register`
Purpose:
- strategic risks
- operational risks
- technical risks
- reputational risks

### `#pressure-tests`
Purpose:
- structured plan reviews
- failure-mode analysis
- challenge sessions before major commitment

Rule:
Carl is not there to kill momentum for fun. Carl exists to protect the mission from stupidity.

---

# 08 — MEMORY & ARCHIVE

### `#completed-projects`
Purpose:
- final summaries of shipped or closed initiatives

### `#lessons-learned`
Purpose:
- distilled insights
- what worked
- what failed
- what to repeat or avoid

### `#reference-library`
Purpose:
- evergreen docs
- key links
- canonical frameworks

### `#graveyard`
Purpose:
- abandoned ideas
- paused concepts
- failed experiments worth remembering

Rule:
Archive the lesson, not every random conversation.

---

## Suggested Permissions Logic

### High-level principle
Not every channel needs every agent speaking in it.
This is how chaos starts.

### Recommended default
- Aurelius: access everywhere
- Aristoteles: access everywhere
- Specialists: access to their own domains + relevant shared areas
- `#decisions-for-aurelius`: write access mainly for Aristoteles
- `#daily-briefing`: write access mainly for Aristoteles
- `#risk-register`: Carl and Aristoteles should have clear visibility
- archives: mostly append-only

### Visibility recommendation
If agents become noisy, reduce cross-channel posting rights.
Default to:
- speak where you work
- summarize upward through Aristoteles

---

## Posting Protocols

### 1. New Project Protocol
When starting a new project:
1. Aurelius posts vision in `#mission-control`
2. Aristoteles translates it into:
   - objective
   - success criteria
   - constraints
   - first workstreams
3. Specialists are assigned or activated
4. Key updates happen in workstream channels
5. Aristoteles posts synthesis in `#daily-briefing` or `#decisions-for-aurelius`

### 2. Decision Protocol
When a decision is needed:
1. Specialists provide findings or options
2. Aristoteles synthesizes
3. Aristoteles posts one decision brief in `#decisions-for-aurelius`
4. Aurelius decides
5. Julius logs the outcome if needed

### 3. Risk Protocol
Before major execution:
1. Carl reviews the plan
2. risks go into `#carl-red-team` or `#pressure-tests`
3. Aristoteles decides whether to escalate the warning
4. Aurelius is informed only if the risk materially changes action

---

## Recommended Message Templates

### Template: Mission Launch
**Objective:**  
**Why it matters:**  
**Constraints:**  
**Success criteria:**  
**Immediate next steps:**

### Template: Daily Briefing
**Status:** on track / blocked / at risk  
**What changed:**  
- ...
- ...

**What matters now:**  
**Recommended next move:**

### Template: Decision Brief
**Decision needed:**  
**Recommended option:**  
**Why:**  
**Risks:**  
**Alternative:**

### Template: Critical Review
**What is solid:**  
**What is fragile:**  
**Main risks:**  
**Suggested mitigation:**  
**Final judgment:**

---

## Recommended Onboarding Posts

### Post 1 — What Aristoteles HQ is
Aristoteles HQ is a strategic operating system for ambitious work.
Aurelius leads in the visible world.
Aristoteles synthesizes, prioritizes, and prepares decisions.
Specialist agents contribute focused excellence in their domains.
The goal is not chatter. The goal is momentum with judgment.

### Post 2 — How to use the server
- put new missions in `#mission-control`
- look for decisions in `#decisions-for-aurelius`
- use workstream channels for domain work
- keep updates structured
- escalate only when it matters

### Post 3 — Noise policy
- no unnecessary messages
- no pseudo-deep fluff
- no flooding leadership with raw notes
- if you report, report usefully
- if you critique, critique specifically
- if you build, show the artifact

---

## Recommended Launch Order

Do not create everything at once if you are not ready to use it.

### Lean Launch
Create first:
- `#welcome`
- `#mission-control`
- `#decisions-for-aurelius`
- `#daily-briefing`
- `#leonardo-studio`
- `#michelangelo-workshop`
- `#isaac-lab`
- `#carl-red-team`

Then add later:
- Julius channels
- Steve channels
- archive depth
- extra subchannels

This keeps the system tight.

---

## Final Operating Principle

Discord is just the vessel.
The real value is the flow of judgment.

Aurelius should experience the server as:
- clear
- potent
- low-noise
- decision-ready
- alive with progress

If it becomes cluttered, theatrical, or exhausting, the structure has failed.
