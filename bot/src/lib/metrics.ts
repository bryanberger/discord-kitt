/**
 * Prometheus Logging Types:
 *
 * Counter: cumulative metric that represents a single numerical value that only ever goes up
 * Gauge: represents a single numerical value that can arbitrarily go up and down
 * Histogram: samples observations and counts them in configurable buckets
 * Summary: similar to a histogram, samples observations, it calculates configurable quantiles over a sliding time window
 */

import { Registry, Gauge, collectDefaultMetrics } from 'prom-client'
import camelCase from 'camelcase'

type CommandCounterType = {
  [key: string]: Gauge<string>
}

export const commandCounters:CommandCounterType = {}
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

export const setupCommandCounters = (commandNames: string[]) => {
  commandNames.forEach(command => {
    console.log('Creating Command Counter for', command)
    const counter = new Gauge({
      name: `${camelCase(command)}Total`,
      help: `Total number of ${command} commands run`,
      registers: [register]
    })

    // Store for use in the `updateMetrics` task
    commandCounters[command] = counter
  })
}