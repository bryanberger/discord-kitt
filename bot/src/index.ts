/**
 *
 * TODO:
 *
 * - Use Winston for logging
 * - Custom !help command
 * - Welcome command, after joined by user tell them how to use it
 * - Migrate to MongoDB or MySQL or something
 * - AWAIT everything
 * - Sharding, when we need it https://discordjs.guide/sharding/
 */
import path from 'path'
import {
  CommandoClient,
  CommandoGuild,
  SyncSQLiteProvider,
} from 'discord.js-commando'
import sqlite3 from 'better-sqlite3'
import { Collection } from 'discord.js'

import voiceStateUpdate from './handlers/voiceStateUpdate'
import guildCreate from './handlers/guildCreate'
import guildDelete from './handlers/guildDelete'
import ready from './handlers/ready'
import { loadAndCacheVoices } from './lib/polly'
import { importDirectory, shutdown } from './lib/utils'
import ensureDirectories from './scripts/directories'
import startMetricServer from './server'
import { Task } from './types/task'

process.on('unhandledRejection', console.error)
process.on('uncaughtException', (e) => {
  console.log(e, 'uncaughtException')
  // try to force restart the process
  shutdown(client)
})

// Client
export const client = new CommandoClient({
  commandPrefix: '!',
  owner: process.env.OWNER_ID,
  disableMentions: 'everyone',
  invite: 'https://discord.gg/8ZsAYZ8Smd',
  shards: 'auto', // tmp internal mem sharding
  messageEditHistoryMaxSize: 0,
  messageCacheMaxSize: 25,
  messageCacheLifetime: 21600,
  messageSweepInterval: 43200,
  ws: {
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES'],
  },
})

// In Memory Bot Cache
export const botCache = {
  tasks: new Collection<string, Task>(),
  isReady: false,
  botId: process.env.BOT_ID,
  botListTokens: {
    DISCORD_BOTS_CO: process.env.DISCORD_BOTS_CO,
    DISCORD_BOT_ORG: process.env.DISCORD_BOT_ORG,
    DISCORD_BOT_LIST: process.env.DISCORD_BOT_LIST,
    DISCORD_BOATS: process.env.DISCORD_BOATS,
    DISCORD_BOTS_GG: process.env.DISCORD_BOTS_GG,
    BOTS_FOR_DISCORD: process.env.BOTS_FOR_DISCORD,
    BOTS_ON_DISCORD: process.env.BOTS_ON_DISCORD,
    TOP_GG: process.env.TOP_GG,
  },
}

// top level await
async function init() {
  console.log('NODE_ENV', process.env.NODE_ENV)
  console.log('DEBUG', process.env.DEBUG)
  ensureDirectories()
  loadAndCacheVoices()
  startMetricServer()

  await Promise.all(
    [path.join(__dirname, 'tasks')].map((path) => importDirectory(path)),
  )

  // SQLite for commando guild settings syncing
  client.setProvider(
    new SyncSQLiteProvider(
      new sqlite3(path.join(__dirname, '../settings/settings.db')),
    ),
  )

  client.registry
    // Registers your custom command groups
    .registerGroups([
      ['announce', 'Announcement commands'],
      ['fun', 'Fun commands'],
      ['owner', 'Owner commands'],
    ])
    // Registers all built-in argument types, groups, commands
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
      unknownCommand: false,
    })

    // Register custom commands
    .registerCommandsIn(path.join(__dirname, 'commands/announce'))
    .registerCommandsIn(path.join(__dirname, 'commands/fun'))
    .registerCommandsIn(path.join(__dirname, 'commands/owner'))

  console.log(
    'Loaded Commands:',
    client.registry.commands.map((command) => command.name),
  )

  client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('ready', () => ready(client))
    .on('voiceStateUpdate', (oldState, newState) =>
      voiceStateUpdate(oldState, newState, client),
    )
    .on('guildCreate', (guild) => guildCreate(guild as CommandoGuild, client))
    .on('guildDelete', (guild) => guildDelete(guild as CommandoGuild, client))

  if (process.env.DEBUG && process.env.DEBUG === 'true') {
    client.on('debug', (message) => {
      // Ignore spammy messages
      if (/(Sending a heartbeat|Latency of)/i.test(message)) return null
      if (/voice/i.test(message)) return null

      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] ${message}`)
    })
  }

  client.login(process.env.DISCORD_TOKEN)
}

// Start init
init()
