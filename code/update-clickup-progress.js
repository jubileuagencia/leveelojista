/**
 * Update ClickUp Progress — Spoiler Astrológico da Semana
 * Updates statuses, Responsável field, and subtask statuses
 */

const https = require('https');

const TOKEN = 'pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF';

// Field IDs per list
const FIELDS = {
  planejamento: {
    fieldId: 'cea7c89d-c693-40d3-b9c3-8d7fc60c633c',
    options: {
      Fernando: 'c6898d40-19b0-41cb-8214-b31bedea618c',
      Victor: '0974491b-8819-4d38-a46a-1e0ae1f5c08e',
      Gabriel: '0b17cc99-2481-4674-8357-c87d35f1ea93',
      Karol: '2feb4dde-95cc-4ff7-b730-290e8e065f36',
      Sylvia: '1a335ab9-ca47-4a22-9a6e-ff6d0a100905',
      Diego: 'b149f37b-4779-4747-9676-1119a030a3d7',
    },
  },
  redacao: {
    fieldId: '7f38951b-dbda-4d49-93ef-4a0e8ba12ccc',
    options: {
      Fernando: '48f04ea6-169b-4956-96b0-18ba198a7d5f',
      Victor: 'cc5785c2-8bc9-437f-8bbc-c4f48c33a538',
      Gabriel: 'c7654c01-d16e-43a6-8a20-53540f4bef93',
      Karol: '55b169af-5a5f-4a12-9e48-eba89a7f60cc',
      Sylvia: '8ae2fdfe-6705-4032-b3b6-c42ef592a4a7',
      Diego: 'de4259ce-b7a6-47ad-8748-cf63f6d14b81',
    },
  },
  campanhas: {
    fieldId: '932eee93-521c-4be7-b07f-7202529ed160',
    options: {
      Fernando: '23224353-d227-4b8e-a19e-af031133a7df',
      Victor: '7cbb620d-0317-4c54-9468-ff7b3a111805',
      Gabriel: '239508a9-78b1-4f7e-8afc-87f4a27db2eb',
      Karol: 'cfd41920-6557-49ec-b0dc-60bc43754aff',
      Sylvia: 'd2cb1506-422c-477a-8914-7a150588bfbf',
      Diego: 'b9f2dc49-b1f2-4a62-86c9-5621df60da16',
    },
  },
};

// Task definitions with desired status and responsável
const TASKS = [
  // SP1 — Planejamento
  { id: '86afkyqh3', name: 'SP1', status: 'concluído', responsavel: 'Fernando', list: 'planejamento' },
  { id: '86afkyqjt', name: 'SP2', status: 'concluído', responsavel: 'Fernando', list: 'planejamento' },
  { id: '86afkyqpr', name: 'SP3', status: 'concluído', responsavel: 'Fernando', list: 'planejamento' },

  // SP4-SP6 — Redação
  { id: '86afkyqrq', name: 'SP4', status: 'concluído', responsavel: 'Fernando', list: 'redacao' },
  { id: '86afkyqv2', name: 'SP5', status: 'concluído', responsavel: 'Fernando', list: 'redacao' },
  { id: '86afkyqyr', name: 'SP6', status: 'concluído', responsavel: 'Fernando', list: 'redacao' },

  // SP7-SP9 — Campanhas
  { id: '86afkyr19', name: 'SP7', status: 'concluído', responsavel: 'Fernando', list: 'campanhas' },
  { id: '86afkyr2v', name: 'SP8', status: 'a fazer', responsavel: 'Fernando', list: 'campanhas' },
  { id: '86afkyr7v', name: 'SP9', status: 'concluído', responsavel: 'Fernando', list: 'campanhas' },

  // SP7 subtasks — Campanhas
  { id: '86afkyr1g', name: 'SP7.1', status: 'concluído', responsavel: 'Fernando', list: 'campanhas' },
  { id: '86afkyr22', name: 'SP7.2', status: 'concluído', responsavel: 'Fernando', list: 'campanhas' },
  { id: '86afkyr2f', name: 'SP7.3', status: 'concluído', responsavel: 'Fernando', list: 'campanhas' },

];

function apiCall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      path: `/api/v2${path}`,
      method,
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (e) {
          resolve({ error: Buffer.concat(chunks).toString() });
        }
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

async function main() {
  console.log('=== Updating ClickUp Progress ===\n');

  for (const task of TASKS) {
    const listConfig = FIELDS[task.list];
    const optionId = listConfig.options[task.responsavel];

    // Update status
    const statusResult = await apiCall('PUT', `/task/${task.id}`, {
      status: task.status,
    });

    // Set custom field (Responsável)
    const fieldResult = await apiCall('POST', `/task/${task.id}/field/${listConfig.fieldId}`, {
      value: optionId,
    });

    const statusOk = statusResult.id ? 'OK' : `ERR(${statusResult.err || statusResult.message || 'unknown'})`;
    const fieldOk = fieldResult.id !== undefined || !fieldResult.err ? 'OK' : `ERR(${fieldResult.err})`;

    console.log(`  ${task.name} → status: ${task.status} [${statusOk}] | responsável: ${task.responsavel} [${fieldOk}]`);

    await delay(200);
  }

  console.log('\n=== DONE ===');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
