import {
  StreamDispatcher,
  StreamOptions,
  VoiceBroadcast,
  VoiceConnection,
} from 'discord.js'

import { synth } from './polly'
import { Readable } from 'stream'
import { VoiceId } from 'aws-sdk/clients/polly'

export const say = async (
  voiceConnection: VoiceConnection,
  text: string,
  voiceId: VoiceId,
) => {
  if (voiceConnection) {
    try {
      const stream = await synth(text, voiceId)
      await play(voiceConnection, stream)
    } catch (err) {
      console.error(err)
    }
  }
}

export const play = (
  voiceConnection: VoiceConnection,
  input: VoiceBroadcast | Readable | string,
  options?: StreamOptions,
) => {
  return new Promise((resolve, reject) => {
    const dispatcher: StreamDispatcher = voiceConnection.play(input, options)
    dispatcher.on('error', (err) => {
      console.error(err)
      reject(err)
    })
    dispatcher.on('finish', () => {
      console.log('played synth')
      dispatcher.destroy()
      resolve(input)
    })
  })
}
