[![Discord Bots](https://discordbots.org/api/widget/status/530825629793517590.svg?noavatar=true)](https://discordbots.org/bot/530825629793517590)
[![Discord Chat](https://img.shields.io/discord/780563398026592268.svg)](https://discord.gg/8ZsAYZ8Smd)

# Kitt: A Discord Bot

A `docker` container that runs the `Kitt` Announcer Bot.

## Setup

1. Copy the `.env.example` to `.env`

```
cp .env.example .env
```

2. Configure your `DISCORD_TOKEN` (obtained via discord)

## Install

Run via Docker, or locally via npm

### Docker

### Development

Uses local `bot/src` so any changes made will cause the process to restart via nodemon.

```
docker-compose up
```

### Deploy

```
chmox +x bin/deploy.sh
./bin/deploy.sh
```

_note:_ Remember to remove containers if switching `NODE_ENV` from production to development and vice-versa, as the image needs to be rebuilt and avoid pruning devDependencies.

### Locally

```
npm install
docker-compose up
```

if you add a new npm package, run `docker-compose up --build` to rebuild the container while testing

### Custom Lexicons

Lexicons are XML/PLS files that describe pronunciation of specific words and phrases.
Custom lexicons can be uploaded here: https://console.aws.amazon.com/polly/home/Lexicons

and are references in `./bot/src/lib/constants.ts` under `LEXICONS`
