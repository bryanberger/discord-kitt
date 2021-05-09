import { StreamOptions, VoiceBroadcast, VoiceConnection } from 'discord.js'

import { synth } from './polly'
import { Readable } from 'stream'
import { VoiceId } from 'aws-sdk/clients/polly'
import { announcements } from './database'

export const say = async (
  voiceConnection: VoiceConnection,
  text: string,
  voiceId: VoiceId,
  speed: number,
) => {
  if (voiceConnection) {
    try {
      const stream = await synth(text, voiceId, speed)
      await play(voiceConnection, stream)
      const count: number = (await announcements.get('count')) || 0
      await announcements.set('count', count + 1)
    } catch (err) {
      console.error(err)
    }
  }
}

export const play = async (
  voiceConnection: VoiceConnection,
  input: VoiceBroadcast | Readable | string,
  options?: StreamOptions,
): Promise<void> => {
  if (voiceConnection) {
    voiceConnection.play(input, options)
    return Promise.resolve()
  } else {
    return Promise.reject('Client is not connected to the voice channel')
  }
}
