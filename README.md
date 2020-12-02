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

```
chmox +x bin/start.sh
chmox +x bin/deploy.sh

./bin/start.sh
./bin/deploy.sh
```

### Locally

```
npm install
docker-compose up
```

### Custom Lexicons

Lexicons are XML/PLS files that describe pronunciation of specific words and phrases.
Custom lexicons can be uploaded here: https://console.aws.amazon.com/polly/home/Lexicons

and are references in `./bot/src/lib/constants.ts` under `LEXICONS`
