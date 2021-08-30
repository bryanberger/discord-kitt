import { GuildMember, Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { setPhraseForMember } from '../../lib/database'
import {
  DEFAULT_JOIN_MESSAGE,
  DEFAULT_LEAVE_MESSAGE,
} from '../../lib/constants'

export interface ResetCommandArgs {
  type: 'join' | 'leave'
  member?: GuildMember | null | ''
}

/**
 * Usage:
 *
 * !reset join
 * !reset leave
 * !reset @member join
 * !reset @member leave
 */
export class ResetCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'reset',
      group: 'announce',
      memberName: 'reset',
      description: `Reset a user's join/leave phrase to the default server value`,
      throttling: {
        usages: 1,
        duration: 10,
      },
      guildOnly: true,
      argsPromptLimit: 0,
      examples: [
        'reset join',
        'reset leave',
        'reset @member join',
        'reset @member leave',
      ],
      args: [
        {
          key: 'type',
          prompt: 'Which phrase would you like to reset, join or leave?',
          error: `Pick one: join or leave`,
          type: 'string',
          oneOf: ['join', 'leave'],
        },
        {
          key: 'member',
          prompt: 'Which member would you like to reset?',
          type: 'member',
          default: '',
          validate: () => {
            // we validate in the run function
            return true
          },
        },
      ],
    })
  }

  hasPermission(message: CommandoMessage) {
    // if a `member` is mentioned does this user have access to change it
    const member = message.mentions.members?.first()
    if (member) {
      return (
        this.client.isOwner(message.author) ||
        message.member.hasPermission('ADMINISTRATOR') ||
        message.member.id === member.id
      )
    } else {
      return true
    }
  }

  public async run(
    message: CommandoMessage,
    args: ResetCommandArgs,
  ): Promise<Message | Message[] | null> {
    const argType = args.type.toLowerCase()

    const member = args.member === '' ? message.member : args.member

    if (member) {
      if (argType === 'join') {
        await setPhraseForMember({
          type: 'join',
          guildId: message.guild.id,
          memberId: member.id,
          message: message.guild.settings.get("defaultJoin") ?? DEFAULT_JOIN_MESSAGE,
        })
        return message.reply(
          `join phrase for ${member.displayName} was reset to the server default.`,
        )
      } else if (argType === 'leave') {
        await setPhraseForMember({
          type: 'leave',
          guildId: message.guild.id,
          memberId: member.id,
          message: message.guild.settings.get("defaultLeave") ?? DEFAULT_LEAVE_MESSAGE,
        })
        return message.reply(
          `leave phrase for ${member.displayName} was reset to the server default.`,
        )
      }
    } else {
      return message.reply(`You entered an invalid member, try again...`)
    }
  }
}
