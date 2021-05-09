import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { say } from '../../lib/announce'
import { DEFAULT_SPEED, DEFAULT_VOICE_ID, MAX_CHARS } from '../../lib/constants'

const MIN_CHARS = 2

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
      argsPromptLimit: 0,
      args: [
        {
          key: 'phrase',
          prompt: 'What would you like the bot to say?',
          error: `The min length is ${MIN_CHARS} characters, the max length is ${MAX_CHARS} characters.`,
          type: 'string',
          min: MIN_CHARS,
          max: MAX_CHARS,
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
      const voiceConnection = this.client.voice.connections.get(
        message.member.guild.id,
      )
      const guildVoiceId = message.guild.settings.get(
        'voiceId',
        DEFAULT_VOICE_ID,
      )
      const guildSpeed = message.guild.settings.get('speed', DEFAULT_SPEED)

      if (!voiceConnection) {
        return message.say(`You must be in the same voice channel as the bot.`)
      }
      // remove the message from the text-channel
      try {
        await message.delete()
      } catch (err) {
        console.error(`Error: Missing permission to delete this user's message`)
      }

      // announce
      await say(voiceConnection, args.phrase.trim(), guildVoiceId, guildSpeed)
    } catch (err) {
      console.error(err)
    }
  }
}
