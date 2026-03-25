# Scripts

## provision-discord.js
Creates roles, categories, channels, starter content, and writes a local provisioning log.

## refine-permissions.js
Tightens posting permissions so lane ownership is clearer and founder-facing channels stay quieter.

## pin-starter-docs.js
Posts and pins the operating documents and templates in key channels.

## Usage
```bash
cd ~/.openclaw/workspace/aristoteles-hq-v2
export DISCORD_BOT_TOKEN="YOUR_VALID_TOKEN"
node scripts/refine-permissions.js
node scripts/pin-starter-docs.js
```
