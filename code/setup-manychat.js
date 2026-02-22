/**
 * Setup ManyChat — Spoiler Astrológico da Semana
 * Creates custom fields, tags, and bot fields for the weekly funnel
 *
 * Usage: node code/setup-manychat.js
 *
 * Requires MANYCHAT_API_TOKEN in .env
 */

const https = require('https');
const path = require('path');

// Load token from .env or command line
let API_TOKEN = process.argv[2] || '';
if (!API_TOKEN) {
  try {
    const envContent = require('fs').readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const match = envContent.match(/MANYCHAT_API_TOKEN=(.+)/);
    if (match) API_TOKEN = match[1].trim();
  } catch (e) {}
}

if (!API_TOKEN) {
  console.error('Usage: node code/setup-manychat.js <MANYCHAT_API_TOKEN>');
  console.error('Or set MANYCHAT_API_TOKEN in .env');
  process.exit(1);
}

const BASE_URL = 'api.manychat.com';

function apiCall(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: endpoint,
      method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());
        resolve(data);
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// CUSTOM FIELDS — for weekly interpretation updates
// ============================================================

const CUSTOM_FIELDS = [
  { name: 'tema_semana', type: 'text', description: 'Tema astrológico da semana (ex: Lua Nova em Peixes)' },
  { name: 'ascendente', type: 'text', description: 'Signo ascendente do contato' },
  { name: 'interp_aries', type: 'text', description: 'Interpretação semanal para Áries' },
  { name: 'interp_touro', type: 'text', description: 'Interpretação semanal para Touro' },
  { name: 'interp_gemeos', type: 'text', description: 'Interpretação semanal para Gêmeos' },
  { name: 'interp_cancer', type: 'text', description: 'Interpretação semanal para Câncer' },
  { name: 'interp_leao', type: 'text', description: 'Interpretação semanal para Leão' },
  { name: 'interp_virgem', type: 'text', description: 'Interpretação semanal para Virgem' },
  { name: 'interp_libra', type: 'text', description: 'Interpretação semanal para Libra' },
  { name: 'interp_escorpiao', type: 'text', description: 'Interpretação semanal para Escorpião' },
  { name: 'interp_sagitario', type: 'text', description: 'Interpretação semanal para Sagitário' },
  { name: 'interp_capricornio', type: 'text', description: 'Interpretação semanal para Capricórnio' },
  { name: 'interp_aquario', type: 'text', description: 'Interpretação semanal para Aquário' },
  { name: 'interp_peixes', type: 'text', description: 'Interpretação semanal para Peixes' },
];

// ============================================================
// TAGS — for funnel tracking
// ============================================================

const TAGS = [
  'spoiler-caminho-a',
  'spoiler-caminho-b',
  'spoiler-clicou-camarin',
  'spoiler-clicou-curso',
  'spoiler-remarketing',
  'spoiler-descobriu-signo',
];

// ============================================================
// BOT FIELDS — global fields for all subscribers
// ============================================================

const BOT_FIELDS = [
  { name: 'tema_semana_global', type: 'text', description: 'Tema da semana (bot-level)' },
  { name: 'link_camarin', type: 'text', description: 'Link LP Camarin com UTM' },
  { name: 'link_curso', type: 'text', description: 'Link LP Curso com UTM' },
];

async function main() {
  console.log('=== ManyChat Setup — Spoiler Astrológico da Semana ===\n');

  // Test connection
  console.log('Testing API connection...');
  const pageInfo = await apiCall('GET', '/fb/page/getInfo');
  if (pageInfo.status === 'error') {
    console.error('API Error:', pageInfo.message);
    console.error('\nPossible issues:');
    console.error('1. Token is invalid — re-copy from ManyChat > Settings > Dev Tools');
    console.error('2. ManyChat Pro is required for API access');
    console.error('3. The token may have expired');
    process.exit(1);
  }
  console.log(`Connected to page: ${pageInfo.data?.name || 'OK'}\n`);

  // Get existing custom fields
  console.log('Checking existing custom fields...');
  const existingFields = await apiCall('GET', '/fb/page/getCustomFields');
  const existingFieldNames = (existingFields.data || []).map(f => f.name);

  // Create custom fields
  console.log('\n--- Creating Custom Fields ---');
  for (const field of CUSTOM_FIELDS) {
    if (existingFieldNames.includes(field.name)) {
      console.log(`  [SKIP] ${field.name} (already exists)`);
      continue;
    }
    const result = await apiCall('POST', '/fb/page/createCustomField', {
      caption: field.name,
      type: field.type,
      description: field.description,
    });
    if (result.status === 'success') {
      console.log(`  [OK] ${field.name} created`);
    } else {
      console.log(`  [ERR] ${field.name}: ${result.message}`);
    }
    await delay(150);
  }

  // Get existing tags
  console.log('\n--- Creating Tags ---');
  const existingTags = await apiCall('GET', '/fb/page/getTags');
  const existingTagNames = (existingTags.data || []).map(t => t.name);

  for (const tagName of TAGS) {
    if (existingTagNames.includes(tagName)) {
      console.log(`  [SKIP] ${tagName} (already exists)`);
      continue;
    }
    const result = await apiCall('POST', '/fb/page/createTag', { name: tagName });
    if (result.status === 'success') {
      console.log(`  [OK] ${tagName} created`);
    } else {
      console.log(`  [ERR] ${tagName}: ${result.message}`);
    }
    await delay(150);
  }

  // Create bot fields
  console.log('\n--- Creating Bot Fields ---');
  const existingBotFields = await apiCall('GET', '/fb/page/getBotFields');
  const existingBotFieldNames = (existingBotFields.data || []).map(f => f.name);

  for (const field of BOT_FIELDS) {
    if (existingBotFieldNames.includes(field.name)) {
      console.log(`  [SKIP] ${field.name} (already exists)`);
      continue;
    }
    const result = await apiCall('POST', '/fb/page/createBotField', {
      caption: field.name,
      type: field.type,
      description: field.description,
    });
    if (result.status === 'success') {
      console.log(`  [OK] ${field.name} created`);
    } else {
      console.log(`  [ERR] ${field.name}: ${result.message}`);
    }
    await delay(150);
  }

  // List existing flows
  console.log('\n--- Existing Flows ---');
  const flows = await apiCall('GET', '/fb/page/getFlows');
  if (flows.data && flows.data.length > 0) {
    flows.data.forEach(f => {
      console.log(`  ${f.name} (ID: ${f.ns})`);
    });
  } else {
    console.log('  No flows found. Create the flows manually in ManyChat UI.');
  }

  console.log('\n=== SETUP COMPLETE ===');
  console.log('\nNext steps:');
  console.log('1. Open ManyChat and create the automation flows (see docs/manychat-spoiler-semanal.md)');
  console.log('2. Use the custom fields and tags created above in your flows');
  console.log('3. Update the 12 interpretation fields every Monday');
  console.log('\nTo update weekly interpretations, run:');
  console.log('  node code/update-manychat-weekly.js');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
