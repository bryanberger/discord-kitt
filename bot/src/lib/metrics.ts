/**
 * Prometheus Logging Types:
 *
 * Counter: cumulative metric that represents a single numerical value that only ever goes up
 * Gauge: represents a single numerical value that can arbitrarily go up and down
 * Histogram: samples observations and counts them in configurable buckets
 * Summary: similar to a histogram, samples observations, it calculates configurable quantiles over a sliding time window
 */

import { Registry, Gauge, collectDefaultMetrics, Metric } from 'prom-client'

export const register = new Registry()

collectDefaultMetrics({ register })

export const guildTotal = new Gauge({
  name: 'guild_total',
  help: 'Total number of guilds',
  registers: [register],
})

export const voiceTotal = new Gauge({
  name: 'voice_total',
  help: 'Total number of voice connections',
  registers: [register],
})

export const joinPhraseTotal = new Gauge({
  name: 'join_phrase_total',
  help: 'Total number of join phrases added by users',
  registers: [register],
})

export const leavePhraseTotal = new Gauge({
  name: 'leave_phrase_total',
  help: 'Total number of leave phrases added by users',
  registers: [register],
})

export const announcementsTotal = new Gauge({
  name: 'announcement_phrase_total',
  help: 'Total number of announcements and phrases said',
  registers: [register],
})

// export default class Metrics {
//   private static instance: Metrics

//   private _guildTotal: Gauge<undefined
//   private _voiceTotal: Gauge<undefined>
//   private _joinPhraseTotal: Gauge<undefined>
//   private _leavePhraseTotal: Gauge<undefined>
//   private _announcementsTotal: Gauge<undefined>
//   private _register = new Registry()

//   constructor() {}

//   static getInstance() {
//     if (!Metrics.instance) {
//       Metrics.instance = new Metrics()
//       collectDefaultMetrics({ register: Metrics.instance._register })

//       Metrics.instance._guildTotal = new Gauge({
//         name: 'guild_total',
//         help: 'Total number of guilds',
//         registers: [Metrics.instance._register],
//       })

//       Metrics.instance._voiceTotal = new Gauge({
//         name: 'voice_total',
//         help: 'Total number of voice connections',
//         registers: [Metrics.instance._register],
//       })

//       Metrics.instance._joinPhraseTotal = new Gauge({
//         name: 'join_phrase_total',
//         help: 'Total number of join phrases added by users',
//         registers: [Metrics.instance._register],
//       })

//       Metrics.instance._leavePhraseTotal = new Gauge({
//         name: 'leave_phrase_total',
//         help: 'Total number of leave phrases added by users',
//         registers: [Metrics.instance._register],
//       })

//       Metrics.instance._announcementsTotal = new Gauge({
//         name: 'announcement_phrase_total',
//         help: 'Total number of announcements and phrases said',
//         registers: [Metrics.instance._register],
//       })
//     }
//     return Metrics.instance
//   }

//   get guildTotal() {
//     return this._guildTotal
//   }
// }
