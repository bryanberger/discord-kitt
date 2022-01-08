import Keyv from 'keyv'

const redisUrl = process.env.REDIS_URL

export const join = new Keyv(redisUrl, { namespace: 'join' })
export const leave = new Keyv(redisUrl, { namespace: 'leave' })
export const channels = new Keyv(redisUrl, { namespace: 'channels' })
export const guilds = new Keyv(redisUrl, { namespace: 'guilds' })
export const announcements = new Keyv(redisUrl, { namespace: 'announcements' })
export const commands = new Keyv(redisUrl, { namespace: 'commands' })
export const awsRequests = new Keyv(redisUrl, { namespace: 'aws' })

// Handle DB connection errors
join.on('error', (err) => console.log('DB Connection Error (join)', err))
leave.on('error', (err) => console.log('DB Connection Error (leave)', err))
channels.on('error', (err) =>
  console.log('DB Connection Error (channels)', err),
)
guilds.on('error', (err) => console.log('DB Connection Error (guilds)', err))
announcements.on('error', (err) =>
  console.log('DB Connection Error (announcements)', err),
)
commands.on('error', (err) =>
  console.log('DB Connection Error (commands)', err),
)
awsRequests.on('error', (err) =>
  console.log('DB Connection Error (awsRequests)', err),
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

  let guild = await namespace.get(guildId)

  if (typeof guild === 'undefined') {
    guild = {}
  }

  guild[memberId] = message

  // set count for use in prometheus
  const count: number = (await namespace.get('count')) || 0
  await namespace.set('count', count + 1)

  return await namespace.set(guildId, guild)
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

export const getAllPhrases = async (obj: PhraseGet): Promise<any> => {
  const { guildId, type } = obj
  const namespace = type === 'join' ? join : leave

  return (await namespace.get(guildId)) || {}
}
