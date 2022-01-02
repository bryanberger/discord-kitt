import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { say } from '../../lib/announce'
import { DEFAULT_SAY_AUTODELETE, DEFAULT_SPEED, DEFAULT_VOICE_ID, MAX_SAY_CHARS, SAY_AUTO_DELETE } from '../../lib/constants'

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
        duration: 20,
      },
      clientPermissions: ['CONNECT', 'SPEAK'],
      guildOnly: true,
      argsPromptLimit: 0,
      args: [
        {
          key: 'phrase',
          prompt: 'What would you like the bot to say?',
          error: `The min length is ${MIN_CHARS} characters, the max length is ${MAX_SAY_CHARS} characters.`,
          type: 'string',
          min: MIN_CHARS,
          max: MAX_SAY_CHARS,
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
      const guildSayAutoDelete = message.guild.settings.get(SAY_AUTO_DELETE, DEFAULT_SAY_AUTODELETE)

      if (!voiceConnection) {
        return message.say(`You must be in the same voice channel as the bot.`)
      }

      // remove the message from the text-channel
      if(guildSayAutoDelete) {
        try {
          await message.delete()
        } catch (err) {
          console.error(`Error: Missing permission to delete this user's message`)
        }
      }

      // announce
      await say(voiceConnection, args.phrase.trim(), guildVoiceId, guildSpeed)
    } catch (err) {
      console.error(err)
    }
  }
}
