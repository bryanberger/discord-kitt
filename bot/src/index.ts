import { join } from 'path'
import { CommandoClient } from 'discord.js-commando'

console.log('index.ts')

const client = new CommandoClient({
  commandPrefix: '!',
  owner: process.env.OWNER_ID,
})

client.registry
  // Registers your custom command groups
  .registerGroups([
    ['announce', 'Announcement commands'],
    ['fun', 'Fun commands'],
  ])
  // Registers all built-in groups, commands, and argument types
  .registerDefaults()
  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(join(__dirname, 'commands'))

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(
      `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
    )
  })

client.login(process.env.DISCORD_TOKEN)
