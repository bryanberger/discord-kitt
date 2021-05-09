import { VoiceChannel } from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'
import { botCache } from '..'
import { channels } from '../lib/database'

import {
  getCachedVoiceChannels,
  setActivity,
  setDefaultAnnouncementSettings,
} from '../lib/utils'

export default async (client: CommandoClient) => {
  botCache.isReady = true

  // Set Activity
  setActivity(client)

  // Set Guild Defaults
  client.guilds.cache.forEach((guild) =>
    setDefaultAnnouncementSettings(client, guild as CommandoGuild),
  )

  // Rejoin cached channels
  const cachedChannels = [...await getCachedVoiceChannels(client.guilds.cache)]

  console.log(`Trying to rejoin [${cachedChannels.length}] cached channels.`)

  tryToJoinCachedChannels(cachedChannels)

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

function tryToJoinCachedChannels(voiceChannels: VoiceChannel[]) {
  const channel = voiceChannels.shift()

  channel
    .join()
    .then(() => {
      console.log(`Rejoined cached channel: ${channel.id}`)
      if (voiceChannels[0]) tryToJoinCachedChannels(voiceChannels)
    })
    .catch((err) => {
      console.error(
        `Channel: ${channel.id} is not rejoinable, removing it from cache...`,
      )

      channels.delete(channel.id)
      if (voiceChannels[0]) tryToJoinCachedChannels(voiceChannels)
    })
}
