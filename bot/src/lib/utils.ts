import { Collection, VoiceChannel, VoiceConnection } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
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
