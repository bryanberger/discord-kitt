import { VoiceChannel } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { play } from '../lib/announce'

import { channels } from '../lib/database'
import { Silence } from '../lib/silence'
import { setActivity } from '../lib/utils'

export default async (client: CommandoClient) => {
  // Log
  console.log(
    `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
  )

  // Set Activity
  setActivity(client)

  // Rejoin all cached channels
  client.guilds.cache.map(async (guild) => {
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
