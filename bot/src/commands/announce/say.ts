import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { say } from '../../lib/announce'

const MAX_CHARS = 140

export class SayCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'say',
      group: 'announce',
      memberName: 'say',
      description: 'Says a phrase in the users current voice channel',
      throttling: {
        usages: 1,
        duration: 5,
      },
      clientPermissions: ['CONNECT', 'SPEAK'],
      guildOnly: true,
      args: [
        {
          key: 'phrase',
          prompt: 'What would you like the bot to say?',
          error: `The maximum length is ${MAX_CHARS} chars.`,
          type: 'string',
          validate: (val: string) => val.length <= MAX_CHARS,
        },
      ],
    })
  }

  public async run(
    message: CommandoMessage,
    args: { phrase: string },
  ): Promise<Message | Message[] | null> {
    const channel = message.member!.voice.channel
    if (!channel) {
      return message.say(`You must join the bot's voice channel.`)
    }
    try {
      const voiceConnection = this.client.voice.connections.get(message.member.guild.id)
      if(!voiceConnection) {
        return message.say(`You must be in the same voice channel as the bot.`)
      }
      // remove the message from the text-channel
      message.delete()

      // announce
      await say(voiceConnection, args.phrase.trim())
     
    } catch (err) {
      console.error(err)
    }
  }
}
