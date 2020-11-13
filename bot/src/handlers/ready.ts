import { Channel, VoiceChannel } from "discord.js"
import { CommandoClient } from "discord.js-commando"

import { channels } from "../lib/database"
import { setActivity } from "../lib/utils"

export default async (client: CommandoClient) => {

  // Log
  console.log(
    `Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`,
  )

  // Set Activity
  setActivity(client)

  // Rejoin all cached channels
  client.guilds.cache.map(guild => {
    guild.channels.cache.map(async (channel) => {
      const joinThisChannel = await channels.get(channel.id)
      if(joinThisChannel) {
        const vc = client.channels.cache.get(channel.id) as VoiceChannel
        await vc.join()
      }
    })
  })

  // Hack for now, reconnect to all open voice connections every 10 minutes
  // setInterval(() => {
  //   client.voice.connections.map(async (conn) => {
  //     // conn.channel.leave()
  //     // await sleep(1000)
  //     conn.channel.join()
  //   })
  // }, 10 * 60 * 1000)
}
