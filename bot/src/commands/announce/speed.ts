import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export interface SpeedPhraseArgs {
  speed: number
}

/**
 * Usage:
 *
 * !speed 50%
 * !speed 200%
 */
export class SpeedCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'speed',
      group: 'announce',
      memberName: 'speed',
      aliases: ['rate'],
      description:
        'Customize the rate of speech. The speed at which the voice talks.',
      throttling: {
        usages: 1,
        duration: 10,
      },
      guildOnly: true,
      argsPromptLimit: 0,
      examples: ['speed 50', 'speed 100', 'speed 200'],
      args: [
        {
          key: 'speed',
          prompt: 'What would you like to set the speed to? (eg: 0-200)',
          type: 'integer',
          min: 1,
          max: 200,
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
    args: SpeedPhraseArgs,
  ): Promise<Message | Message[] | null> {
    console.log(args)

    message.guild.settings.set('speed', args.speed)
    return message.reply(`The default voice \`speed\` was changed.`)
  }
}
