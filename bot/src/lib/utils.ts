import { CommandoClient } from "discord.js-commando"

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const setActivity = (client: CommandoClient) => {
  client.user.setActivity(`in ${client.guilds.cache.size} servers`)
}

export const phraseId = (guildId: string, memberId: string) => {
  return `${guildId}:${memberId}`
}
