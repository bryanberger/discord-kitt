import { Readable } from 'stream'

const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe])

export class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME)
    this.destroy()
  }
}
