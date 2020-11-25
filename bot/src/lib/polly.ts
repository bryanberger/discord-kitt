import AWS, { AWSError } from 'aws-sdk'
import Discord from 'discord.js'
import { SynthesizeSpeechInput, VoiceId } from 'aws-sdk/clients/polly'
import { PassThrough, Stream } from 'stream'
import { DEFAULT_VOICE_ID } from './constants'

// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
})

const languageCodes = []

export const voices = new Discord.Collection<string, AWS.Polly.Voice[]>()

export const synth = (text: string, voiceId?: VoiceId): Promise<PassThrough> => {
  const params: SynthesizeSpeechInput = {
    Text: text,
    Engine: 'standard',
    OutputFormat: 'mp3',
    VoiceId: voiceId ?? DEFAULT_VOICE_ID,
  }

  return new Promise((resolve, reject) => {
    Polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          const stream = new Stream.PassThrough()
          stream.end(data.AudioStream)
          resolve(stream)
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

    console.debug(`Number of voices: ${data.Voices.length}`)

    if (!data.Voices) {
      console.error('No voices returned from Polly')
      return
    }

    for (let i = 0; i < data.Voices.length; i++) {
      const voice = data.Voices[i]
      const key = voice.LanguageCode
      const isStandard = voice.SupportedEngines.includes('standard')

      if(!isStandard) continue

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

  Polly.describeVoices({}, cacheVoicesAndLangCodes)
}
