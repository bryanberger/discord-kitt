import fs from 'fs-extra'
import {
  Client,
  Collection,
  Guild,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'

import { DEFAULT_EVENTS, EVENTS } from './constants'
import { channels, guilds } from './database'

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const rand = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min
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
  try {
    return connections.some(
      (connection) => connection.channel.id === channel.id,
    )
  } catch (err) {
    return false
  }
}

export const setDefaultAnnouncementSettings = (
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

export async function importDirectory(path: string) {
  const files = fs.readdirSync(path)

  for (const file of files) {
    if (!file) continue

    const currentPath = `${path}/${file}`
    await require(currentPath)
  }
}

export const removeWords = (str: string, arr: string[]) => {
  return arr.reduce((acc, val) => {
    const regex = new RegExp(`${val}`, 'i')
    return acc.replace(regex, '')
  }, str)
}

export const encodeStringForSSML = (str: string) => {
  const controlCharacters: { [name: string]: string } = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  }
  const xmlEncodedSSML = str.replace(
    /[&|"|'|<|>]/g,
    (char) => controlCharacters[char] || '',
  )
  return xmlEncodedSSML
}

export const shutdown = (client: Client) => {
  try {
    client.voice?.connections?.forEach((connection) => {
      connection.disconnect()
    })
    client.destroy()
    process.exit(1)
  } catch (err) {}
}

export const getCachedVoiceChannels = async (
  guilds: Collection<string, Guild>,
) => {
  return await Promise.all(
    guilds.map(async (guild) => {
      const voiceChannels = guild.channels.cache.filter(
        (channel) => channel.type === 'voice',
      )

      /* 
        KLUDGE: lookup each channel in the cache to see if its there,
        this should be replaced when we switch databases
        store an array of cached channels instead of a lookup.
      */
      const channelCache: boolean[] = await Promise.all(
        voiceChannels.map(async (channel) => {
          return await channels.get(channel.id)
        }),
      )

      const voiceChannelsArray = [...voiceChannels.values()]

      return voiceChannelsArray.filter(
        (_, index) => channelCache[index],
      ) as VoiceChannel[]
    }),
  ).then((channels) => channels.reduce((acc, val) => acc.concat(val), [])) // flat()
}
