import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { humanizeDelta } from '../../lib/time'

export class RestartCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'uptime',
      group: 'owner',
      memberName: 'uptime',
      description:
        'How long it has been since the client last entered the READY state in milliseconds',
      guarded: true,
      ownerOnly: true,
    })
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const embed = new MessageEmbed()
      .setTitle(`**Uptime**`)
      .setDescription(
        `
      I've been online for:
      **${humanizeDelta(this.client.uptime)}** 
      `,
      )
      .setColor(`#35e07c`)

    return message.embed(embed)
  }
}
