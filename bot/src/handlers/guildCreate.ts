import { Guild } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { setActivity } from '../lib/utils'

export default async (guild: Guild, client: CommandoClient) => {
  setActivity(client)
    // probably more stuff in the future, for now duplicates guildDelete
}
