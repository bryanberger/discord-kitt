import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class JoinCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'join',
      group: 'announce',
      memberName: 'join',
      description: "Joins the user's current voice channel",
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
    if (!message.member.voice.channel) {
      return message.reply('You need to be in a voice channel to summon me.')
    }
    try {
      await message.member.voice.channel.join()
    } catch (err) {
      return message.reply('I need permission to join your voice channel.')
    }
  }
}
