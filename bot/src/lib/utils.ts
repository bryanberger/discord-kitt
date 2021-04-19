import fs from 'fs-extra'
import { Collection, VoiceChannel, VoiceConnection } from 'discord.js'
import { CommandoClient, CommandoGuild } from 'discord.js-commando'

import { DEFAULT_EVENTS, EVENTS } from './constants'
import { guilds } from './database'

export const sleep = (ms: number): Promise<void> => {
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
  try {
    return connections.some(
      (connection) => connection.channel.id === channel.id,
    )
  } catch (err) {
    return false
  }
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
