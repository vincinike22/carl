# Aristoteles HQ — Discord Blueprint

## Server
- Name: Aristoteles HQ
- Server ID: 1486463776323797142
- Founder user: Aurelius (`1486456550934577343`)

## Roles
Create these roles in this order:
1. `Aurelius`
2. `Aristoteles`
3. `Leonardo`
4. `Michelangelo`
5. `Isaac`
6. `Julius`
7. `Steve`
8. `Carl`

## Role intent
- `Aurelius`: founder, final approvals, sees everything
- `Aristoteles`: central strategist, synthesis, orchestration, sees everything
- Specialist roles: mostly operate in their own lanes and read shared coordination spaces

## Channel set (initial v1)
Create these text channels in this exact order:
1. `welcome`
2. `mission-control`
3. `decisions-for-aurelius`
4. `daily-briefing`
5. `leonardo-studio`
6. `michelangelo-workshop`
7. `isaac-lab`
8. `carl-red-team`

## Recommended categories
### 1) HQ
- `welcome`
- `mission-control`
- `decisions-for-aurelius`
- `daily-briefing`

### 2) Specialist Cells
- `leonardo-studio`
- `michelangelo-workshop`
- `isaac-lab`
- `carl-red-team`

## Lean permission model
Start from this baseline:
- `@everyone`: no posting anywhere except optional read access to `welcome`
- `Aurelius`: view + send + history in all channels
- `Aristoteles`: view + send + history in all channels
- Specialists: post mainly in own channel; read selected shared channels

## Exact permissions by channel

### `welcome`
Purpose: static orientation and rules.
- Aurelius: View, Send, Manage Messages
- Aristoteles: View, Send, Manage Messages
- All specialist roles: View
- @everyone: View
- Posting recommendation: only Aurelius + Aristoteles

### `mission-control`
Purpose: cross-functional coordination, requests, routing, status.
- Aurelius: View, Send
- Aristoteles: View, Send
- Leonardo / Michelangelo / Isaac / Julius / Steve / Carl: View, Send
- @everyone: No access

### `decisions-for-aurelius`
Purpose: compressed decision briefs only.
- Aurelius: View, Send
- Aristoteles: View, Send
- All specialist roles: View
- Posting recommendation: only Aristoteles by default; Aurelius can reply
- @everyone: No access

### `daily-briefing`
Purpose: one concise daily operational summary.
- Aurelius: View, Send
- Aristoteles: View, Send
- All specialist roles: View
- Posting recommendation: Aristoteles only
- @everyone: No access

### `leonardo-studio`
Purpose: creative direction, concepts, copy angles, campaigns, idea generation.
- Aurelius: View, Send
- Aristoteles: View, Send
- Leonardo: View, Send
- Other specialists: View only
- @everyone: No access

### `michelangelo-workshop`
Purpose: building, shipping, implementation, deliverables.
- Aurelius: View, Send
- Aristoteles: View, Send
- Michelangelo: View, Send
- Other specialists: View only
- @everyone: No access

### `isaac-lab`
Purpose: research, evidence, market scans, validation.
- Aurelius: View, Send
- Aristoteles: View, Send
- Isaac: View, Send
- Other specialists: View only
- @everyone: No access

### `carl-red-team`
Purpose: criticism, failure modes, contradictions, downside analysis.
- Aurelius: View, Send
- Aristoteles: View, Send
- Carl: View, Send
- Other specialists: View only
- @everyone: No access

## Operating rule
Every specialist channel feeds upward into `mission-control`, then Aristoteles compresses what matters into:
- `decisions-for-aurelius`
- `daily-briefing`

## Minimal moderation rules
- No chatter for its own sake
- One issue per message thread when possible
- Summaries beat long back-and-forth
- Escalate decisions, not raw noise
- If a message does not change action, decision, or clarity, it probably should not be posted
