import { VoiceState } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say } from '../lib/announce'

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  client: CommandoClient,
) => {
  const oldMember = oldState.member
  const channel = newState.channel ?? oldState.channel
  const connections = client.voice.connections
  const connection = connections.get(oldState.guild.id)
  const username = oldMember.nickname || oldMember.user.username

  const isBotInVoiceChannel = connections.some(
    (connection) => connection.channel === channel,
  )

  // Ignore Bots
  if (oldState.member.user.bot || newState.member.user.bot) {
    return
  }

  if (isBotInVoiceChannel) {
    if (oldState.deaf === false && newState.deaf === true) {
      say(connection, `${username} has deafened`)
    } else if (oldState.deaf === true && newState.deaf === false) {
      say(connection, `${username} has undeafened`)
    } else if (oldState.mute === false && newState.mute === true) {
      say(connection, `${username} has muted`)
    } else if (oldState.mute === true && newState.mute === false) {
      say(connection, `${username} has unmuted`)
    } else if (newState.channel) {
      say(connection, `${username} has joined the channel`)
    } else if (oldState.channel) {
      say(connection, `${username} has left the channel`)
    }
  }
}
