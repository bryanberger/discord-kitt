import {
  Collection,
  VoiceChannel,
  VoiceConnection,
  VoiceState,
} from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say } from '../lib/announce'
import { channels, getPhraseForMember } from '../lib/database'
import { Silence } from '../lib/silence'

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  client: CommandoClient,
) => {
  const connections = client.voice.connections
  const connection = connections.get(oldState.guild.id)
  const username = oldState.member.nickname || oldState.member.user.username
  let message: string = null

  // Self
  if(oldState.member.id || newState.member.id === client.user.id) {
    if(!oldState.channel && newState.channel) {
      // join
      connection.play(new Silence(), { type: 'opus' })
      connection.setSpeaking(0)
      await channels.set(newState.channel.id, true)
    } else if(!newState.channel) {
      // leave
      await channels.delete(oldState.channel.id)
    } else if(oldState.channelID !== newState.channelID) {
      // move
      await channels.delete(oldState.channel.id)
      await channels.set(newState.channel.id, true)
    }
    return
  }

  // Ignore other Bots
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

  /**
   * Channels changed between states
   * Check see if we should play a `join` or `leave` message
   * Check if the user has a custom message in the DB, if not play default
   */
  if (newState.channel && isBotInChannel(connections, newState.channel)) {
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
