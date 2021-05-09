import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class LeaveGuildCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'leave-guild',
      group: 'owner',
      memberName: 'leave-guild',
      description: 'Causes the bot to leave the current guild',
      guarded: true,
      ownerOnly: true,
    })
  }

  public async run(message: CommandoMessage): Promise<null> {
    await message.say(':wave:')
    await message.guild.leave()
    return null
  }
}
