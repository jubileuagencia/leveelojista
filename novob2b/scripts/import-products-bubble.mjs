#!/usr/bin/env node
// ============================================================================
// T5.0 — Importacao Base Real de Produtos (1014 itens do Bubble)
// ============================================================================
// Uso:
//   node scripts/import-products-bubble.mjs --dry-run     # Apenas simula
//   node scripts/import-products-bubble.mjs --commit       # Executa de verdade
//   node scripts/import-products-bubble.mjs --dry-run --verbose
//
// Requer:
//   - Migration 009 (product_variants) aplicada
//   - Variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env
//
// Agente: @data-engineer | Data: 2026-03-18
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// 1. Config & Args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const COMMIT = args.includes('--commit')
const VERBOSE = args.includes('--verbose')

if (!DRY_RUN && !COMMIT) {
  console.error('Uso: node scripts/import-products-bubble.mjs --dry-run | --commit')
  process.exit(1)
}

// Load .env manually (no dotenv dependency)
const envPath = resolve(PROJECT_ROOT, '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERRO: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nao encontrados no .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ---------------------------------------------------------------------------
// 2. Load Bubble Export
// ---------------------------------------------------------------------------
const EXPORT_PATH = resolve(PROJECT_ROOT, 'docs/export_All-Produtos-modified--_2026-03-11_14-43-10.json')
const rawData = JSON.parse(readFileSync(EXPORT_PATH, 'utf-8'))
console.log(`\n📦 Carregados ${rawData.length} produtos do Bubble export`)

// ---------------------------------------------------------------------------
// 3. Helpers
// ---------------------------------------------------------------------------

/** Parse decimal BR (virgula) para number */
function parseBR(val) {
  if (!val || typeof val !== 'string') return null
  const cleaned = val.trim().replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

/** Parse "sim"/"não"/empty para boolean */
function parseSim(val) {
  if (!val) return false
  return val.trim().toLowerCase() === 'sim'
}

/** Parse peso/qtd text como gramas. Ex: "300g" → 300, "500" → 500 */
function parseWeightGrams(pesoStr, qtdStr) {
  // Tenta peso por unidade primeiro (numerico em gramas)
  if (pesoStr && pesoStr.trim()) {
    const num = parseInt(pesoStr.trim(), 10)
    if (!isNaN(num) && num > 0) return num
  }
  // Tenta qtd por unidade (ex: "300g", "1kg", "500ml")
  if (qtdStr && qtdStr.trim()) {
    const match = qtdStr.trim().match(/^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l)?$/i)
    if (match) {
      let val = parseFloat(match[1].replace(',', '.'))
      const unit = (match[2] || '').toLowerCase()
      if (unit === 'kg' || unit === 'l') val *= 1000
      return Math.round(val)
    }
  }
  return null
}

/** Normaliza tipo_unidade do Bubble para nosso schema */
function normalizeUnitType(tipo) {
  const map = { 'KG': 'kg', 'UN': 'un', 'BJ': 'bj', 'PC': 'pc', 'CX': 'cx' }
  return map[(tipo || '').toUpperCase()] || 'un'
}

/** Gera label de exibicao para variante */
function makeUnitLabel(unitType, weightGrams) {
  const labels = { kg: 'Quilo', un: 'Unidade', bj: 'Bandeja', pc: 'Pacote', cx: 'Caixa' }
  let label = labels[unitType] || unitType.toUpperCase()
  if (weightGrams && unitType !== 'kg') {
    label += weightGrams >= 1000 ? ` ${(weightGrams / 1000).toFixed(1)}kg` : ` ${weightGrams}g`
  }
  return label
}

/** Fix Bubble CDN URL (add https:) */
function fixImageUrl(url) {
  if (!url || !url.trim()) return null
  let fixed = url.trim()
  if (fixed.startsWith('//')) fixed = 'https:' + fixed
  return fixed
}

// ---------------------------------------------------------------------------
// 4. Extract unique categories
// ---------------------------------------------------------------------------
const categorySet = new Set()
for (const item of rawData) {
  const cats = item['categorias_produto'] || ''
  if (cats.trim()) {
    for (const c of cats.split(' , ')) {
      const name = c.trim()
      if (name) categorySet.add(name)
    }
  }
}
const uniqueCategories = [...categorySet].sort()
console.log(`📂 ${uniqueCategories.length} categorias encontradas: ${uniqueCategories.join(', ')}`)

// ---------------------------------------------------------------------------
// 5. Map products
// ---------------------------------------------------------------------------
const report = { success: 0, errors: [], warnings: [], skipped: 0 }

const mappedProducts = rawData.map((item, idx) => {
  const nome = (item.nome || '').trim()
  if (!nome) {
    report.errors.push({ index: idx, reason: 'nome vazio', item })
    return null
  }

  const precoNovo = parseBR(item['preço novo'])
  if (precoNovo === null || precoNovo < 0) {
    report.warnings.push({ index: idx, nome, reason: `preco invalido: "${item['preço novo']}"` })
  }

  const unitType = normalizeUnitType(item.tipo_unidade)
  const weightGrams = parseWeightGrams(item['peso por unidade'], item['qtd por unidade'])

  // Categorias (split multi-valor)
  const cats = (item['categorias_produto'] || '').trim()
  const categoryNames = cats ? cats.split(' , ').map(c => c.trim()).filter(Boolean) : []

  // Variante primaria
  const primaryVariant = {
    unit_type: unitType,
    unit_label: makeUnitLabel(unitType, weightGrams),
    unit_price: precoNovo || 0,
    weight_grams: weightGrams,
    allows_fractional: unitType === 'kg',
    is_default: true,
    sort_order: 0
  }

  // Variante secundaria: preco por KG (quando disponivel e diferente da primaria)
  const precoKg = parseBR(item['preço por kg'])
  const variants = [primaryVariant]

  if (precoKg && precoKg > 0 && unitType !== 'kg') {
    variants.push({
      unit_type: 'kg',
      unit_label: 'Quilo',
      unit_price: precoKg,
      weight_grams: null,
      allows_fractional: true,
      is_default: false,
      sort_order: 1
    })
  }

  const originalPrice = parseBR(item['preço antigo'])
  const desconto = parseBR(item.desconto)

  return {
    // Products fields
    name: nome,
    description: (item['descriçao'] || '').trim() || null,
    price: precoNovo || 0,
    unit: unitType,
    image_url: fixImageUrl(item.foto),
    is_active: parseSim(item.visivel),
    sku: (item.cod || '').trim() || null,
    ean: (item.ean || '').trim() || null,
    original_price: originalPrice,
    nutritional_info: (item['info nutricional'] || '').trim() || null,
    storage_instructions: (item['como armazenar'] || '').trim() || null,
    on_sale: parseSim(item['em oferta']),
    sale_discount_pct: (desconto && desconto > 0 && desconto <= 100) ? Math.round(desconto * 100) / 100 : null,
    sort_order: parseInt(item.ordem_prateleira, 10) || 0,
    // Metadata for import
    _categoryNames: categoryNames,
    _variants: variants,
    _bubbleId: item['unique id'] || null
  }
}).filter(Boolean)

console.log(`\n✅ ${mappedProducts.length} produtos mapeados`)
console.log(`❌ ${report.errors.length} erros`)
console.log(`⚠️  ${report.warnings.length} warnings`)

// ---------------------------------------------------------------------------
// 6. Dry-Run Report
// ---------------------------------------------------------------------------
if (DRY_RUN) {
  // Stats
  const byUnit = {}
  const byCategory = {}
  let withVariantKg = 0
  let totalVariants = 0

  for (const p of mappedProducts) {
    const ut = p.unit
    byUnit[ut] = (byUnit[ut] || 0) + 1
    for (const cat of p._categoryNames) {
      byCategory[cat] = (byCategory[cat] || 0) + 1
    }
    totalVariants += p._variants.length
    if (p._variants.length > 1) withVariantKg++
  }

  const activeCount = mappedProducts.filter(p => p.is_active).length
  const inactiveCount = mappedProducts.length - activeCount
  const withImage = mappedProducts.filter(p => p.image_url).length
  const withSku = mappedProducts.filter(p => p.sku).length
  const withEan = mappedProducts.filter(p => p.ean).length
  const onSale = mappedProducts.filter(p => p.on_sale).length

  const reportText = `# Relatorio de Importacao — DRY RUN
**Data:** ${new Date().toISOString()}
**Fonte:** Bubble export (${rawData.length} registros)

## Resumo
| Metrica | Valor |
|---------|-------|
| Total de produtos | ${mappedProducts.length} |
| Ativos (visivel=sim) | ${activeCount} |
| Inativos | ${inactiveCount} |
| Com imagem | ${withImage} |
| Com SKU | ${withSku} |
| Com EAN | ${withEan} |
| Em oferta | ${onSale} |
| Total de variantes | ${totalVariants} |
| Produtos com variante KG extra | ${withVariantKg} |
| Categorias unicas | ${uniqueCategories.length} |

## Por Tipo de Unidade
${Object.entries(byUnit).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- **${k.toUpperCase()}**: ${v}`).join('\n')}

## Por Categoria
${Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}

## Categorias a Criar
${uniqueCategories.map(c => `- ${c}`).join('\n')}

## Erros (${report.errors.length})
${report.errors.length === 0 ? 'Nenhum erro.' : report.errors.map(e => `- [${e.index}] ${e.reason}`).join('\n')}

## Warnings (${report.warnings.length})
${report.warnings.length === 0 ? 'Nenhum warning.' : report.warnings.slice(0, 20).map(w => `- [${w.index}] ${w.nome}: ${w.reason}`).join('\n')}
${report.warnings.length > 20 ? `\n... e mais ${report.warnings.length - 20} warnings` : ''}

## Amostra (5 primeiros produtos)
${mappedProducts.slice(0, 5).map(p => `
### ${p.name}
- SKU: ${p.sku || '—'} | EAN: ${p.ean || '—'}
- Preco: R$${p.price.toFixed(2)} | Original: ${p.original_price ? 'R$' + p.original_price.toFixed(2) : '—'}
- Unidade: ${p.unit} | Ativo: ${p.is_active ? 'sim' : 'nao'}
- Categorias: ${p._categoryNames.join(', ') || '—'}
- Variantes: ${p._variants.map(v => v.unit_type + ' R$' + v.unit_price.toFixed(2) + (v.weight_grams ? ' ' + v.weight_grams + 'g' : '')).join(' | ')}
- Imagem: ${p.image_url ? 'sim' : 'nao'}
`).join('')}
`

  const reportPath = resolve(PROJECT_ROOT, 'docs/relatorio-importacao-dry-run.md')
  writeFileSync(reportPath, reportText, 'utf-8')
  console.log(`\n📝 Relatorio salvo em: docs/relatorio-importacao-dry-run.md`)
  console.log('\n🔒 DRY RUN — nenhum dado foi alterado no banco.')
  process.exit(0)
}

// ---------------------------------------------------------------------------
// 7. COMMIT — Executa importacao real
// ---------------------------------------------------------------------------
if (COMMIT) {
  console.log('\n🚀 MODO COMMIT — Importando para o Supabase...\n')

  // 7.1 Limpar dados existentes (protege produtos com pedidos vinculados)
  console.log('🗑️  Limpando product_variants existentes...')
  const { error: delVariants } = await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delVariants) console.warn('  Aviso ao limpar variants:', delVariants.message)

  // Identificar produtos que TEM order_items (nao podem ser deletados por FK)
  console.log('🔍 Identificando produtos com pedidos vinculados...')
  const { data: usedProducts } = await supabase
    .from('order_items')
    .select('product_id')
  const usedProductIds = new Set((usedProducts || []).map(oi => oi.product_id))
  console.log(`  ${usedProductIds.size} produtos com pedidos (serao preservados/desativados)`)

  // Deletar produtos SEM pedidos vinculados
  console.log('🗑️  Limpando products sem pedidos...')
  const { data: allProducts } = await supabase.from('products').select('id')
  const deletableIds = (allProducts || []).map(p => p.id).filter(id => !usedProductIds.has(id))

  if (deletableIds.length > 0) {
    // Deletar em lotes de 100
    for (let i = 0; i < deletableIds.length; i += 100) {
      const batch = deletableIds.slice(i, i + 100)
      await supabase.from('products').delete().in('id', batch)
    }
    console.log(`  ✅ ${deletableIds.length} produtos removidos`)
  }

  // Desativar produtos com pedidos (soft delete)
  if (usedProductIds.size > 0) {
    const usedArr = [...usedProductIds]
    await supabase.from('products').update({ is_active: false, deleted_at: new Date().toISOString() }).in('id', usedArr)
    console.log(`  ⚠️  ${usedProductIds.size} produtos com pedidos desativados (soft delete)`)
  }

  // 7.2 Criar/buscar categorias
  console.log('📂 Sincronizando categorias...')
  const categoryMap = {} // name → id

  // Buscar existentes
  const { data: existingCats } = await supabase.from('categories').select('id, name')
  for (const cat of (existingCats || [])) {
    categoryMap[cat.name] = cat.id
  }

  // Criar faltantes
  const missingCats = uniqueCategories.filter(c => !categoryMap[c])
  if (missingCats.length > 0) {
    const { data: newCats, error: catErr } = await supabase
      .from('categories')
      .upsert(missingCats.map(name => ({ name })), { onConflict: 'name' })
      .select('id, name')

    if (catErr) {
      console.error('ERRO ao criar categorias:', catErr.message)
      process.exit(1)
    }
    for (const cat of (newCats || [])) {
      categoryMap[cat.name] = cat.id
    }
  }
  console.log(`  ✅ ${Object.keys(categoryMap).length} categorias no mapa`)

  // 7.3 Inserir produtos em lotes
  const BATCH_SIZE = 50
  let importedCount = 0
  let variantCount = 0

  for (let i = 0; i < mappedProducts.length; i += BATCH_SIZE) {
    const batch = mappedProducts.slice(i, i + BATCH_SIZE)

    // Preparar rows de products (sem metadados internos)
    const productRows = batch.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      unit: p.unit,
      image_url: p.image_url,
      category_id: p._categoryNames[0] ? categoryMap[p._categoryNames[0]] || null : null,
      is_active: p.is_active,
      sku: p.sku,
      ean: p.ean,
      original_price: p.original_price,
      nutritional_info: p.nutritional_info,
      storage_instructions: p.storage_instructions,
      on_sale: p.on_sale,
      sale_discount_pct: p.sale_discount_pct,
      sort_order: p.sort_order
    }))

    const { data: inserted, error: insertErr } = await supabase
      .from('products')
      .insert(productRows)
      .select('id, name, sku')

    if (insertErr) {
      console.error(`ERRO no lote ${i}-${i + batch.length}:`, insertErr.message)
      report.errors.push({ index: i, reason: insertErr.message })
      continue
    }

    // 7.4 Inserir variantes para cada produto do lote
    const variantRows = []
    for (let j = 0; j < inserted.length; j++) {
      const productId = inserted[j].id
      const variants = batch[j]._variants

      for (const v of variants) {
        variantRows.push({
          product_id: productId,
          unit_type: v.unit_type,
          unit_label: v.unit_label,
          unit_price: v.unit_price,
          weight_grams: v.weight_grams,
          allows_fractional: v.allows_fractional,
          is_default: v.is_default,
          sort_order: v.sort_order
        })
      }
    }

    if (variantRows.length > 0) {
      const { error: varErr } = await supabase.from('product_variants').insert(variantRows)
      if (varErr) {
        console.error(`ERRO variantes lote ${i}:`, varErr.message)
        report.errors.push({ index: i, reason: `variants: ${varErr.message}` })
      } else {
        variantCount += variantRows.length
      }
    }

    importedCount += inserted.length
    const pct = Math.round((importedCount / mappedProducts.length) * 100)
    process.stdout.write(`\r  Importando... ${importedCount}/${mappedProducts.length} (${pct}%) — ${variantCount} variantes`)
  }

  console.log('\n')

  // 7.5 Reset sequence display_id
  const { error: seqErr } = await supabase.rpc('query', {
    sql: `SELECT setval('products_display_id_seq', (SELECT COALESCE(MAX(display_id), 0) FROM products));`
  }).maybeSingle()
  if (seqErr && VERBOSE) console.warn('  Aviso ao resetar sequence:', seqErr.message)

  // 7.6 Relatorio final
  const finalReport = `# Relatorio de Importacao — COMMIT
**Data:** ${new Date().toISOString()}

## Resultado
| Metrica | Valor |
|---------|-------|
| Produtos importados | ${importedCount} |
| Variantes criadas | ${variantCount} |
| Categorias sincronizadas | ${Object.keys(categoryMap).length} |
| Erros | ${report.errors.length} |

## Erros
${report.errors.length === 0 ? 'Nenhum erro.' : report.errors.map(e => `- [${e.index}] ${e.reason}`).join('\n')}
`

  const reportPath = resolve(PROJECT_ROOT, 'docs/relatorio-importacao-commit.md')
  writeFileSync(reportPath, finalReport, 'utf-8')

  console.log(`✅ Importacao concluida!`)
  console.log(`   ${importedCount} produtos | ${variantCount} variantes | ${Object.keys(categoryMap).length} categorias`)
  console.log(`📝 Relatorio: docs/relatorio-importacao-commit.md`)
  if (report.errors.length > 0) {
    console.log(`⚠️  ${report.errors.length} erros — verifique o relatorio`)
  }
}
