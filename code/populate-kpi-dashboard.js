/**
 * Populate KPI Dashboard — Spoiler Astrológico da Semana
 * Populates an existing Google Sheet with headers, formatting, and structure
 */

const { google } = require('googleapis');
const path = require('path');

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'PELICULA SIDERAL', 'gen-lang-client-0573668899-a54903fbcb27.json');
const SPREADSHEET_ID = '1KyoYRK2yk3H32HAeAkn5kRLYtDb1aaWx7n1uTEqv_kU';

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Connecting to spreadsheet...');

  // 1. Get current sheet info
  const info = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  console.log(`Connected: "${info.data.properties.title}"`);
  const existingSheets = info.data.sheets.map(s => ({ id: s.properties.sheetId, title: s.properties.title }));
  console.log('Existing sheets:', existingSheets.map(s => s.title).join(', '));

  // 2. Create additional sheets (Diário, CTA Tracking, Metas)
  const sheetsToCreate = ['Diário', 'CTA Tracking', 'Metas'];
  const existingTitles = existingSheets.map(s => s.title);

  const addRequests = [];
  let nextId = 10;
  for (const title of sheetsToCreate) {
    if (!existingTitles.includes(title)) {
      addRequests.push({
        addSheet: {
          properties: { title, sheetId: nextId++ },
        },
      });
    }
  }

  // Rename Sheet1 to "Semanal" if needed
  const sheet1 = existingSheets.find(s => s.title === 'Sheet1' || s.title === 'Página1' || s.title === 'Planilha1');
  if (sheet1) {
    addRequests.unshift({
      updateSheetProperties: {
        properties: { sheetId: sheet1.id, title: 'Semanal' },
        fields: 'title',
      },
    });
  }

  if (addRequests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: addRequests },
    });
    console.log('Sheets created/renamed.');
  }

  // Re-fetch to get updated sheet IDs
  const updatedInfo = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetMap = {};
  for (const s of updatedInfo.data.sheets) {
    sheetMap[s.properties.title] = s.properties.sheetId;
  }
  console.log('Sheet IDs:', JSON.stringify(sheetMap));

  // 3. Populate all data
  console.log('\nPopulating data...');
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        // --- SEMANAL ---
        {
          range: 'Semanal!A1:R2',
          values: [
            [
              '', '', 'TOPO — Awareness', '', '', '',
              'MEIO — Consideration', '', '', '', '', '',
              'FUNDO — Conversão', '', '', '', '', '',
            ],
            [
              'Semana', 'Tema Astrológico',
              'Alcance Reels', 'Impressões Stories', 'Comentários Keyword', 'Respostas Caixinha',
              'DMs ManyChat', 'Caminho A', 'Caminho B', 'Cliques LP ManyChat', 'Aberturas Substack', 'Cliques CTA Substack',
              'Visitas LP Camarin', 'Visitas LP Curso', 'Assinaturas Camarin', 'Vendas Curso', 'Receita Total (R$)', 'Observações',
            ],
          ],
        },
        {
          range: 'Semanal!A3:B14',
          values: Array.from({ length: 12 }, (_, i) => [`Sem ${i + 1}`, '']),
        },
        // --- DIÁRIO ---
        {
          range: 'Diário!A1:I1',
          values: [[
            'Data', 'Dia', 'Conteúdo Publicado', 'Alcance', 'Impressões',
            'Engajamento Total', 'Novos Seguidores', 'DMs Recebidos', 'Observações',
          ]],
        },
        // --- CTA TRACKING ---
        {
          range: "'CTA Tracking'!A1:H1",
          values: [[
            'Semana', 'CTA Reel #1', 'CTA Reel #2', 'Comentários Reel #1',
            'Comentários Reel #2', 'CTA Substack', 'Cliques CTA Substack', 'Melhor CTA',
          ]],
        },
        {
          range: "'CTA Tracking'!A2:A13",
          values: Array.from({ length: 12 }, (_, i) => [`Sem ${i + 1}`]),
        },
        // --- METAS ---
        {
          range: 'Metas!A1:D20',
          values: [
            ['METAS DE REFERÊNCIA', '', '', ''],
            ['', '', '', ''],
            ['TOPO — Awareness', 'Meta Mínima', 'Meta Ideal', 'Fonte'],
            ['Alcance Reels', '50.000', '100.000+', 'Instagram Insights'],
            ['Impressões Stories', '3.000', '8.000+', 'Instagram Insights'],
            ['Comentários keyword', '30', '100+', 'Instagram + ManyChat'],
            ['Respostas caixinha', '50', '150+', 'Instagram Insights'],
            ['', '', '', ''],
            ['MEIO — Consideration', 'Meta Mínima', 'Meta Ideal', 'Fonte'],
            ['DMs ManyChat', '30', '100+', 'ManyChat Analytics'],
            ['Taxa resposta ManyChat', '70%', '85%+', 'ManyChat Analytics'],
            ['Cliques LP via ManyChat', '15', '50+', 'ManyChat + UTM'],
            ['Aberturas Substack', '100', '300+', 'Substack Dashboard'],
            ['Cliques CTA Substack', '10', '30+', 'Substack Dashboard'],
            ['', '', '', ''],
            ['FUNDO — Conversão', 'Meta Mínima', 'Meta Ideal', 'Fonte'],
            ['Visitas LP Camarin', '20', '60+', 'Google Analytics'],
            ['Taxa conversão LP', '2%', '5%+', 'GA + Checkout'],
            ['Assinaturas Camarin/sem', '3', '10+', 'Substack + Kiwify'],
            ['Vendas Curso/sem', '2', '5+', 'Kiwify'],
          ],
        },
      ],
    },
  });
  console.log('Data populated.');

  // 4. Apply formatting
  console.log('Applying formatting...');

  const semanalId = sheetMap['Semanal'];
  const diarioId = sheetMap['Diário'];
  const ctaId = sheetMap['CTA Tracking'];
  const metasId = sheetMap['Metas'];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // === SEMANAL ===
        // Freeze rows and columns
        { updateSheetProperties: { properties: { sheetId: semanalId, gridProperties: { frozenRowCount: 2, frozenColumnCount: 1 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } },

        // Merge category headers row 1
        { mergeCells: { range: { sheetId: semanalId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 2, endColumnIndex: 6 }, mergeType: 'MERGE_ALL' } },
        { mergeCells: { range: { sheetId: semanalId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 6, endColumnIndex: 12 }, mergeType: 'MERGE_ALL' } },
        { mergeCells: { range: { sheetId: semanalId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 12, endColumnIndex: 17 }, mergeType: 'MERGE_ALL' } },

        // Row 1 - Category headers (dark bg, white text)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 2, endColumnIndex: 17 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.15, green: 0.15, blue: 0.25 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
          },
        },

        // Row 2 - Column headers (gray bg)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 18 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.82, green: 0.82, blue: 0.87 },
                textFormat: { bold: true, fontSize: 9 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },

        // TOPO data columns (light blue bg)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 6 },
            cell: { userEnteredFormat: { backgroundColor: { red: 0.87, green: 0.93, blue: 1.0 } } },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
        // MEIO data columns (light yellow bg)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 6, endColumnIndex: 12 },
            cell: { userEnteredFormat: { backgroundColor: { red: 1.0, green: 0.96, blue: 0.87 } } },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
        // FUNDO data columns (light green bg)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 12, endColumnIndex: 17 },
            cell: { userEnteredFormat: { backgroundColor: { red: 0.87, green: 1.0, blue: 0.87 } } },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },

        // Column widths
        { updateDimensionProperties: { range: { sheetId: semanalId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 80 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: semanalId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: semanalId, dimension: 'COLUMNS', startIndex: 2, endIndex: 17 }, properties: { pixelSize: 110 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: semanalId, dimension: 'COLUMNS', startIndex: 17, endIndex: 18 }, properties: { pixelSize: 280 }, fields: 'pixelSize' } },

        // Row 1 height
        { updateDimensionProperties: { range: { sheetId: semanalId, dimension: 'ROWS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 36 }, fields: 'pixelSize' } },

        // Borders for header rows
        {
          updateBorders: {
            range: { sheetId: semanalId, startRowIndex: 0, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 18 },
            bottom: { style: 'SOLID_MEDIUM', color: { red: 0.3, green: 0.3, blue: 0.3 } },
          },
        },

        // Number format for numeric columns (C-Q)
        {
          repeatCell: {
            range: { sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 17 },
            cell: {
              userEnteredFormat: {
                horizontalAlignment: 'CENTER',
                numberFormat: { type: 'NUMBER', pattern: '#,##0' },
              },
            },
            fields: 'userEnteredFormat(horizontalAlignment,numberFormat)',
          },
        },

        // === DIÁRIO ===
        { updateSheetProperties: { properties: { sheetId: diarioId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } },
        {
          repeatCell: {
            range: { sheetId: diarioId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.15, green: 0.15, blue: 0.25 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },
        { updateDimensionProperties: { range: { sheetId: diarioId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 100 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: diarioId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 80 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: diarioId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: diarioId, dimension: 'COLUMNS', startIndex: 3, endIndex: 8 }, properties: { pixelSize: 110 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: diarioId, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 }, properties: { pixelSize: 280 }, fields: 'pixelSize' } },

        // === CTA TRACKING ===
        { updateSheetProperties: { properties: { sheetId: ctaId, gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount' } },
        {
          repeatCell: {
            range: { sheetId: ctaId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.15, green: 0.15, blue: 0.25 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },
        { updateDimensionProperties: { range: { sheetId: ctaId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 80 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: ctaId, dimension: 'COLUMNS', startIndex: 1, endIndex: 8 }, properties: { pixelSize: 150 }, fields: 'pixelSize' } },

        // === METAS ===
        // Title
        {
          repeatCell: {
            range: { sheetId: metasId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true, fontSize: 14 },
              },
            },
            fields: 'userEnteredFormat.textFormat',
          },
        },
        // Section headers (rows 3, 9, 16 — 0-indexed: 2, 8, 15)
        ...[2, 8, 15].map(row => ({
          repeatCell: {
            range: { sheetId: metasId, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.82, green: 0.82, blue: 0.87 },
                textFormat: { bold: true, fontSize: 10 },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        })),
        { updateDimensionProperties: { range: { sheetId: metasId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: metasId, dimension: 'COLUMNS', startIndex: 1, endIndex: 3 }, properties: { pixelSize: 120 }, fields: 'pixelSize' } },
        { updateDimensionProperties: { range: { sheetId: metasId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, properties: { pixelSize: 180 }, fields: 'pixelSize' } },

        // === CONDITIONAL FORMATTING (Semanal) ===
        // Green if >= meta ideal for key columns
        // Alcance Reels (C) - ideal 100000
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 3 }],
              booleanRule: {
                condition: { type: 'NUMBER_GREATER_THAN_EQ', values: [{ userEnteredValue: '100000' }] },
                format: { backgroundColor: { red: 0.72, green: 0.88, blue: 0.72 } },
              },
            },
            index: 0,
          },
        },
        // DMs ManyChat (G) - ideal 100
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 6, endColumnIndex: 7 }],
              booleanRule: {
                condition: { type: 'NUMBER_GREATER_THAN_EQ', values: [{ userEnteredValue: '100' }] },
                format: { backgroundColor: { red: 0.72, green: 0.88, blue: 0.72 } },
              },
            },
            index: 1,
          },
        },
        // Assinaturas Camarin (O) - ideal 10
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 14, endColumnIndex: 15 }],
              booleanRule: {
                condition: { type: 'NUMBER_GREATER_THAN_EQ', values: [{ userEnteredValue: '10' }] },
                format: { backgroundColor: { red: 0.72, green: 0.88, blue: 0.72 } },
              },
            },
            index: 2,
          },
        },
        // Red if below meta mínima - Alcance Reels < 50000
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 3 }],
              booleanRule: {
                condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '50000' }] },
                format: { backgroundColor: { red: 0.95, green: 0.78, blue: 0.78 } },
              },
            },
            index: 3,
          },
        },
        // Red - DMs ManyChat < 30
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 6, endColumnIndex: 7 }],
              booleanRule: {
                condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '30' }] },
                format: { backgroundColor: { red: 0.95, green: 0.78, blue: 0.78 } },
              },
            },
            index: 4,
          },
        },
        // Red - Assinaturas Camarin < 3
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId: semanalId, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 14, endColumnIndex: 15 }],
              booleanRule: {
                condition: { type: 'NUMBER_LESS', values: [{ userEnteredValue: '3' }] },
                format: { backgroundColor: { red: 0.95, green: 0.78, blue: 0.78 } },
              },
            },
            index: 5,
          },
        },
      ],
    },
  });

  console.log('Formatting and conditional rules applied.');
  console.log('\n=== DONE ===');
  console.log(`Dashboard URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log('\nSheets created:');
  console.log('  1. Semanal — weekly KPIs (TOPO / MEIO / FUNDO)');
  console.log('  2. Diário — daily metrics tracking');
  console.log('  3. CTA Tracking — CTA variation performance');
  console.log('  4. Metas — reference table with targets');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.response?.data) console.error('Details:', JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
