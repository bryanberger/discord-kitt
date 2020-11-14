import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { getAllPhrasesForGuild } from '../../lib/database'

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
    const joins = await getAllPhrasesForGuild({
      guildId: message.guild.id,
      client: this.client,
      type: 'join',
    })

    const leaves = await getAllPhrasesForGuild({
      guildId: message.guild.id,
      client: this.client,
      type: 'leave',
    })

    let joinOutput = ''
    for (const [key, value] of Object.entries(joins)) {
      const member = message.guild.members.cache.get(key)
      joinOutput += `**${member.displayName}**: ${value}\n`
    }

    let leaveOutput = ''
    for (const [key, value] of Object.entries(leaves)) {
      const member = message.guild.members.cache.get(key)
      leaveOutput += `**${member.displayName}**: ${value}\n`
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
