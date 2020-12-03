import { botCache } from '..'
import { Time } from '../lib/constants'
import { announcements, channels, guilds, join, leave } from '../lib/database'
import {
  announcementsTotal,
  guildTotal,
  joinPhraseTotal,
  leavePhraseTotal,
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
    } catch (err) {
      // value may possibly not exist yet
    }
  },
})
