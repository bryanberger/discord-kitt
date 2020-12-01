require('dotenv').config({ path: '../.env' })

import path from 'path'
import { ShardingManager } from 'discord.js'
import { ensureDirectories } from './lib/directories'
import { startMetrics } from './lib/metrics'

// Initializers
ensureDirectories()
startMetrics()

/* eslint-disable no-console */

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  mode: 'worker',
})

manager.on('shardCreate', (shard) => {
  console.log(`----- SHARD ${shard.id} LAUNCHED -----`)
  shard
    .on('death', () => console.log(`----- SHARD ${shard.id} DIED -----`))
    .on('ready', () => console.log(`----- SHARD ${shard.id} READY -----`))
    .on('disconnect', () =>
      console.log(`----- SHARD ${shard.id} DISCONNECTED -----`),
    )
    .on('reconnecting', () =>
      console.log(`----- SHARD ${shard.id} RECONNECTING -----`),
    )
})

manager.spawn().catch(console.error)
