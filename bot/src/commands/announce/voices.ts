import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { numVoices, voices } from '../../lib/polly'

export class VoicesCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'voices',
      group: 'announce',
      memberName: 'voices',
      description: 'A list of available voices you can choose from.',
      throttling: {
        usages: 1,
        duration: 5,
      },
    })
  }

  public async run(
    message: CommandoMessage,
  ): Promise<Message | Message[] | null> {
    const embed = new MessageEmbed()
      .setTitle(`**Voices (${numVoices})**`)
      .setDescription(`The default voice is \`Amy\` (en-GB)`)
      .setColor(`#35e07c`)

    voices.forEach((voiceArray) => {
      const label = `${voiceArray[0].LanguageName} (${voiceArray[0].LanguageCode})`
      const voiceIds = voiceArray.map((v) => v.Id)
      const ids = [
        voiceIds.slice(0, -1).join(', '),
        voiceIds.slice(-1)[0],
      ].join(voiceIds.length < 2 ? '' : ', ')

      embed.addField(label, ids)
    })

    const messages = []

    try {
      messages.push(await message.direct(embed))
      if (message.channel.type !== 'dm')
        messages.push(
          await message.reply('Sent you a DM with the available voices.'),
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
