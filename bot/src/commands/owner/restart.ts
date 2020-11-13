import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class RestartCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'restart',
      group: 'owner',
      memberName: 'restart',
      description: 'Forces the bot process to restart',
      guarded: true,
      ownerOnly: true,
    })
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    await message.say('Restarting...')
    try {
      message.client.destroy()
    } catch (err) {}
    
    process.exit(0)
  }
}
