import {
  Collection,
  VoiceChannel,
  VoiceConnection,
  VoiceState,
} from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say } from '../lib/announce'
import { getPhraseForMember } from '../lib/database'

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

  const connections = client.voice.connections
  const connection = connections.get(oldState.guild.id)
  const username = oldState.member.nickname || oldState.member.user.username
  // const channel = newState.channel ?? oldState.channel

  let message: string = null

  // Events to be spoken in the bot's channe
  if (oldState.channelID === newState.channelID) {
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
    }

    if (message !== null) {
      return await say(connection, `${username} ${message}`)
    }
  }

  if (newState.channel && isBotInChannel(connections, newState.channel)) {
    console.log('join')
    // Check see if this user has a custom `join` message for this guild
    const customMessage = await getPhraseForMember({
      guildId: newState.guild.id,
      memberId: newState.member.id,
      type: 'join',
    })
    message = customMessage ?? 'has joined the channel'
  } else if (
    oldState.channel &&
    isBotInChannel(connections, oldState.channel)
  ) {
    console.log('leave')
    // Check see if this user has a custom `leave` message for this guild
    const customMessage = await getPhraseForMember({
      guildId: oldState.guild.id,
      memberId: oldState.member.id,
      type: 'leave',
    })
    message = customMessage ?? 'has left the channel'
  }

  if (message !== null) {
    return await say(connection, `${username} ${message}`)
  }
}

const isBotInChannel = (
  connections: Collection<string, VoiceConnection>,
  channel: VoiceChannel,
) => {
  return connections.some((connection) => connection.channel.id === channel.id)
}
