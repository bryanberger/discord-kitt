import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { EVENTS, EventsType } from '../../lib/constants'

export interface CommandArgs {
  event: EventsType
}

export class EventsCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'events',
      group: 'announce',
      memberName: 'events',
      description:
        'List all same-channel events and if they are enabled or note',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      guarded: true,
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
    const embed = new MessageEmbed()
      .setTitle(`**Events**`)
      .setDescription(
        `List of all same-channel events and if they are enabled or not. Eg: when someone mutes, deafens, starts a stream.`,
      )
      .setColor(`#35e07c`)

    EVENTS.forEach((event) => {
      embed.addField(event, message.guild.settings.get(event, false))
    })

    const messages = []

    try {
      messages.push(await message.direct(embed))
      if (message.channel.type !== 'dm')
        messages.push(
          await message.reply(
            'Sent you a DM with the state of all same-channel events.',
          ),
        )
    } catch (err) {
      messages.push(
        await message.reply(
          'Unable to send you the help DM. You probably have DMs disabled.',
        ),
      )
    }

    return messages
  }
}
