import Discord from 'discord.js'
import { AWSError } from 'aws-sdk'
import Polly, { SynthesizeSpeechInput, VoiceId } from 'aws-sdk/clients/polly'

import { PassThrough, Stream } from 'stream'
import { DEFAULT_SPEED, DEFAULT_VOICE_ID, LEXICONS } from './constants'
import { encodeStringForSSML } from './utils'
import { awsRequests } from './database'

// Create an Polly client
const polly = new Polly({
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
})

const languageCodes = []

export const voices = new Discord.Collection<string, AWS.Polly.Voice[]>()

export let numVoices = 0

export const synth = (
  text: string,
  voiceId?: VoiceId,
  speed?: number,
): Promise<{passthrough: PassThrough, buffer: Buffer}> => {
  const safeSsmlText = encodeStringForSSML(text)
  const ssmlText = `<speak><prosody rate="${
    speed || DEFAULT_SPEED
  }%">${safeSsmlText}</prosody></speak>`

  const params: SynthesizeSpeechInput = {
    Text: ssmlText,
    Engine: 'standard',
    OutputFormat: 'mp3',
    LexiconNames: LEXICONS,
    VoiceId: voiceId ?? DEFAULT_VOICE_ID,
    TextType: 'ssml',
    SampleRate: '16000',
  }

  return new Promise((resolve, reject) => {
    polly.synthesizeSpeech(params, async (err, data) => {
      const count: number = (await awsRequests.get('polly')) || 0
      await awsRequests.set('polly', count + 1)

      if (err) {
        console.error(err)
        reject(err)
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          const stream = new Stream.PassThrough()
          stream.end(data.AudioStream)
          resolve({ 
            passthrough: stream,
            buffer: data.AudioStream
          })
        }
      }
    })
  })
}

export const loadAndCacheVoices = () => {
  const cacheVoicesAndLangCodes = (
    err: AWSError,
    data: AWS.Polly.Types.DescribeVoicesOutput,
  ) => {
    if (err) {
      console.error(err.message)
      return
    }

    numVoices = data.Voices.length

    console.debug(`Number of voices: ${numVoices}`)

    if (!data.Voices) {
      console.error('No voices returned from Polly')
      return
    }

    for (let i = 0; i < numVoices; i++) {
      const voice = data.Voices[i]
      const key = voice.LanguageCode

      if (voices.has(key)) {
        voices.get(key).push(voice)
      } else {
        voices.set(key, [voice])
      }

      if (!languageCodes.includes(voice.LanguageCode.toLowerCase())) {
        languageCodes.push(voice.LanguageCode.toLowerCase())
      }
    }

    console.debug('Voices and codes loaded')
  }

  polly.describeVoices({ Engine: 'standard' }, cacheVoicesAndLangCodes)
}
