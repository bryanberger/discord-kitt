import { VoiceState } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

import { say, play } from '../lib/announce'
import { channels, getPhraseForMember } from '../lib/database'
import { Silence } from '../lib/silence'
import {
  DEFAULT_EVENTS,
  DEFAULT_JOIN_MESSAGE,
  DEFAULT_LEAVE_MESSAGE,
  DEFAULT_SPEED,
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
  const guildSpeed = client.provider.get(newState.guild.id, 'speed', DEFAULT_SPEED)
  const announceJoin = client.provider.get(newState.guild.id, 'join', DEFAULT_EVENTS.join)
  const announceLeave = client.provider.get(newState.guild.id, 'leave', DEFAULT_EVENTS.leave)
  const announceBots = client.provider.get(newState.guild.id, 'bots', DEFAULT_EVENTS.bots)
  const announceMute = client.provider.get(newState.guild.id, 'mute', DEFAULT_EVENTS.mute)
  const announceStream = client.provider.get(newState.guild.id, 'stream', DEFAULT_EVENTS.stream)

  let message: string = null

  // Self
  if (oldState.member.id && newState.member.id === client.user.id) {
    await channels.set('count', connections.size)

    if (!oldState.channel && newState.channel) {
      console.log('bot join')
      // KLUDGE: needed, otherwise green ring doesn't go away on join...
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

  // Other Bots
  if (!announceBots && (oldState.member.user.bot || newState.member.user.bot)) {
    return
  }

  // Events to be spoken in the same channel
  if (oldState.channelID === newState.channelID) {
    if(!isBotInChannel(connections, oldState.channel)) {
      return
    }

    if (announceMute && !oldState.serverMute && newState.serverMute) {
      message = 'has been server muted'
    } else if (announceMute && oldState.serverMute && !newState.serverMute) {
      message = 'has been server unmuted'
    } else if (announceMute && !oldState.serverDeaf && newState.serverDeaf) {
      message = 'has been server deafened'
    } else if (announceMute && oldState.serverDeaf && !newState.serverDeaf) {
      message = 'has been server undeafened'
    } else if (announceMute && !oldState.deaf && newState.deaf) {
      message = 'has deafened'
    } else if (announceMute && oldState.deaf && !newState.deaf) {
      message = 'has undeafened'
    } else if (announceMute && !oldState.mute && newState.mute) {
      message = 'has muted'
    } else if (announceMute && oldState.mute && !newState.mute) {
      message = 'has unmuted'
    } else if (announceStream && !oldState.streaming && newState.streaming) {
      message = 'has started streaming'
    } else if (announceStream && oldState.streaming && !newState.streaming) {
      message = 'has stopped streaming'
    } else if (announceStream && !oldState.selfVideo && newState.selfVideo) {
      message = 'has started sharing video'
    } else if (announceStream && oldState.selfVideo && !newState.selfVideo) {
      message = 'has stopped sharing video'
    }

    if (message !== null) {
      return await say(connection, `${username} ${message}`, guildVoiceId, guildSpeed)
    }

    return
  }

  /**
   * Channels changed between states
   * Check see if we should play a `join` or `leave` message
   * Check if the user has a custom message in the DB, if not play default
   */
  if (
    announceJoin &&
    newState.channel &&
    isBotInChannel(connections, newState.channel)
  ) {
    console.log('user join')
    message =
      (await getPhraseForMember({
        guildId: newState.guild.id,
        memberId: newState.member.id,
        type: 'join',
      })) ??
      client.provider.get(
        newState.guild.id,
        'defaultJoin',
        DEFAULT_JOIN_MESSAGE,
      )
  } else if (
    announceLeave &&
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
      client.provider.get(
        newState.guild.id,
        'defaultLeave',
        DEFAULT_LEAVE_MESSAGE,
      )
  }

  if (message !== null) {
    return await say(connection, `${username} ${message}`, guildVoiceId, guildSpeed)
  }
}
