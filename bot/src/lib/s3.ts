// TODO: update aws sdk to v3
import S3, { GetObjectRequest, PutObjectRequest, Metadata } from 'aws-sdk/clients/s3'
import { PassThrough, Stream } from 'stream'
import lz4 from 'lz4'

import { SayMetadataType } from './announce'
import { awsRequests } from './database'

const s3 = new S3({
  region: process.env.AWS_DEFAULT_REGION,
  httpOptions: {
    timeout: 3000,
  }
})

export const putFile = async (key: string, audioStream: Buffer, metadata?: SayMetadataType): Promise<string|null> => {
  // LZ4 compress
  const compressedAudioStream = lz4.encode(audioStream, { highCompression: true })

  const params: PutObjectRequest = {
    Body: compressedAudioStream, 
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: key,
    // Automatically moves object to different access tiers to try and save money based on access usage of the object
    StorageClass: 'INTELLIGENT_TIERING',
  }

  if (metadata)
    params.Metadata = metadata

  try {
    await s3.upload(params).promise()

    const count: number = (await awsRequests.get('s3put')) || 0
    await awsRequests.set('s3put', count + 1)
  } catch(err) {
    console.log('error putting file to s3')
  }

  return null
}

export const getFileByKey = async (key: string): Promise<PassThrough|null> => {
  const params: GetObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }

  try {
    const body = (await (s3.getObject(params).promise())).Body as Buffer

    if(body) {
      const count: number = (await awsRequests.get('s3get')) || 0
      await awsRequests.set('s3get', count + 1)

      // LZ4 decompress
      const decompressedAudioStream = lz4.decode(body)
      const stream = new Stream.PassThrough()
      stream.end(decompressedAudioStream)
      return stream
    } else {
      return null
    }
  } catch(err) {
    // File doesn't exist (403)
  }

  return null
}