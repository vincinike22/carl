import {
  ChannelType,
  Client,
  GatewayIntentBits,
  OverwriteType,
  PermissionFlagsBits,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID || '1486463776323797142';
const aureliusUserId = process.env.AURELIUS_USER_ID || '1486456550934577343';

if (!token) {
  console.error('Missing DISCORD_BOT_TOKEN');
  process.exit(1);
}

const spec = {
  roles: [
    'Aurelius',
    'Aristoteles',
    'Leonardo',
    'Michelangelo',
    'Isaac',
    'Julius',
    'Steve',
    'Carl',
    'Inner Circle',
    'Observer',
    'System',
    'Archive Keeper',
    'Silent Worker',
  ],
  categories: [
    { name: 'ENTRY', channels: ['welcome', 'rules-of-engagement'] },
    { name: 'COMMAND DECK', channels: ['mission-control', 'decisions-for-aurelius', 'daily-briefing', 'strategic-memos', 'priority-queue'] },
    { name: 'CREATIVE', channels: ['leonardo-studio', 'brand-language', 'campaigns-and-concepts'] },
    { name: 'BUILD', channels: ['michelangelo-workshop', 'prototype-drops', 'ship-log'] },
    { name: 'RESEARCH', channels: ['isaac-lab', 'market-intelligence', 'tools-and-benchmarks'] },
    { name: 'OPS_AND_COMMS', channels: ['julius-desk', 'drafts-and-messages', 'tracking-board'] },
    { name: 'SYSTEMS', channels: ['steve-lab', 'infrastructure', 'automation-pipeline'] },
    { name: 'CRITICAL_REVIEW', channels: ['carl-red-team', 'risk-register', 'pressure-tests'] },
    { name: 'MEMORY_AND_ARCHIVE', channels: ['completed-projects', 'lessons-learned', 'reference-library', 'graveyard'] },
  ],
};

const roleColors = {
  Aurelius: 0xf1c40f,
  Aristoteles: 0x5865f2,
  Leonardo: 0xe67e22,
  Michelangelo: 0x2ecc71,
  Isaac: 0x3498db,
  Julius: 0x9b59b6,
  Steve: 0x1abc9c,
  Carl: 0xe74c3c,
  'Inner Circle': 0x95a5a6,
  Observer: 0x7f8c8d,
  System: 0x34495e,
  'Archive Keeper': 0x8e44ad,
  'Silent Worker': 0x2c3e50,
};

const specialistLane = {
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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function loadFile(rel) {
  return fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');
}

function channelTopic(name) {
  const topics = {
    'welcome': 'What Aristoteles HQ is and how it works.',
    'rules-of-engagement': 'Signal discipline and operating rules.',
    'mission-control': 'Routing, assignments, coordination, blockers.',
    'decisions-for-aurelius': 'Decision briefs for Aurelius only.',
    'daily-briefing': 'Concise strategic daily summary.',
    'strategic-memos': 'Longer-form synthesis and strategic notes.',
    'priority-queue': 'Active top priorities only.',
    'completed-projects': 'Closed projects and final outcomes.',
    'lessons-learned': 'Retrospectives and durable lessons.',
    'reference-library': 'Stable references and documents.',
    'graveyard': 'Killed ideas, paused initiatives, dead ends.',
  };
  return topics[name] || `Aristoteles HQ workspace: ${name}`;
}

function baseOverwrites(guild, rolesByName) {
  return [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionFlagsBits.SendMessages],
      type: OverwriteType.Role,
    },
  ];
}

function sharedAccessOverwrites(guild, rolesByName, writableRoles = []) {
  const out = baseOverwrites(guild, rolesByName);
  const viewers = ['Aurelius', 'Aristoteles', 'Leonardo', 'Michelangelo', 'Isaac', 'Julius', 'Steve', 'Carl', 'Inner Circle', 'Observer', 'System', 'Archive Keeper', 'Silent Worker'];
  for (const roleName of viewers) {
    const role = rolesByName.get(roleName);
    if (!role) continue;
    const allow = [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory];
    if (writableRoles.includes(roleName)) {
      allow.push(PermissionFlagsBits.SendMessages);
    }
    out.push({ id: role.id, allow, type: OverwriteType.Role });
  }
  return out;
}

function buildChannelOverwrites(guild, rolesByName, channelName) {
  if (channelName === 'welcome' || channelName === 'rules-of-engagement') {
    return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles', 'System']);
  }
  if (channelName === 'mission-control' || channelName === 'priority-queue' || channelName === 'strategic-memos') {
    return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles', 'Leonardo', 'Michelangelo', 'Isaac', 'Julius', 'Steve', 'Carl']);
  }
  if (channelName === 'decisions-for-aurelius' || channelName === 'daily-briefing') {
    return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles']);
  }
  if (['completed-projects', 'lessons-learned', 'reference-library', 'graveyard'].includes(channelName)) {
    return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles', 'Archive Keeper']);
  }
  const ownerRole = specialistLane[channelName];
  if (ownerRole) {
    return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles', ownerRole]);
  }
  return sharedAccessOverwrites(guild, rolesByName, ['Aurelius', 'Aristoteles']);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once('ready', async () => {
  try {
    const guild = await client.guilds.fetch(guildId);
    await guild.fetch();
    await guild.channels.fetch();
    await guild.roles.fetch();

    const created = { roles: [], categories: [], channels: [], posts: [] };
    const existingRoles = new Map(guild.roles.cache.map(r => [r.name, r]));

    for (const roleName of spec.roles) {
      if (!existingRoles.has(roleName)) {
        const role = await guild.roles.create({
          name: roleName,
          color: roleColors[roleName] || null,
          mentionable: false,
          hoist: ['Aurelius', 'Aristoteles'].includes(roleName),
          reason: 'Aristoteles HQ provisioning',
        });
        existingRoles.set(roleName, role);
        created.roles.push(roleName);
      }
    }

    const aureliusRole = existingRoles.get('Aurelius');
    if (aureliusRole) {
      try {
        const member = await guild.members.fetch(aureliusUserId);
        if (!member.roles.cache.has(aureliusRole.id)) {
          await member.roles.add(aureliusRole, 'Assign Aurelius founder role');
        }
      } catch (err) {
        created.posts.push(`Could not assign Aurelius role automatically: ${String(err.message || err)}`);
      }
    }

    const categoriesByName = new Map(
      guild.channels.cache
        .filter(ch => ch.type === ChannelType.GuildCategory)
        .map(ch => [ch.name, ch])
    );

    for (const categorySpec of spec.categories) {
      let category = categoriesByName.get(categorySpec.name);
      if (!category) {
        category = await guild.channels.create({
          name: categorySpec.name,
          type: ChannelType.GuildCategory,
          reason: 'Aristoteles HQ provisioning',
        });
        categoriesByName.set(categorySpec.name, category);
        created.categories.push(categorySpec.name);
      }

      for (const channelName of categorySpec.channels) {
        let channel = guild.channels.cache.find(ch => ch.name === channelName && ch.parentId === category.id);
        if (!channel) {
          channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
            topic: channelTopic(channelName),
            permissionOverwrites: buildChannelOverwrites(guild, existingRoles, channelName),
            reason: 'Aristoteles HQ provisioning',
          });
          created.channels.push(channelName);
        } else {
          await channel.edit({
            topic: channelTopic(channelName),
            permissionOverwrites: buildChannelOverwrites(guild, existingRoles, channelName),
          });
        }
      }
    }

    const postMap = {
      'welcome': loadFile('onboarding/welcome.md'),
      'rules-of-engagement': loadFile('onboarding/rules-of-engagement.md'),
      'mission-control': loadFile('onboarding/usage.md'),
      'daily-briefing': loadFile('templates/daily-briefing.md'),
      'decisions-for-aurelius': loadFile('templates/decision-brief.md'),
      'carl-red-team': loadFile('templates/critical-review.md'),
    };

    for (const [channelName, text] of Object.entries(postMap)) {
      const channel = guild.channels.cache.find(ch => ch.name === channelName && ch.isTextBased());
      if (channel) {
        await channel.send(text.slice(0, 1900));
        created.posts.push(`Posted starter content in #${channelName}`);
      }
    }

    ensureDir(path.resolve(process.cwd(), 'logs'));
    fs.writeFileSync(
      path.resolve(process.cwd(), 'logs/provision-result.json'),
      JSON.stringify(
        {
          guildId,
          createdAt: new Date().toISOString(),
          created,
        },
        null,
        2
      )
    );

    console.log(JSON.stringify({ ok: true, guildId, created }, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: String(err?.message || err) }, null, 2));
    process.exitCode = 1;
  } finally {
    setTimeout(() => client.destroy(), 1000);
  }
});

client.login(token);
