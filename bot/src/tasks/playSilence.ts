import { botCache, client } from '..'
import { play } from '../lib/announce'
import { Time } from '../lib/constants'
import { Silence } from '../lib/silence'

// Hack for now, say a Silence in each open voice connection every 2 minutes
botCache.tasks.set(`silence`, {
  name: `silence`,
  interval: Time.MINUTE * 2,
  execute: async function () {
    if (!botCache.isReady) return
    
    if (client.voice.connections.size > 0) {
      console.log(
        `play Silence() in ${client.voice.connections.size} voice channel(s)`,
      )

      client.voice.connections.map(async (connection) => {
        await play(connection, new Silence(), { type: 'opus' })
        connection.setSpeaking(0)
      })
    }
  },
})
