import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class JoinCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'join',
      group: 'announce',
      memberName: 'join',
      description: 'Joins the users current voice channel',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    if (!message.member.voice.channel) {
      return message.say('You need to be in a voice channel to summon me.')
    }

    try {
      const connection = await message.member.voice.channel.join()
      connection.setSpeaking(0)
    } catch (err) {
      return message.say('I need permission to join your voice channel.')
    }
  }
}
