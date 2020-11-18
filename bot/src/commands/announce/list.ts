import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { getAllPhrases } from '../../lib/database'

export class ListCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'list',
      group: 'announce',
      memberName: 'list',
      description: 'A list of phrases added for this server',
      throttling: {
        usages: 1,
        duration: 5,
      },
      guildOnly: true,
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    const joins = await getAllPhrases({
      guildId: message.guild.id,
      type: 'join',
    })

    const leaves = await getAllPhrases({
      guildId: message.guild.id,
      type: 'leave',
    })

    let joinOutput = ''
    for (const [key, value] of Object.entries(joins)) {
      const member = await message.guild.members.fetch(key)
      if (member) {
        joinOutput += `**${member.displayName}**: ${value}\n`
      }
    }

    let leaveOutput = ''
    for (const [key, value] of Object.entries(leaves)) {
      const member = await message.guild.members.fetch(key)
      if (member) {
        leaveOutput += `**${member.displayName}**: ${value}\n`
      }
    }

    const guildName = message.guild.name
    const output = `__**The Phrase List for ${guildName}**__:\n\n__Join Phrases__\n${joinOutput}\n__Leave Phrases__\n${leaveOutput}`
    const messages = []
    try {
      messages.push(await message.direct(output))
      if (message.channel.type !== 'dm')
        messages.push(
          await message.reply(
            'Sent you a DM with the phrase list for this server.',
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
