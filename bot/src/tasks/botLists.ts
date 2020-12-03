import fetch from 'node-fetch'

import { botCache, client } from '..'
import { Time } from '../lib/constants'

botCache.tasks.set(`botlists`, {
  name: `botlists`,
  interval: Time.HOUR,
  execute: async function () {
    const { botListTokens, botId, isReady } = botCache

    if (!isReady || process.env.NODE_ENV !== 'production') return

    const totalUsers = client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b, 0)
    const totalGuilds = client.guilds.cache.size
    const totalVoiceConnections = client.voice.connections.size
    const botLists = [
      {
        name: 'discordbots.co',
        url: `https://api.discordbots.co/v1/public/bot/${botId}/stats`,
        token: botListTokens.DISCORD_BOTS_CO,
        data: { serverCount: totalGuilds },
      },
      {
        name: 'discordbots.gg',
        url: `https://discordbots.org/api/bots/${botId}/stats`,
        token: botListTokens.DISCORD_BOT_ORG,
        data: { server_count: totalGuilds },
      },
      {
        name: 'botsondiscord.xyz',
        url: `https://bots.ondiscord.xyz/bot-api/bots/${botId}/guilds`,
        token: botListTokens.BOTS_ON_DISCORD,
        data: { guildCount: totalGuilds },
      },
      {
        name: 'discordbotlist.com',
        url: `https://discordbotlist.com/api/v1/bots/${botId}/stats`,
        token: botListTokens.DISCORD_BOT_LIST,
        data: {
          guilds: totalGuilds,
          users: totalUsers,
          voice_connections: totalVoiceConnections,
        },
      },
      {
        name: 'botsfordiscord.com',
        url: `https://botsfordiscord.com/api/bot/${botId}`,
        token: botListTokens.BOTS_FOR_DISCORD,
        data: { server_count: totalGuilds },
      },
      {
        name: 'discord.boats',
        url: `https://discord.boats/api/bot/${botId}`,
        token: botListTokens.DISCORD_BOATS,
        data: { server_count: totalGuilds },
      },
      {
        name: 'discord.bots.gg',
        url: `https://discord.bots.gg/api/v1/bots/${botId}/stats`,
        token: botListTokens.DISCORD_BOTS_GG,
        data: { guildCount: totalGuilds },
      },
      {
        name: 'top.gg',
        url: `https://top.gg/api/bots/${botId}/stats`,
        token: botListTokens.TOP_GG,
        data: { server_count: totalGuilds },
      },
    ]

    // For each botlist we have we need to post
    for (const list of botLists) {
      if (!list.token) continue
      // Send update request to this bot list
      fetch(list.url, {
        method: 'post',
        headers: {
          Authorization: list.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(list.data),
      })
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            console.log(
              `Update bot lists: [${list.name}] ${totalGuilds} Guilds | ${totalUsers} Users`,
            )
          } else {
            console.error(`Unable to update bot list for ${list.name}`)
          }
        })
        .catch((err) => {
          console.error({ location: 'botlists file', err })
        })
    }
  },
})
