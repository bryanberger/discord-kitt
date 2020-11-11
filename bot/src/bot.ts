/**
 *
 * TODO:
 *
 * - Add persistance using sqllite, maybe need something more robust (in another container, for phrase lists for every member, based on role?)
 * - Add rejoin channels on reboot
 * - Use Winston for logging
 */
import path from 'path'
import { CommandoClient } from 'discord.js-commando'

import voiceStateUpdate from './handlers/voiceStateUpdate'
import guildCreate from './handlers/guildCreate'
import guildDelete from './handlers/guildDelete'
import { setActivity, sleep } from './lib/utils'

// Client
const client = new CommandoClient({
  commandPrefix: '!',
  owner: process.env.OWNER_ID,
  disableMentions: 'everyone',
})

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

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    setActivity(client)
    console.log(
      `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
    )

    // Hack for now, reconnect to all open voice connections every 10 minutes
    // setInterval(() => {
    //   client.voice.connections.map(async (conn) => {
    //     // conn.channel.leave()
    //     // await sleep(1000)
    //     conn.channel.join()
    //   })
    // }, 10 * 60 * 1000)
  })
  .on('voiceStateUpdate', (oldState, newState) =>
    voiceStateUpdate(oldState, newState, client),
  )
  .on('guildCreate', (guild) => guildCreate(guild, client))
  .on('guildDelete', (guild) => guildDelete(guild, client))

client.login(process.env.DISCORD_TOKEN)
