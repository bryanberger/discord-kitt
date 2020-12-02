import { Collection, VoiceChannel, VoiceConnection } from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'
import { DEFAULT_EVENTS, EVENTS } from './constants'
import { guilds } from './database'

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const setActivity = async (client: CommandoClient) => {
  const count = client.guilds.cache.size
  client.user.setActivity(`in ${count} servers`)
  await guilds.set('count', count)
}

export const isBotInChannel = (
  connections: Collection<string, VoiceConnection>,
  channel: VoiceChannel,
) => {
  return connections.some((connection) => connection.channel.id === channel.id)
}

export const setDefaultAnnnouncementSettings = (
  client: CommandoClient,
  guild: CommandoGuild,
) => {
  EVENTS.forEach(async (event) => {
    // not sure why we have to do this. otherwise its always undefined
    await guild.settings.get(event)
    const providerState = await client.provider.get(guild.id, event)

    if (typeof providerState === 'undefined') {
      await guild.settings.set(event, DEFAULT_EVENTS[event])
    }
  })
}
