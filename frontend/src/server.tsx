import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { jsxRenderer } from 'hono/jsx-renderer'
import { logger } from 'hono/logger'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import routes
import { ipLookupRoutes } from './routes/ipLookup.js'

// Create Hono app
const app = new Hono()

// Add logger middleware
app.use('*', logger())

// Set up renderer
app.use('*', jsxRenderer())

// Serve static files
app.use('/assets/*', serveStatic({ root: './public' }))
app.use('/css/*', serveStatic({ root: './src/components' }))

// Mount routes
app.route('/', ipLookupRoutes)

// Default route
app.get('/', (c) => {
  return c.redirect('/lookup')
})

// Start the server
const port = process.env.PORT || 3002
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
