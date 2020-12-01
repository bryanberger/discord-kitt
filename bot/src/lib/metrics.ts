/**
 * Prometheus Logging Types:
 *
 * Counter: cumulative metric that represents a single numerical value that only ever goes up
 * Gauge: represents a single numerical value that can arbitrarily go up and down
 * Histogram: samples observations and counts them in configurable buckets
 * Summary: similar to a histogram, samples observations, it calculates configurable quantiles over a sliding time window
 */

import express from 'express'
import Prometheus from 'prom-client'
import { channels, guilds, join, leave } from './database'

const { Gauge, register, collectDefaultMetrics } = Prometheus

const app = express()
const port = process.env.PORT || 3001
let timer = null

/** Include default metric */
collectDefaultMetrics()

/**
 * Metrics to log from the bot
 */
const guildTotal = new Gauge({
  name: 'guild_total',
  help: 'Total number of guilds',
})

const voiceTotal = new Gauge({
  name: 'voice_total',
  help: 'Total number of voice connections',
})

const joinPhraseTotal = new Gauge({
  name: 'join_phrase_total',
  help: 'Total number of join phrases added by users',
})

const leavePhraseTotal = new Gauge({
  name: 'leave_phrase_total',
  help: 'Total number of leave phrases added by users',
})

const updateMetrics = async () => {
  try {
    guildTotal.set(await guilds.get('count'))
    voiceTotal.set(await channels.get('count'))
    joinPhraseTotal.set(await join.get('count'))
    leavePhraseTotal.set(await leave.get('count'))
  } catch (err) {
    // value may possibly not exist yet
  }
}

/**
 * Start an express server and expose a `/metrics` route for Prometheus to consume.
 * @param client CommandoClient
 */
export const startMetrics = () => {
  app.get('/metrics', async (_, res) => {
    try {
      res.set('Content-Type', register.contentType)
      res.end(await register.metrics())
    } catch (err) {
      res.status(500).end(err)
    }
  })

  app.listen(port, () => {
    console.log(`[Prometheus metric server] Listening on port ${port}!`)
  })

  // Start: on init
  updateMetrics()

  // Setup a poll, every 15s
  timer = setInterval(updateMetrics, 15 * 1000)
}

/**
 * Gracefully terminate server on process exit
 */
// process.on('SIGTERM', () => {
//   server.close((err) => {
//     if (err) {
//       console.error(err)
//       process.exit(1)
//     }

//     process.exit(0)
//   })
// })
