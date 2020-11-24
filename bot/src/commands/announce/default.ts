import { GuildMember, Message, MessageEmbed } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import {
  DEFAULT_JOIN_MESSAGE,
  DEFAULT_LEAVE_MESSAGE,
} from '../../lib/constants'

const MIN_CHARS = 10
const MAX_CHARS = 140

export interface PhraseCommandArgs {
  type: 'join' | 'leave'
  phrase: string
  member?: GuildMember | null
}

/**
 * Usage:
 *
 * !default join default join message
 * !default leave default leave message
 */
export class DefaultCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'default',
      group: 'announce',
      memberName: 'default',
      aliases: ['defaults'],
      description: 'Customize the default join/leave phrase for the server',
      throttling: {
        usages: 1,
        duration: 10,
      },
      guildOnly: true,
      args: [
        {
          key: 'type',
          prompt: 'Would you like to set the default join or leave phrase?',
          error: `Pick one: join or leave`,
          type: 'string',
          oneOf: ['join', 'leave'],
          default: '',
        },
        {
          key: 'phrase',
          prompt: 'What default phrase do you want to save?',
          error: `You phrase must be within the range of: ${MIN_CHARS} to ${MAX_CHARS} characters.`,
          type: 'string',
          min: MIN_CHARS,
          max: MAX_CHARS,
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

  public async run(
    message: CommandoMessage,
    args: PhraseCommandArgs,
  ): Promise<Message | Message[] | null> {
    if (!args.type || !args.phrase) {
      const defaultJoin =
        message.guild.settings.get('join') ?? DEFAULT_JOIN_MESSAGE
      const defaultLeave =
        message.guild.settings.get('leave') ?? DEFAULT_LEAVE_MESSAGE

      const embed = new MessageEmbed()
        .setTitle(`**Default Join/Leave Phrases**`)
        .setDescription(
          `
      **Join**: ${defaultJoin}
      **Leave**: ${defaultLeave}
      `,
        )
        .setColor(`#35e07c`)

      return message.embed(embed)
    }

    if (args.type === 'join') {
      message.guild.settings.set('join', args.phrase)
      return message.reply(`The default \`join\` phrase was edited.`)
    } else if (args.type === 'leave') {
      message.guild.settings.set('leave', args.phrase)
      return message.reply(`The default \`leave\` phrase was edited.`)
    }
  }
}
