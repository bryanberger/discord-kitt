import { Polly } from 'aws-sdk'
import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { DEFAULT_VOICE_ID } from '../../lib/constants'
import { voices } from '../../lib/polly'

export class VoiceCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'voice',
      group: 'announce',
      memberName: 'voice',
      description: `Sets the server's voice. Use the \`voices\` command for a list of all available voices.`,
      examples: ['voice Amy', 'voice Kevin'],
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      argsPromptLimit: 0,
      args: [
        {
          key: 'id',
          prompt:
            'Enter a voice name. (hint: use the `voices` command for a list of available voices).',
          type: 'string',
          default: '',
        },
      ],
    })
  }

  hasPermission(message: CommandoMessage) {
    return (
      this.client.isOwner(message.author) ||
      message.member.hasPermission('ADMINISTRATOR')
    )
  }

  validateVoiceId(name: string) {
    return voices.find((voiceArray) => this.voiceArrayFind(voiceArray, name))
      ? true
      : false
  }

  getVoiceId(name: string) {
    const voice = voices
      .find((voiceArray) => this.voiceArrayFind(voiceArray, name))
      .find((voice) => voice.Id.toLowerCase() === name.toLowerCase())

    return voice.Id
  }

  voiceArrayFind(voiceArray: Polly.Voice[], name: string) {
    return voiceArray.some(
      (voice) => voice.Id.toLowerCase() === name.toLowerCase(),
    )
  }

  public async run(
    message: CommandoMessage,
    args: { id: string },
  ): Promise<Message | Message[] | null> {
    if (!args.id) {
      const currentVoiceId = message.guild.settings.get(
        'voiceId',
        DEFAULT_VOICE_ID,
      )
      return message.reply(
        `**${currentVoiceId}** is the current voice. Use the \`voices\` command for a list of available voices and \`voice <name>\` to set a new voice.`,
      )
    }

    if (this.validateVoiceId(args.id)) {
      const voiceId = this.getVoiceId(args.id)
      message.guild.settings.set('voiceId', voiceId)
      return message.reply(`Voice changed to: ${voiceId}.`)
    } else {
      return message.reply(
        'No matching voice found. Use the `voices` command for a list of available voices.',
      )
    }
  }
}
