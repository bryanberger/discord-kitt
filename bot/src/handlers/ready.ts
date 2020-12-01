import { VoiceChannel } from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'
import { play } from '../lib/announce'

import { channels } from '../lib/database'
import { Silence } from '../lib/silence'
import { setActivity } from '../lib/utils'
import { EVENTS, DEFAULT_EVENTS } from '../lib/constants'

export default async (client: CommandoClient) => {
  // Log
  console.log(
    `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
  )

  // Set Activity
  setActivity(client)

  client.guilds.cache.map(async (guild: CommandoGuild) => {
    // Set default announcement event settings
    EVENTS.forEach(async (event) => {
      // not sure why we have to do this. otherwise its always undefined
      await guild.settings.get(event)
      const providerState = await client.provider.get(guild.id, event)

      if (typeof providerState === 'undefined') {
        await guild.settings.set(event, DEFAULT_EVENTS[event])
      }
    })

    // Rejoin all cached channels if possible
    guild.channels.cache.map(async (channel) => {
      const joinThisChannel = await channels.get(channel.id)
      if (joinThisChannel) {
        const vc = client.channels.cache.get(channel.id) as VoiceChannel
        await vc.join()
      }
    })
  })

  // Hack for now, say a Silence in each open voice connection every 2 minutes
  setInterval(() => {
    if (client.voice.connections.size > 0) {
      console.log(
        `play Silence() in ${client.voice.connections.size} voice channel(s)`,
      )

      client.voice.connections.map(async (connection) => {
        await play(connection, new Silence(), { type: 'opus' })
        connection.setSpeaking(0)
      })
    }
  }, 2 * 60 * 1000)
}
