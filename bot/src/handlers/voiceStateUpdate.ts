import { VoiceState } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say, play } from '../lib/announce'
import { channels, getPhraseForMember } from '../lib/database'
import { Silence } from '../lib/silence'
import {
  DEFAULT_JOIN_MESSAGE,
  DEFAULT_LEAVE_MESSAGE,
  DEFAULT_VOICE_ID,
} from '../lib/constants'
import { isBotInChannel } from '../lib/utils'

export default async (
  oldState: VoiceState,
  newState: VoiceState,
  client: CommandoClient,
) => {
  const connections = client.voice.connections
  const connection = connections.get(oldState.guild.id)
  const username = oldState.member.nickname || oldState.member.user.username
  const guildVoiceId = client.provider.get(
    newState.guild.id,
    'voiceId',
    DEFAULT_VOICE_ID,
  )

  let message: string = null

  // Self
  if (oldState.member.id && newState.member.id === client.user.id) {
    await channels.set('count', connections.size)

    if (!oldState.channel && newState.channel) {
      console.log('bot join')
      // join, discord api does this already, but it seems to need it
      // await sleep(1000)
      await play(connection, new Silence(), { type: 'opus' })
      connection.setSpeaking(0)
      await channels.set(newState.channel.id, true)
    } else if (!newState.channel) {
      console.log('bot leave')
      // leave
      await channels.delete(oldState.channel.id)
    } else if (oldState.channelID !== newState.channelID) {
      // move
      console.log('bot move')
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

  // Events to be spoken in the same channel
  if (oldState.channelID === newState.channelID) {
    console.log('same channel event')
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
      return await say(connection, `${username} ${message}`, guildVoiceId)
    }

    return
  }

  /**
   * Channels changed between states
   * Check see if we should play a `join` or `leave` message
   * Check if the user has a custom message in the DB, if not play default
   */
  if (newState.channel && isBotInChannel(connections, newState.channel)) {
    console.log('user join')
    message =
      (await getPhraseForMember({
        guildId: newState.guild.id,
        memberId: newState.member.id,
        type: 'join',
      })) ??
      client.provider.get(newState.guild.id, 'join', DEFAULT_JOIN_MESSAGE)
  } else if (
    oldState.channel &&
    isBotInChannel(connections, oldState.channel)
  ) {
    console.log('user leave')
    message =
      (await getPhraseForMember({
        guildId: oldState.guild.id,
        memberId: oldState.member.id,
        type: 'leave',
      })) ??
      client.provider.get(newState.guild.id, 'leave', DEFAULT_LEAVE_MESSAGE)
  }

  if (message !== null) {
    return await say(connection, `${username} ${message}`, guildVoiceId)
  }
}
