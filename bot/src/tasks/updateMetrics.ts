import { botCache } from '..'
import { Time } from '../lib/constants'
import { announcements, awsRequests, channels, commands, guilds, join, leave } from '../lib/database'
import {
  announcementsTotal,
  commandCounters,
  guildTotal,
  joinPhraseTotal,
  leavePhraseTotal,
  awsS3PutRequestTotal,
  awsS3GetRequestTotal,
  awsPollyRequestTotal,
  voiceTotal,
} from '../lib/metrics'

botCache.tasks.set(`updateMetrics`, {
  name: `updateMetrics`,
  interval: Time.SECOND * 15,
  execute: async function () {
    try {
      guildTotal.set(await guilds.get('count'))
      voiceTotal.set(await channels.get('count'))
      joinPhraseTotal.set(await join.get('count'))
      leavePhraseTotal.set(await leave.get('count'))
      announcementsTotal.set(await announcements.get('count'))
      awsS3PutRequestTotal.set(await awsRequests.get('s3put'))
      awsS3GetRequestTotal.set(await awsRequests.get('s3get'))
      awsPollyRequestTotal.set(await awsRequests.get('polly'))

      // Command Counters
      Object.entries(commandCounters).map(async ([key, value]) => {
        value.set(await commands.get(key) || 0)
      })
    } catch (err) {
      // value may possibly not exist yet
    }
  },
})
