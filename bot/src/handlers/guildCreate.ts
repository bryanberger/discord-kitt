import { CommandoClient, CommandoGuild } from 'discord.js-commando'

import { setActivity, setDefaultAnnnouncementSettings } from '../lib/utils'

export default async (guild: CommandoGuild, client: CommandoClient) => {
  setActivity(client)

  // Set default announcement event settings when a new guild is added
  setDefaultAnnnouncementSettings(client, guild)
}
