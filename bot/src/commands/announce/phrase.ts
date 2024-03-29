import { GuildMember, Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { setPhraseForMember } from '../../lib/database'
import { MIN_CHARS, MAX_CHARS, PHRASE_TYPES } from '../../lib/constants'
import { removeWords } from '../../lib/utils'

export interface PhraseCommandArgs {
  type: 'join' | 'leave'
  phrase: string
  member?: GuildMember | null
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
      argsPromptLimit: 0,
      examples: [
        'phrase join has joined the channel',
        'phrase leave has left the channel',
        'phrase @member join has joined the channel',
        'phrase @member leave has left the channel',
      ],
      args: [
        {
          key: 'type',
          prompt: 'Would you like to set a join or leave phrase?',
          error: `Pick one: join or leave`,
          type: 'string',
          oneOf: ['join', 'leave'],
        },
        {
          key: 'member',
          prompt: 'Which member would you like to set a phrase for',
          type: 'member',
          default: '',
          validate: () => {
            // we validate in the run function
            return true
          },
        },
        {
          key: 'phrase',
          prompt: 'What phrase do you want to save?',
          error: `You phrase must be within the range of: ${MIN_CHARS} to ${MAX_CHARS} characters.`,
          type: 'string',
          min: MIN_CHARS,
          max: MAX_CHARS,
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
    const argType = args.type.toLowerCase()

    const member = args.member === null ? message.member : args.member

    // Kludge: allows the support of an optional `member` argument
    const phrase =
      args.member === null
        ? removeWords(message.argString.trim(), [argType]).trim() // need to access the raw arguments
        : args.phrase

    if (argType === 'join') {
      await setPhraseForMember({
        type: 'join',
        guildId: message.guild.id,
        memberId: member.id,
        message: phrase,
      })
      return message.reply(`join phrase for ${member.displayName} was edited.`)
    } else if (argType === 'leave') {
      await setPhraseForMember({
        type: 'leave',
        guildId: message.guild.id,
        memberId: member.id,
        message: phrase,
      })
      return message.reply(`leave phrase for ${member.displayName} was edited.`)
    }
  }
}
