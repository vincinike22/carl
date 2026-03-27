# Hackathon setup preservation note

Date: 2026-03-27
Context: Aurelius is dismantling the home setup to rebuild it at a 24h hackathon and asked to save everything so nothing gets lost.

Preserve before teardown:
- Current OpenClaw workspace files and notes
- Identity/persona files: IDENTITY.md, SOUL.md, USER.md, AGENTS.md
- Tool/setup notes: TOOLS.md, HEARTBEAT.md
- Memory notes under memory/
- Any local config/artifacts currently present in workspace, including .openclaw/

Intent:
- Use this commit as a restore point before physical teardown and transport.
- On rebuild, start by checking git status/log and reviewing this note.
