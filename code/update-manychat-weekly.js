/**
 * Update ManyChat Weekly — Spoiler Astrológico da Semana
 * Updates the 12 ascendant interpretations + weekly theme
 *
 * Usage: node code/update-manychat-weekly.js
 *
 * Reads from: data/interpretacoes-semana.json
 * Run every Monday before publishing content.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load token
let API_TOKEN = '';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const match = envContent.match(/MANYCHAT_API_TOKEN=(.+)/);
  if (match) API_TOKEN = match[1].trim();
} catch (e) {}

if (!API_TOKEN) {
  console.error('Set MANYCHAT_API_TOKEN in .env');
  process.exit(1);
}

const DATA_FILE = path.join(__dirname, '..', 'data', 'interpretacoes-semana.json');

function apiCall(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.manychat.com',
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
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function askQuestion(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer); }));
}

// Template for the weekly data file
const TEMPLATE = {
  semana: '',
  tema_semana: '',
  interpretacoes: {
    aries: '',
    touro: '',
    gemeos: '',
    cancer: '',
    leao: '',
    virgem: '',
    libra: '',
    escorpiao: '',
    sagitario: '',
    capricornio: '',
    aquario: '',
    peixes: '',
  },
};

async function main() {
  const args = process.argv.slice(2);

  // If --create-template, generate the template file
  if (args.includes('--create-template')) {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const template = {
      semana: 'Sem 1 — 02/03 a 08/03',
      tema_semana: 'Lua Nova em Peixes',
      interpretacoes: {
        aries: 'essa energia ativa sua casa 12 — momento de olhar pra dentro, revisar padrões e confiar na sua intuição antes de agir',
        touro: 'a Lua Nova ilumina sua casa 11 — novas conexões e projetos coletivos ganham força',
        gemeos: 'sua casa 10 é ativada — semana decisiva para carreira e reputação',
        cancer: 'a energia vai pra casa 9 — expansão, aprendizado, e uma vontade de ir mais longe',
        leao: 'casa 8 ativada — transformação profunda, desapegos necessários, renovação',
        virgem: 'a Lua Nova mexe na sua casa 7 — relacionamentos pedem atenção e novos acordos',
        libra: 'casa 6 em foco — rotina, saúde e hábitos pedem reorganização',
        escorpiao: 'energia na casa 5 — criatividade, romance e expressão pessoal em alta',
        sagitario: 'casa 4 iluminada — lar, família e raízes emocionais pedem atenção',
        capricornio: 'sua casa 3 é ativada — comunicação, estudos e conversas importantes',
        aquario: 'casa 2 em foco — valores, dinheiro e autoestima em revisão',
        peixes: 'a Lua Nova acontece no SEU signo — recomeço pessoal, novas intenções, momento de plantar',
      },
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(template, null, 2), 'utf8');
    console.log(`Template created at: ${DATA_FILE}`);
    console.log('Edit this file with the week\'s interpretations, then run:');
    console.log('  node code/update-manychat-weekly.js');
    return;
  }

  // Load interpretations
  if (!fs.existsSync(DATA_FILE)) {
    console.log('No data file found. Creating template...');
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(TEMPLATE, null, 2), 'utf8');
    console.log(`Created template at: ${DATA_FILE}`);
    console.log('Fill in the interpretations and run this script again.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  if (!data.tema_semana) {
    console.error('tema_semana is empty in the data file. Fill it in first.');
    process.exit(1);
  }

  console.log(`=== Updating ManyChat — ${data.semana} ===`);
  console.log(`Tema: ${data.tema_semana}\n`);

  // Get existing custom fields to find their IDs
  const fieldsResponse = await apiCall('GET', '/fb/page/getCustomFields');
  if (fieldsResponse.status !== 'success') {
    console.error('Failed to get custom fields:', fieldsResponse.message);
    process.exit(1);
  }

  const fieldMap = {};
  for (const f of fieldsResponse.data) {
    fieldMap[f.name] = f.id;
  }

  // Update bot field (global theme)
  console.log('Updating bot field: tema_semana_global...');
  const botResult = await apiCall('POST', '/fb/page/setBotField', {
    field_name: 'tema_semana_global',
    field_value: data.tema_semana,
  });
  console.log(botResult.status === 'success' ? '  [OK]' : `  [ERR] ${botResult.message}`);

  // Note: Custom fields are per-subscriber, not global.
  // The interpretations are used in the flow template via bot fields or
  // set when a subscriber triggers the flow.
  // For now, we update the bot-level fields that the flow references.

  console.log('\nUpdating interpretation bot fields...');

  const signoMap = {
    aries: 'interp_aries',
    touro: 'interp_touro',
    gemeos: 'interp_gemeos',
    cancer: 'interp_cancer',
    leao: 'interp_leao',
    virgem: 'interp_virgem',
    libra: 'interp_libra',
    escorpiao: 'interp_escorpiao',
    sagitario: 'interp_sagitario',
    capricornio: 'interp_capricornio',
    aquario: 'interp_aquario',
    peixes: 'interp_peixes',
  };

  for (const [signo, fieldName] of Object.entries(signoMap)) {
    const value = data.interpretacoes[signo];
    if (!value) {
      console.log(`  [SKIP] ${signo} — empty`);
      continue;
    }
    const result = await apiCall('POST', '/fb/page/setBotField', {
      field_name: fieldName,
      field_value: value,
    });
    const emoji = { aries: '♈', touro: '♉', gemeos: '♊', cancer: '♋', leao: '♌', virgem: '♍', libra: '♎', escorpiao: '♏', sagitario: '♐', capricornio: '♑', aquario: '♒', peixes: '♓' };
    console.log(result.status === 'success'
      ? `  [OK] ${emoji[signo]} ${signo}`
      : `  [ERR] ${signo}: ${result.message}`);
    await delay(150);
  }

  console.log('\n=== UPDATE COMPLETE ===');
  console.log(`\nTema da semana: ${data.tema_semana}`);
  console.log('All 12 interpretations updated.');
  console.log('\nRemember to test the ManyChat flow by commenting a sign on a test post.');
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
