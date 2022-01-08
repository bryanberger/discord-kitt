import { Message } from 'discord.js'
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'
import { say } from '../../lib/announce'
import { DEFAULT_SPEED, DEFAULT_VOICE_ID } from '../../lib/constants'

export class TestCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'test',
      group: 'announce',
      memberName: 'test',
      description: "Sends a test phrase to the bot's current voice channel",
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
    const channel = message.member!.voice.channel
    if (!channel) {
      return message.say(`You must be in a voice channel with this bot.`)
    }
    try {
      const voiceConnection = this.client.voice.connections.get(
        message.member.guild.id,
      )
      const guildVoiceId = message.guild.settings.get(
        'voiceId',
        DEFAULT_VOICE_ID,
      )
      const guildSpeed = message.guild.settings.get(
        'speed',
        DEFAULT_SPEED,
      )

      if (!voiceConnection) {
        return message.say(
          `You must be in the same voice channel as the bot. (hint: !join to bring the bot to your channel).`,
        )
      }

      // announce
      await say(
        voiceConnection,
        `Hello, I'm one of the voices you can use for this bot. When I announce a phrase, I will sound like this.`,
        guildVoiceId,
        guildSpeed,
        {
          memberId: message.member.id,
          guildId: message.member.guild.id,
        }
      )
    } catch (err) {
      console.error(err)
    }
  }
}
