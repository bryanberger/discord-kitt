export const DEFAULT_JOIN_MESSAGE = 'has joined the channel'
export const DEFAULT_LEAVE_MESSAGE = 'has left the channel'
export const DEFAULT_VOICE_ID = 'Amy'
export const EVENTS = ['join', 'leave', 'mute', 'stream', 'bots']
export type EventsType = 'join' | 'leave' | 'mute' | 'stream' | 'bots'
export const DEFAULT_EVENTS = {
  'join': true,
  'leave': true,
  'mute': false,
  'stream': false,
  'bots': true,
}
export const MIN_CHARS = 10
export const MAX_CHARS = 140
export const WAIT = 8
