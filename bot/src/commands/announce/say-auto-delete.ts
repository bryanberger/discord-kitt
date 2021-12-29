import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { SAY_AUTO_DELETE } from '../../lib/constants'

export interface CommandArgs {
  state: boolean
}

export class SayAutoDelete extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'say-auto-delete',
      group: 'announce',
      memberName: 'say-auto-delete',
      aliases: ['sad', 'sayautodelete'],
      description:
        'Toggle the auto-deletion of `!say` messages',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
      guarded: true,
      examples: [
        'say-auto-delete true',
        'say-auto-delete false',
      ],
      argsPromptLimit: 0,
      args: [
        {
          key: 'state',
          prompt: 'Toggle on or off',
          type: 'boolean',
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
    if(args.state) {
        await message.guild.settings.set(SAY_AUTO_DELETE, true)
    } else {
        await message.guild.settings.set(SAY_AUTO_DELETE, false)
    }
    return message.reply(`\`${SAY_AUTO_DELETE}\` ${args.state ? 'enabled' : 'disabled'}.`)
  }
}
