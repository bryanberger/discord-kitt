import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class FlipCommand extends Command {
  private sides = ['heads', 'tails']

  private constructor(client: CommandoClient) {
    super(client, {
      name: 'flip',
      group: 'fun',
      memberName: 'flip',
      description: 'Flip a coin. Heads or tails.',
      throttling: {
        usages: 1,
        duration: 5,
      },
    })
  }

  public async run(message: CommandoMessage): Promise<Message | Message[]> {
    const side = this.sides[Math.floor(Math.random() * this.sides.length)]
    return message.say(`Your coin landed on ${side}!`)
  }
}
