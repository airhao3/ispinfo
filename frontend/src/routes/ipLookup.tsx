/** @jsxImportSource hono/jsx' */

import { Hono } from 'hono'
import { html } from 'hono/html'
import { z } from 'zod'
import { validator } from 'hono/validator'
import { Layout } from '../components/Layout.js'
import { IPLookup } from '../components/HonoIPLookup.jsx'

export const ipLookupRoutes = new Hono()

// IP validation schema
const ipQuerySchema = z.object({
  ip: z.string().optional()
})

// Main lookup page
ipLookupRoutes.get('/lookup', async (c) => {
  const language = c.get('language') || 'en'
  const t = c.get('t')
  
  return c.render(
    <Layout title={t.ipLookupTitle} language={language}>
      <IPLookup t={t} language={language} />
    </Layout>
  )
})

// API endpoint to fetch IP data
ipLookupRoutes.post('/lookup', validator('form', (value, c) => {
  const result = ipQuerySchema.safeParse(value)
  if (!result.success) {
    return c.text('Invalid request', 400)
  }
  return result.data
}), async (c) => {
  const { ip } = c.req.valid('form')
  
  if (!ip) {
    return c.json({ error: 'IP address is required' }, 400)
  }

  // Validate IP format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    return c.json({ error: 'Invalid IP address format' }, 400)
  }

  try {
    // Fetch IP data from API
    const response = await fetch(`https://api.ispinfo.io/lookup/${ip}`)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    
    const data = await response.json()
    return c.json(data)
  } catch (error) {
    console.error('Error fetching IP data:', error)
    return c.json({ error: 'Failed to fetch IP data' }, 500)
  }
})

// Language switching endpoint
ipLookupRoutes.post('/language/:lang', (c) => {
  const lang = c.req.param('lang')
  
  if (lang !== 'en' && lang !== 'zh') {
    return c.text('Invalid language', 400)
  }
  
  c.cookie('language', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  })
  
  return c.redirect('/lookup')
})
