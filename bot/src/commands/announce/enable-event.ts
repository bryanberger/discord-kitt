import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { EVENTS, EventsType } from '../../lib/constants'

export interface CommandArgs {
  event: EventsType
}

export class EnableEventCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'enable-event',
      group: 'announce',
      memberName: 'enable-event',
      aliases: ['ee'],
      description:
        'Enable the announcement of a specific events. Eg: when someone joins, leaves, mutes, starts a stream, or to ignore bots.',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      guarded: true,
      examples: [
        'enable-event join',
        'enable-event leave',
        'enable-event mute',
        'enable-event stream',
        'enable-event bots',
      ],
      argsPromptLimit: 0,
      args: [
        {
          key: 'event',
          prompt: 'Which event would you like to enable?',
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
    if (message.guild.settings.get(args.event)) {
      // already enabled
      return message.reply(`The \`${args.event}\` event is already enabled.`)
    } else {
      // set to enable
      await message.guild.settings.set(args.event, true)
      return message.reply(`Enabled the \`${args.event}\` event.`)
    }
  }
}
