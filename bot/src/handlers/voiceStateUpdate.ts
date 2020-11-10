import { VoiceConnection, VoiceState } from 'discord.js'

import { client } from '../client'
import { say } from '../lib/announce'

export default async (oldState: VoiceState, newState: VoiceState) => {
  // ignore bots
  if (oldState.member.user.bot) return

  // ignore self
  if (newState.member.id === client.user.id) return

  if (
    newState.channel &&
    client.voice.connections.some(
      (connection: VoiceConnection) => connection.channel === newState.channel,
    )
  ) {
    const voiceConnection = client.voice.connections.get(newState.guild.id)

    say(
      voiceConnection,
      `${newState.member.displayName} has joined the channel.`,
    )
  } else if (
    oldState.channel &&
    client.voice.connections.some(
      (connection: VoiceConnection) => connection.channel === oldState.channel,
    )
  ) {
    const voiceConnection = client.voice.connections.get(oldState.guild.id)
    say(voiceConnection, `${oldState.member.displayName} has left the channel.`)
  }
}
