# Exact Next-Step Instructions

## If provisioning manually in Discord
1. Create the server name: `Aristoteles HQ`
2. Create the 8 roles from `server-blueprint.md`
3. Assign the `Aurelius` role to user ID `1486456550934577343`
4. Create the 8 channels from `server-blueprint.md`
5. Set permissions exactly as described in the blueprint
6. Post `onboarding/welcome-message.md` into `welcome`
7. Post `onboarding/usage-message.md` into `welcome` or pin it in `mission-control`
8. Pin `ops/daily-brief-template.md` in `daily-briefing`
9. Pin `ops/decision-brief-template.md` in `decisions-for-aurelius`
10. Use `agents/*.md` as the prompt/config source for each agent identity

## Minimal v1 activation
Start with these active agents:
- Aristoteles
- Isaac
- Michelangelo
- Carl

Add Leonardo, Julius, and Steve once traffic justifies them.

## Low-noise v1 recommendation
- `daily-briefing`: 1 post/day max unless urgent
- `decisions-for-aurelius`: only when an actual founder decision exists
- specialist channels: work there, do not duplicate the same update in HQ channels

## Security note
Do not leave raw bot tokens in shared docs or public channels. Rotate the Discord bot token if it has been pasted into any chat or transcript.
