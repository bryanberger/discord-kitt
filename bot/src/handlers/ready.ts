import { VoiceChannel } from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'
import { botCache } from '..'

import { channels } from '../lib/database'
import { setActivity, setDefaultAnnnouncementSettings } from '../lib/utils'

export default async (client: CommandoClient) => {
  botCache.isReady = true

  // Set Activity
  setActivity(client)

  client.guilds.cache.map(async (guild: CommandoGuild) => {
    // Set default announcement event settings for ALL guilds if some were missed somehow
    setDefaultAnnnouncementSettings(client, guild)

    // Rejoin all cached channels if possible
    guild.channels.cache.map(async (channel) => {
      const joinThisChannel = await channels.get(channel.id)
      if (joinThisChannel) {
        const vc = client.channels.cache.get(channel.id) as VoiceChannel
        await vc.join()
      }
    })
  })

  // Run Recurring Tasks
  for (const task of botCache.tasks.values()) {
    setInterval(() => task.execute(), task.interval)
  }

  console.info(`Loaded ${botCache.tasks.size} Task(s)`)

  // Log
  console.log(
    `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
  )
}
