import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID || '1486463776323797142';
if (!token) {
  console.error('Missing DISCORD_BOT_TOKEN');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function read(rel) {
  return fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');
}

const pinMap = {
  'welcome': [read('onboarding/welcome.md'), read('onboarding/usage.md')],
  'rules-of-engagement': [read('onboarding/rules-of-engagement.md')],
  'mission-control': [read('templates/mission-launch.md'), read('ops/operating-model.md')],
  'daily-briefing': [read('templates/daily-briefing.md')],
  'decisions-for-aurelius': [read('templates/decision-brief.md')],
  'carl-red-team': [read('templates/critical-review.md')],
};

client.once('ready', async () => {
  const guild = await client.guilds.fetch(guildId);
  await guild.channels.fetch();

  for (const [name, posts] of Object.entries(pinMap)) {
    const channel = guild.channels.cache.find(ch => ch.name === name && ch.isTextBased());
    if (!channel) continue;
    for (const post of posts) {
      const msg = await channel.send(post.slice(0, 1900));
      await msg.pin();
      console.log(`pinned in #${name}`);
    }
  }

  client.destroy();
});

client.login(token);
