import { ChannelType, Client, GatewayIntentBits, OverwriteType, PermissionFlagsBits } from 'discord.js';

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID || '1486463776323797142';
if (!token) {
  console.error('Missing DISCORD_BOT_TOKEN');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const specialistOwner = {
  'leonardo-studio': 'Leonardo',
  'brand-language': 'Leonardo',
  'campaigns-and-concepts': 'Leonardo',
  'michelangelo-workshop': 'Michelangelo',
  'prototype-drops': 'Michelangelo',
  'ship-log': 'Michelangelo',
  'isaac-lab': 'Isaac',
  'market-intelligence': 'Isaac',
  'tools-and-benchmarks': 'Isaac',
  'julius-desk': 'Julius',
  'drafts-and-messages': 'Julius',
  'tracking-board': 'Julius',
  'steve-lab': 'Steve',
  'infrastructure': 'Steve',
  'automation-pipeline': 'Steve',
  'carl-red-team': 'Carl',
  'risk-register': 'Carl',
  'pressure-tests': 'Carl',
};

function makeShared(guild, rolesByName, writableRoles) {
  const roles = ['Aurelius', 'Aristoteles', 'Leonardo', 'Michelangelo', 'Isaac', 'Julius', 'Steve', 'Carl', 'Inner Circle', 'Observer', 'System', 'Archive Keeper', 'Silent Worker'];
  const out = [{ id: guild.roles.everyone.id, deny: [PermissionFlagsBits.SendMessages], type: OverwriteType.Role }];
  for (const name of roles) {
    const role = rolesByName.get(name);
    if (!role) continue;
    const allow = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory];
    if (writableRoles.includes(name)) allow.push(PermissionFlagsBits.SendMessages);
    out.push({ id: role.id, allow, type: OverwriteType.Role });
  }
  return out;
}

client.once('ready', async () => {
  const guild = await client.guilds.fetch(guildId);
  await guild.channels.fetch();
  await guild.roles.fetch();
  const rolesByName = new Map(guild.roles.cache.map(r => [r.name, r]));

  for (const channel of guild.channels.cache.values()) {
    if (channel.type !== ChannelType.GuildText) continue;

    let overwrites;
    if (channel.name === 'mission-control' || channel.name === 'priority-queue' || channel.name === 'strategic-memos') {
      overwrites = makeShared(guild, rolesByName, ['Aurelius', 'Aristoteles', 'Leonardo', 'Michelangelo', 'Isaac', 'Julius', 'Steve', 'Carl']);
    } else if (channel.name === 'decisions-for-aurelius' || channel.name === 'daily-briefing') {
      overwrites = makeShared(guild, rolesByName, ['Aurelius', 'Aristoteles']);
    } else if (['completed-projects', 'lessons-learned', 'reference-library', 'graveyard'].includes(channel.name)) {
      overwrites = makeShared(guild, rolesByName, ['Aurelius', 'Aristoteles', 'Archive Keeper']);
    } else if (specialistOwner[channel.name]) {
      overwrites = makeShared(guild, rolesByName, ['Aurelius', 'Aristoteles', specialistOwner[channel.name]]);
    } else if (channel.name === 'welcome' || channel.name === 'rules-of-engagement') {
      overwrites = makeShared(guild, rolesByName, ['Aurelius', 'Aristoteles', 'System']);
    }

    if (overwrites) {
      await channel.edit({ permissionOverwrites: overwrites });
      console.log(`refined #${channel.name}`);
    }
  }

  client.destroy();
});

client.login(token);
