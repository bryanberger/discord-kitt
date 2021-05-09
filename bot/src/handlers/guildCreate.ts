import { CommandoClient, CommandoGuild } from 'discord.js-commando'

import { setActivity, setDefaultAnnouncementSettings } from '../lib/utils'

export default async (guild: CommandoGuild, client: CommandoClient) => {
  setActivity(client)

  // Set default announcement event settings when a new guild is added
  setDefaultAnnouncementSettings(client, guild)
}
