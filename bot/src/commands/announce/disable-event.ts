import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { EVENTS, EventsType } from '../../lib/constants'

export interface CommandArgs {
  event: EventsType
}

export class DisableEventCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'disable-event',
      group: 'announce',
      memberName: 'disable-event',
      aliases: ['de'],
      description:
        'Disable the announcement of a specific events. Eg: when someone joins, leaves, mutes, starts a stream, or to ignore bots.',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      guarded: true,
      examples: [
        'disable-event join',
        'disable-event leave',
        'disable-event mute',
        'disable-event stream',
        'disable-event bots',
        'disable-event nicknames',
      ],
      argsPromptLimit: 0,
      args: [
        {
          key: 'event',
          prompt: 'Which event would you like to disable?',
          type: 'string',
          oneOf: EVENTS,
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
    args: CommandArgs,
  ): Promise<Message | Message[] | null> {
    if (!message.guild.settings.get(args.event)) {
      // already disabled
      return message.reply(`The \`${args.event}\` event is already disabled.`)
    } else {
      // set to disable
      await message.guild.settings.set(args.event, false)
      return message.reply(`Disabled the \`${args.event}\` event.`)
    }
  }
}
