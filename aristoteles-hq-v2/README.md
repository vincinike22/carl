# Aristoteles HQ v2

Complete Discord-based multi-agent operating system package for Aurelius.

## Outcome
This package is designed to do two things:
1. define the full operating model, prompts, and server structure
2. provide a runnable provisioning script for Discord server setup

## Included
- full Discord blueprint
- role and channel plan
- onboarding copy
- operating model
- agent prompts
- reusable templates
- Node provisioning script for Discord

## Important
The provisioning script can create channels and roles on a Discord server where the bot has the required permissions. It cannot assign the `Aurelius` role to a human user unless the bot has sufficient role hierarchy and permissions.

## Quick run
From this folder:
```bash
npm install
export DISCORD_BOT_TOKEN="YOUR_TOKEN"
node scripts/provision-discord.js
```

Optional env vars:
```bash
export DISCORD_GUILD_ID="1486463776323797142"
export AURELIUS_USER_ID="1486456550934577343"
```

## Recommended operating principle
Aristoteles is the synthesis layer. Specialists work in lanes. Aurelius gets compressed signal, not chatter.
