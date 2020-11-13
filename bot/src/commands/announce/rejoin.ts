import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

import { sleep } from '../../lib/utils'

export class JoinCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'rejoin',
      group: 'announce',
      memberName: 'rejoin',
      description: "Rejoin the user's current voice channel",
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      clientPermissions: ['CONNECT', 'SPEAK'],
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    const channel = message.member.voice.channel
    if (!channel) {
      return message.say('You need to be in a voice channel.')
    }
    try {
      channel.leave()
      await sleep(1000)
      await channel.join()
    } catch (err) {
      return message.say('I need permission to join your voice channel.')
    }
  }
}
