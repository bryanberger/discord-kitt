import fs from 'fs-extra'
import { StreamDispatcher, StreamOptions, VoiceBroadcast, VoiceConnection } from 'discord.js'

import synth from './synth'
import { Readable } from 'stream'

export const say = async (voiceConnection: VoiceConnection, text: string) => {
  let path: string = ''
  if (voiceConnection) {
    try {
      path = await synth(text)
      await play(voiceConnection, path)
      fs.unlinkSync(path)
    } catch (err) {
      if (path !== '') fs.unlinkSync(path)
      console.error(err)
    }
  }
}

export const play = (
  voiceConnection: VoiceConnection,
  input: VoiceBroadcast | Readable | string,
  options?: StreamOptions
) => {
  return new Promise((resolve, reject) => {
    const dispatcher: StreamDispatcher = voiceConnection.play(input, options)
    dispatcher.on('error', (err) => {
      console.error(err)
      reject(err)
    })
    dispatcher.on('finish', () => {
      console.log(`Played: ${input}`)
      dispatcher.destroy()
      resolve(input)
    })
  })
}
