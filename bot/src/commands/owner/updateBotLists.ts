import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { botCache } from '../..'

export class UpdateBotListsCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'updatebotlists',
      group: 'owner',
      memberName: 'updatebotlists',
      aliases: ['ubl'],
      description: 'Upload Bot Lists',
      guarded: true,
      ownerOnly: true,
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    await botCache.tasks.get('botlists').execute()
    return message.reply('Updated Bot Lists!')
  }
}
