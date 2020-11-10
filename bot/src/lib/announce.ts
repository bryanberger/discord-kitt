import fs from 'fs-extra'
import { StreamDispatcher, VoiceConnection } from 'discord.js'

import synth from './synth'

export const say = async (voiceConnection: VoiceConnection, text: string) => {
  let path: string = ''
  try {
    path = await synth(text)
    await play(voiceConnection, path)
    fs.unlinkSync(path)
  } catch (err) {
    if (path !== '') fs.unlinkSync(path)
    console.error(err)
  }
}

const play = (voiceConnection: VoiceConnection, path: string) => {
  return new Promise((resolve, reject) => {
    const dispatcher: StreamDispatcher = voiceConnection.play(path)
    dispatcher.on('error', (err) => {
      reject(err)
    })
    dispatcher.on('finish', () => {
      console.log(`Played: ${path}`)
      dispatcher.destroy()
      resolve(path)
    })
  })
}
