import path from 'path'

import { client } from './client'
import { ensureDirectories } from './lib/directories'
import voiceStateUpdate from './handlers/voiceStateUpdate'

// Ensure Directories
ensureDirectories()

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
  .registerCommandsIn(path.join(__dirname, 'commands'))
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
  .on('debug', console.log)
  .on('ready', () => {
    console.log(
      `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
    )
  })
  .on('voiceStateUpdate', voiceStateUpdate)

client.login(process.env.DISCORD_TOKEN)
