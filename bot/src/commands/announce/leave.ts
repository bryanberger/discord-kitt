import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class LeaveCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'leave',
      group: 'announce',
      memberName: 'leave',
      description: "Leaves the user's current voice channel",
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      clientPermissions: ['CONNECT', 'SPEAK'],
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    if (
      message.member.voice.channel &&
      message.client.voice.connections.some(
        (connection) => connection.channel === message.member.voice.channel,
      )
    ) {
      message.member.voice.channel.leave()
    } else {
      return message.say("I'm not in your voice channel.")
    }
  }
}
