import { CommandoGuild } from 'discord.js-commando'
import Keyv from 'keyv'

const redisUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URL
    : 'redis://localhost:6379'

const join = new Keyv(redisUrl, { namespace: 'join' })
const leave = new Keyv(redisUrl, { namespace: 'leave' })
export const channels = new Keyv(redisUrl, { namespace: 'channels' })

// Handle DB connection errors
join.on('error', (err) => console.log('DB Connection Error (join)', err))
leave.on('error', (err) => console.log('DB Connection Error (leave)', err))
channels.on('error', (err) =>
  console.log('DB Connection Error (channels)', err),
)

// Helpers for setting the guild object
export type PhraseType = 'join' | 'leave'

export interface PhraseGet {
  guildId: string
  type: PhraseType
}

export interface PhraseGetMember extends PhraseGet {
  memberId: string
}

export interface PhraseGetGuild {
  guild: CommandoGuild
  type: PhraseType
}

export interface PhraseSet extends PhraseGet {
  memberId: string
  message: string
}

export interface ChannelSet {
  guildId: string
  channelId: string
}

export const setPhraseForMember = async (obj: PhraseSet) => {
  const { guildId, memberId, type, message } = obj
  const namespace = type === 'join' ? join : leave

  let member = await namespace.get(memberId)

  if (typeof member === 'undefined') {
    member = {}
  }

  member[guildId] = message

  return await namespace.set(memberId, member)
}

export const getPhraseForMember = async (
  obj: PhraseGetMember,
): Promise<string | null> => {
  const { guildId, type, memberId } = obj
  const namespace = type === 'join' ? join : leave

  const member = await namespace.get(memberId)

  if (typeof member === 'undefined') {
    return null
  } else {
    return member[guildId] || null
  }
}

export const getAllPhrasesForGuild = async (
  obj: PhraseGetGuild,
): Promise<any> => {
  const { guild, type } = obj
  const namespace = type === 'join' ? join : leave
  const members = {}

  const allMembers = await guild.members.fetch()

  allMembers.map(async (member) => {
    const messages = await namespace.get(member.id)

    if (messages !== typeof 'undefined' && messages[guild.id]) {
      members[member.id] = messages[guild.id]
    }
  })

  return members
}
