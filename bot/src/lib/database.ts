import Keyv from 'keyv'

const redisUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URL
    : 'redis://localhost:6379'

const join = new Keyv(redisUrl, { namespace: 'join' })
const leave = new Keyv(redisUrl, { namespace: 'leave' })

// Handle DB connection errors
join.on('error', (err) => console.log('DB Connection Error', err))
leave.on('error', (err) => console.log('DB Connection Error', err))

// Helpers for setting the guild object
export type PhraseType = 'join' | 'leave'

export interface PhraseGet {
  guildId: string
  type: PhraseType
}

export interface PhraseGetMember extends PhraseGet {
  memberId: string
}

export interface PhraseSet extends PhraseGet {
  memberId: string
  message: string
}

export const setPhrase = async (obj: PhraseSet) => {
  const { guildId, memberId, type, message } = obj
  const namespace = type === 'join' ? join : leave

  let guild = await namespace.get(guildId)

  if (typeof guild === 'undefined') {
    guild = {}
  }

  guild[memberId] = message

  return await namespace.set(guildId, guild)
}

export const getAllPhrases = async (obj: PhraseGet): Promise<string> => {
  const { guildId, type } = obj
  const namespace = type === 'join' ? join : leave

  return await namespace.get(guildId) || {}
}

export const getPhraseForMember = async (
  obj: PhraseGetMember,
): Promise<string | null> => {
  const { guildId, type, memberId } = obj
  const namespace = type === 'join' ? join : leave

  const guild = await namespace.get(guildId)

  if (typeof guild === 'undefined') {
    return null
  } else {
    return guild[memberId] || null
  }
}
