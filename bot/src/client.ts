import { CommandoClient } from "discord.js-commando";

export const client = new CommandoClient({
  commandPrefix: '!',
  owner: process.env.OWNER_ID,
  disableMentions: 'everyone',
})
