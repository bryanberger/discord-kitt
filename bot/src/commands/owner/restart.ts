import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { shutdown } from '../../lib/utils'

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

  public async run(message: CommandoMessage): Promise<null> {
    await message.say('Restarting...')
    shutdown(message.client)
    return null
  }
}
