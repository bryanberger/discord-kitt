import path from 'path'
import fs from 'fs-extra'
import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import { SynthesizeSpeechInput } from 'aws-sdk/clients/polly'

const TMP_DIR = path.resolve(__dirname, '../tmp') // dist/tmp

// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: process.env.AWS_DEFAULT_REGION,
})

export default (text: string): Promise<string> => {
  const params: SynthesizeSpeechInput = {
    Text: text,
    Engine: 'standard',
    OutputFormat: 'mp3',
    VoiceId: 'Amy',
  }

  return new Promise((resolve, reject) => {
    Polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.error(err)
        reject()
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          const path = `${TMP_DIR}/${nanoid()}.mp3`
          try {
            fs.writeFile(path, data.AudioStream)
            resolve(path)
          } catch(err) {
            console.error(err)
            reject()
          }
        }
      }
    })
  })
}
