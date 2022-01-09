import { StreamOptions, VoiceBroadcast, VoiceConnection } from 'discord.js'
import crypto from 'crypto'

import { synth } from './polly'
import { Readable } from 'stream'
import { VoiceId } from 'aws-sdk/clients/polly'
import { announcements } from './database'
import { getFileByKey, putFile } from './s3'

export type SayMetadataType = {
  memberId: string
  guildId: string
}

export const say = async (
  voiceConnection: VoiceConnection,
  text: string,
  voiceId: VoiceId,
  speed: number,
  metadata?: SayMetadataType,
) => {
  if (voiceConnection) {
    try {
      // Normalize text to lowercase
      // Create a file key as the md5 hash of VOICEID+SPEED+TEXT
      const keyBase = `${voiceId}-${speed}-${text}`.toLowerCase()
      const key = crypto.createHash('sha1').update(keyBase).digest('hex') + '.mp3'

      // Lookup to see if we have this phrase cached in S3
      const existingStream = await getFileByKey(key)

      // If it existingStream, play it directly
      if (existingStream) {
        // Play stream to VC
        await play(voiceConnection, existingStream)
      } else {
        // Else get a fresh synth from Polly
        const { passthrough, buffer } = await synth(text, voiceId, speed)

        // Play stream to VC
        await play(voiceConnection, passthrough)

        // Store synth in s3
        await putFile(key, buffer, metadata)
      }

      // Increment stats
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
