/**
 * Create KPI Dashboard — Spoiler Astrológico da Semana
 * Creates a Google Sheet with 4 tabs: Semanal, Diário, Gráficos, CTA Tracking
 */

const { google } = require('googleapis');
const path = require('path');

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'PELICULA SIDERAL', 'gen-lang-client-0573668899-a54903fbcb27.json');

// Share with this email so Fernando can access
const SHARE_WITH_EMAIL = process.argv[2] || null;

async function main() {
  // Auth
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  console.log('Creating KPI Dashboard spreadsheet...');

  // 1. Create spreadsheet with 4 sheets
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'KPI Dashboard — Spoiler Astrológico Semanal',
        locale: 'pt_BR',
      },
      sheets: [
        {
          properties: {
            title: 'Semanal',
            sheetId: 0,
            gridProperties: { frozenRowCount: 2, frozenColumnCount: 1 },
          },
        },
        {
          properties: {
            title: 'Diário',
            sheetId: 1,
            gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 },
          },
        },
        {
          properties: {
            title: 'CTA Tracking',
            sheetId: 2,
            gridProperties: { frozenRowCount: 1, frozenColumnCount: 1 },
          },
        },
        {
          properties: {
            title: 'Metas',
            sheetId: 3,
          },
        },
      ],
    },
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;
  const spreadsheetUrl = spreadsheet.data.spreadsheetUrl;
  console.log(`Spreadsheet created: ${spreadsheetUrl}`);

  // 2. Populate "Semanal" headers
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
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
        // Pre-fill first 12 weeks
        {
          range: 'Semanal!A3:A14',
          values: [
            ['Sem 1'], ['Sem 2'], ['Sem 3'], ['Sem 4'],
            ['Sem 5'], ['Sem 6'], ['Sem 7'], ['Sem 8'],
            ['Sem 9'], ['Sem 10'], ['Sem 11'], ['Sem 12'],
          ],
        },
        // "Diário" headers
        {
          range: 'Diário!A1:I1',
          values: [[
            'Data', 'Dia', 'Conteúdo Publicado', 'Alcance', 'Impressões',
            'Engajamento Total', 'Novos Seguidores', 'DMs Recebidos', 'Observações',
          ]],
        },
        // "CTA Tracking" headers
        {
          range: 'CTA Tracking!A1:H1',
          values: [[
            'Semana', 'CTA Reel #1', 'CTA Reel #2', 'Comentários Reel #1',
            'Comentários Reel #2', 'CTA Substack', 'Cliques CTA Substack', 'Melhor CTA',
          ]],
        },
        // Pre-fill CTA Tracking weeks
        {
          range: 'CTA Tracking!A2:A13',
          values: [
            ['Sem 1'], ['Sem 2'], ['Sem 3'], ['Sem 4'],
            ['Sem 5'], ['Sem 6'], ['Sem 7'], ['Sem 8'],
            ['Sem 9'], ['Sem 10'], ['Sem 11'], ['Sem 12'],
          ],
        },
        // "Metas" reference table
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

  console.log('Headers and data populated.');

  // 3. Format the spreadsheet
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        // --- SEMANAL sheet formatting ---
        // Merge category headers row 1
        { mergeCells: { range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 2, endColumnIndex: 6 }, mergeType: 'MERGE_ALL' } },
        { mergeCells: { range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 6, endColumnIndex: 12 }, mergeType: 'MERGE_ALL' } },
        { mergeCells: { range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 12, endColumnIndex: 17 }, mergeType: 'MERGE_ALL' } },
        // Category headers style (row 1)
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 2, endColumnIndex: 17 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.2, blue: 0.3 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 11 },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        // Column headers style (row 2)
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 18 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.85, green: 0.85, blue: 0.9 },
                textFormat: { bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },
        // Auto-resize columns
        { autoResizeDimensions: { dimensions: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 18 } } },
        // Set column A (Semana) width
        { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 100 }, fields: 'pixelSize' } },
        // Set column B (Tema) width
        { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 200 }, fields: 'pixelSize' } },
        // Set column R (Observações) width
        { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 17, endIndex: 18 }, properties: { pixelSize: 300 }, fields: 'pixelSize' } },

        // --- TOPO color (light blue) for data columns C-F ---
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 2, endColumnIndex: 6 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.88, green: 0.94, blue: 1.0 },
              },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
        // --- MEIO color (light yellow) for data columns G-L ---
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 6, endColumnIndex: 12 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 1.0, green: 0.97, blue: 0.88 },
              },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
        // --- FUNDO color (light green) for data columns M-Q ---
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 2, endRowIndex: 14, startColumnIndex: 12, endColumnIndex: 17 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.88, green: 1.0, blue: 0.88 },
              },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },

        // --- DIÁRIO sheet formatting ---
        {
          repeatCell: {
            range: { sheetId: 1, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.2, blue: 0.3 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },
        { autoResizeDimensions: { dimensions: { sheetId: 1, dimension: 'COLUMNS', startIndex: 0, endIndex: 9 } } },
        { updateDimensionProperties: { range: { sheetId: 1, dimension: 'COLUMNS', startIndex: 8, endIndex: 9 }, properties: { pixelSize: 300 }, fields: 'pixelSize' } },

        // --- CTA TRACKING sheet formatting ---
        {
          repeatCell: {
            range: { sheetId: 2, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 8 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.2, blue: 0.3 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 },
                horizontalAlignment: 'CENTER',
                wrapStrategy: 'WRAP',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,wrapStrategy)',
          },
        },
        { autoResizeDimensions: { dimensions: { sheetId: 2, dimension: 'COLUMNS', startIndex: 0, endIndex: 8 } } },

        // --- METAS sheet formatting ---
        // Title
        {
          repeatCell: {
            range: { sheetId: 3, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true, fontSize: 14 },
              },
            },
            fields: 'userEnteredFormat.textFormat',
          },
        },
        // Section headers (TOPO, MEIO, FUNDO)
        ...[2, 8, 15].map(row => ({
          repeatCell: {
            range: { sheetId: 3, startRowIndex: row, endRowIndex: row + 1, startColumnIndex: 0, endColumnIndex: 4 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.85, green: 0.85, blue: 0.9 },
                textFormat: { bold: true, fontSize: 10 },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        })),
        { autoResizeDimensions: { dimensions: { sheetId: 3, dimension: 'COLUMNS', startIndex: 0, endIndex: 4 } } },
      ],
    },
  });

  console.log('Formatting applied.');

  // 4. Share with user if email provided
  if (SHARE_WITH_EMAIL) {
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: SHARE_WITH_EMAIL,
      },
    });
    console.log(`Shared with ${SHARE_WITH_EMAIL} (editor access).`);
  } else {
    // Make it accessible to anyone with the link
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    });
    console.log('Shared: anyone with the link can edit.');
  }

  console.log('\n=== DONE ===');
  console.log(`Spreadsheet ID: ${spreadsheetId}`);
  console.log(`URL: ${spreadsheetUrl}`);
  console.log('\nNext steps:');
  console.log('1. Open the URL above');
  console.log('2. Bookmark it for weekly use');
  console.log('3. Fill in data every Monday');
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.message.includes('not been used') || err.message.includes('disabled')) {
    console.error('\n>>> You need to enable the Google Sheets API:');
    console.error(`>>> https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=gen-lang-client-0573668899`);
    console.error('\n>>> And the Google Drive API:');
    console.error(`>>> https://console.cloud.google.com/apis/library/drive.googleapis.com?project=gen-lang-client-0573668899`);
  }
  process.exit(1);
});
