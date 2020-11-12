import { GuildMember, Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { setPhrase } from '../../lib/database'

const MIN_CHARS = 10
const MAX_CHARS = 140
const WAIT = 8

export interface PhraseCommandArgs {
  type: 'join' | 'leave'
  phrase: string
  member?: GuildMember | ''
}

/**
 * Usage:
 *
 * !phrase join hello!
 * !phrase leave goodbye!
 * !phrase @member join hello!
 * !phrase @member leave hello!
 */
export class PhraseCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'phrase',
      group: 'announce',
      memberName: 'phrase',
      description: 'Add a join or leave phrase for a member',
      throttling: {
        usages: 1,
        duration: 10,
      },
      guildOnly: true,
      args: [
        {
          key: 'type',
          prompt: 'Would you like to set a join or leave phrase?',
          error: `Pick one: join or leave`,
          type: 'string',
          oneOf: ['join', 'leave'],
          wait: WAIT,
        },
        {
          key: 'member',
          prompt: 'Which member would you like to set a phrase for',
          type: 'member',
          default: '',
          wait: WAIT,
        },
        {
          key: 'phrase',
          prompt: 'What phrase do you want to save?',
          error: `You phrase must be within the range of: ${MIN_CHARS} to ${MAX_CHARS} characters.`,
          type: 'string',
          min: MIN_CHARS,
          max: MAX_CHARS,
          wait: WAIT,
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
    args: PhraseCommandArgs,
  ): Promise<Message | Message[] | null> {
    const member = args.member === '' ? null : args.member ?? message.member

    if (args.type === 'join') {
      await setPhrase({
        type: 'join',
        guildId: message.guild.id,
        memberId: member.id,
        message: args.phrase,
      })
      return message.reply(`join phrase for ${member.displayName} was edited.`)
    } else if (args.type === 'leave') {
      await setPhrase({
        type: 'leave',
        guildId: message.guild.id,
        memberId: member.id,
        message: args.phrase,
      })
      return message.reply(`leave phrase for ${member.displayName} was edited.`)
    }
  }
}
