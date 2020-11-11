import { VoiceState } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say } from '../lib/announce'

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  client: CommandoClient,
) => {
  // Ignore Bots
  if (oldState.member.user.bot || newState.member.user.bot) {
    return
  }

  // Ignore Streaming State
  if (
    (!oldState.streaming && newState.streaming) ||
    (oldState.streaming && !newState.streaming) ||
    (!oldState.selfVideo && newState.selfVideo) ||
    (oldState.selfVideo && !newState.selfVideo)
  ) {
    return
  }

  const oldMember = oldState.member
  // const channel = newState.channel ?? oldState.channel
  const connections = client.voice.connections
  const connection = connections.get(oldState.guild.id)
  const username = oldMember.nickname || oldMember.user.username

  // const isBotInVoiceChannel = connections.some(
  //   (connection) => connection.channel === channel,
  // )

  // if (isBotInVoiceChannel) {
    let message: string = null

    if (!oldState.serverMute && newState.serverMute) {
      message = 'has been server muted'
    } else if (oldState.serverMute && !newState.serverMute) {
      message = 'has been server unmuted'
    } else if (!oldState.serverDeaf && newState.serverDeaf) {
      message = 'has been server deafened'
    } else if (oldState.serverDeaf && !newState.serverDeaf) {
      message = 'has been server undeafened'
    } else if (!oldState.deaf && newState.deaf === true) {
      message = 'has deafened'
    } else if (oldState.deaf && !newState.deaf) {
      message = 'has undeafened'
    } else if (!oldState.mute && newState.mute) {
      message = 'has muted'
    } else if (oldState.mute && !newState.mute) {
      message = 'has unmuted'
    } else if (
      newState.channel &&
      oldState.channel?.id !== newState.channel.id
    ) {
      message = 'has joined the channel'
    } else if (oldState.channel && !newState.channel) {
      message = 'has left the channel'
    }

    if (message !== null) {
      say(connection, `${username} ${message}`)
    }
  // }
}
