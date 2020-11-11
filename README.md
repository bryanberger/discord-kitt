# Discord Siri Bot

A `docker` container that runs the `Siri` Announcer Bot.

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
npm start
```
