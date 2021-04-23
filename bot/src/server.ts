import express from 'express'
import { register } from './lib/metrics'

const app = express()
const port = process.env.PORT || 3001

/**
 * Start an express server and expose a `/metrics` route for Prometheus to consume.
 * @param client CommandoClient
 */
export default () => {
  app.get('/metrics', async (_, res) => {
    try {
      res.set('Content-Type', register.contentType)
      res.end(await register.metrics())
    } catch (err) {
      res.status(500).end(err)
    }
  })

  app.listen(port, () => {
    console.log(`Prometheus metric server listening on port ${port}!`)
  })
}
