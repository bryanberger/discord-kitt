/**
 *
 * TODO:
 *
 * - Use Winston for logging
 * - Custom !help command
 * - Welcome command, after joined by user tell them how to use it
 * - Redis only provider, get rid of SQLlite
 */
import path from 'path'
import { CommandoClient, SyncSQLiteProvider } from 'discord.js-commando'
import sqlite3 from 'better-sqlite3'

import voiceStateUpdate from './handlers/voiceStateUpdate'
import guildCreate from './handlers/guildCreate'
import guildDelete from './handlers/guildDelete'
import ready from './handlers/ready'
import { loadAndCacheVoices } from './lib/polly'

// Client
const client = new CommandoClient({
  commandPrefix: '!',
  owner: process.env.OWNER_ID,
  disableMentions: 'everyone',
  invite: 'https://discord.gg/8ZsAYZ8Smd',
})

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
  // Registers all built-in groups, commands, and argument types
  .registerDefaults()
  // Register custom commands
  .registerCommandsIn(path.join(__dirname, 'commands/announce'))
  .registerCommandsIn(path.join(__dirname, 'commands/fun'))
  .registerCommandsIn(path.join(__dirname, 'commands/owner'))

console.log(
  'Loaded Commands:',
  client.registry.commands.map((command) => command.name),
)

// Load/Cache AWS Polly Voices
loadAndCacheVoices()

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => ready(client))
  .on('voiceStateUpdate', (oldState, newState) =>
    voiceStateUpdate(oldState, newState, client),
  )
  .on('guildCreate', (guild) => guildCreate(guild, client))
  .on('guildDelete', (guild) => guildDelete(guild, client))

process.on('unhandledRejection', console.error)

client.login(process.env.DISCORD_TOKEN)
