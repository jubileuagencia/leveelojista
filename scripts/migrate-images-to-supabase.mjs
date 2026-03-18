#!/usr/bin/env node
// ============================================================================
// Migrar imagens do CDN Bubble → Supabase Storage (bucket: product-images)
// ============================================================================
// Uso:
//   node scripts/migrate-images-to-supabase.mjs --dry-run
//   node scripts/migrate-images-to-supabase.mjs --commit
//
// Agente: @data-engineer | Data: 2026-03-18
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const COMMIT = args.includes('--commit')
const CONCURRENCY = 5 // downloads simultaneos

if (!DRY_RUN && !COMMIT) {
  console.error('Uso: node scripts/migrate-images-to-supabase.mjs --dry-run | --commit')
  process.exit(1)
}

// Load .env
const envContent = readFileSync(resolve(PROJECT_ROOT, '.env'), 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRO: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY necessarios no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const BUCKET = 'product-images'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sanitize filename for storage */
function sanitizeFilename(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, '-') // caracteres especiais → hifen
    .replace(/-+/g, '-') // multiplos hifens
    .replace(/^-|-$/g, '') // trim hifens
    .toLowerCase()
}

/** Extract extension from URL */
function getExtension(url) {
  try {
    const pathname = new URL(url).pathname
    const ext = extname(pathname).split('?')[0].toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.jpg'
  } catch {
    return '.jpg'
  }
}

/** Download image as buffer */
async function downloadImage(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { 'User-Agent': 'novob2b-migration/1.0' }
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const buffer = await resp.arrayBuffer()
      const contentType = resp.headers.get('content-type') || 'image/jpeg'
      return { buffer: new Uint8Array(buffer), contentType }
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
}

/** Process N items concurrently */
async function processPool(items, concurrency, fn) {
  const results = []
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // Fetch products with Bubble CDN URLs
  console.log('🔍 Buscando produtos com imagens Bubble...')

  let allProducts = []
  let page = 0
  const PAGE_SIZE = 1000

  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, sku, image_url')
      .not('image_url', 'is', null)
      .like('image_url', '%bubble.io%')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (error) { console.error('Erro:', error.message); process.exit(1) }
    if (!data || data.length === 0) break
    allProducts = allProducts.concat(data)
    if (data.length < PAGE_SIZE) break
    page++
  }

  console.log(`📦 ${allProducts.length} produtos com imagens Bubble`)

  if (allProducts.length === 0) {
    console.log('✅ Nenhuma imagem para migrar.')
    process.exit(0)
  }

  // ---------------------------------------------------------------------------
  // DRY RUN
  // ---------------------------------------------------------------------------
  if (DRY_RUN) {
    console.log('\n🔒 DRY RUN — simulando migracao...\n')

    // Test download of first 3
    const sample = allProducts.slice(0, 3)
    for (const p of sample) {
      const url = p.image_url.startsWith('//') ? 'https:' + p.image_url : p.image_url
      try {
        const { buffer, contentType } = await downloadImage(url)
        const ext = getExtension(url)
        const filename = sanitizeFilename(p.sku || p.name) + ext
        console.log(`  ✅ ${p.name} → ${filename} (${(buffer.length / 1024).toFixed(1)}KB, ${contentType})`)
      } catch (err) {
        console.log(`  ❌ ${p.name} → ${err.message}`)
      }
    }

    console.log(`\n📊 Resumo dry-run:`)
    console.log(`  Total a migrar: ${allProducts.length}`)
    console.log(`  Concorrencia: ${CONCURRENCY} downloads simultaneos`)
    console.log(`  Bucket destino: ${BUCKET} (publico)`)
    console.log('\n🔒 Nenhum dado alterado.')
    process.exit(0)
  }

  // ---------------------------------------------------------------------------
  // COMMIT
  // ---------------------------------------------------------------------------
  console.log(`\n🚀 COMMIT — Migrando ${allProducts.length} imagens (${CONCURRENCY} simultaneas)...\n`)

  const stats = { success: 0, failed: 0, skipped: 0, errors: [] }

  await processPool(allProducts, CONCURRENCY, async (product, idx) => {
    const url = product.image_url.startsWith('//') ? 'https:' + product.image_url : product.image_url
    const ext = getExtension(url)
    const filename = sanitizeFilename(product.sku || product.name || product.id) + ext
    const storagePath = `products/${filename}`

    try {
      // Download
      const { buffer, contentType } = await downloadImage(url)

      // Upload to Supabase Storage (upsert)
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType,
          upsert: true
        })

      if (uploadErr) throw new Error(`Upload: ${uploadErr.message}`)

      // Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      const newUrl = urlData.publicUrl

      // Update product
      const { error: updateErr } = await supabase
        .from('products')
        .update({ image_url: newUrl })
        .eq('id', product.id)

      if (updateErr) throw new Error(`Update DB: ${updateErr.message}`)

      stats.success++
    } catch (err) {
      stats.failed++
      stats.errors.push({ name: product.name, sku: product.sku, error: err.message })
    }

    // Progress
    const total = stats.success + stats.failed + stats.skipped
    const pct = Math.round((total / allProducts.length) * 100)
    process.stdout.write(`\r  Progresso: ${total}/${allProducts.length} (${pct}%) — ✅ ${stats.success} ❌ ${stats.failed}`)
  })

  console.log('\n')

  // Report
  const reportText = `# Relatorio Migracao de Imagens
**Data:** ${new Date().toISOString()}

## Resultado
| Metrica | Valor |
|---------|-------|
| Total processado | ${stats.success + stats.failed} |
| Sucesso | ${stats.success} |
| Falha | ${stats.failed} |

## Erros (${stats.errors.length})
${stats.errors.length === 0 ? 'Nenhum.' : stats.errors.map(e => `- **${e.name}** (SKU: ${e.sku}): ${e.error}`).join('\n')}
`

  const reportPath = resolve(PROJECT_ROOT, 'docs/relatorio-migracao-imagens.md')
  writeFileSync(reportPath, reportText, 'utf-8')

  console.log(`✅ Migracao concluida! ${stats.success} imagens migradas.`)
  if (stats.failed > 0) console.log(`⚠️  ${stats.failed} falhas — ver docs/relatorio-migracao-imagens.md`)
  console.log(`📝 Relatorio: docs/relatorio-migracao-imagens.md`)
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1) })
