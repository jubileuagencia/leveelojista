import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DIST = join(__dirname, 'dist')

// Gzip/Brotli compression
app.use(compression())

// Security headers via Helmet + CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.supabase.co'],
        fontSrc: ["'self'"],
        connectSrc: [
          "'self'",
          'https://*.supabase.co',
          'https://viacep.com.br',
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
)

// Cache static assets (JS, CSS, images) — 1 year (Vite hashed filenames)
app.use(
  '/assets',
  express.static(join(DIST, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
)

// Serve other static files — 1 hour cache
app.use(express.static(DIST, { maxAge: '1h' }))

// SPA fallback — all non-file routes serve index.html (Express 5 syntax)
app.get('/{*splat}', (_req, res) => {
  res.sendFile(join(DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`novob2b server running on port ${PORT}`)
})
