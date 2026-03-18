/**
 * LEVEE LOJISTA — Setup em 3 etapas
 * Executar na ordem: setup1_Abas() → setup2_Cadastro() → setup3_Menu()
 */

var SHEET_CADASTRO = 'Cadastro';
var SHEET_CATEGORIAS = 'Categorias';
var HEADERS_CADASTRO = ['ID', 'Nome', 'Preco (R$)', 'Unidade', 'Categoria', 'Descricao', 'Ativo', 'Imagem URL', 'Status Sync', 'Ultima Sync'];
var HEADERS_CATEGORIAS = ['ID (UUID)', 'Nome', 'Ordem'];
var UNIDADES = ['un', 'kg', 'cx', 'maco', 'dz'];

// ═══ ETAPA 1: Criar abas e headers ═══

function setup1_Abas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Categorias
  var cat = ss.getSheetByName(SHEET_CATEGORIAS) || ss.insertSheet(SHEET_CATEGORIAS);
  cat.clear();
  cat.getRange(1, 1, 1, 3).setValues([HEADERS_CATEGORIAS]).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#fff');
  cat.setFrozenRows(1);
  cat.setColumnWidth(1, 300);
  cat.setColumnWidth(2, 200);
  cat.setColumnWidth(3, 80);
  cat.getRange(1, 1).setNote('Aba automatica. Nao edite.');

  // Cadastro
  var cad = ss.getSheetByName(SHEET_CADASTRO) || ss.insertSheet(SHEET_CADASTRO);
  cad.clear();
  cad.getRange(1, 1, 1, 10).setValues([HEADERS_CADASTRO]).setFontWeight('bold').setBackground('#1a1a2e').setFontColor('#fff').setHorizontalAlignment('center');
  cad.setFrozenRows(1);
  cad.setRowHeight(1, 36);
  var w = [60, 250, 100, 100, 150, 300, 70, 250, 140, 150];
  for (var i = 0; i < w.length; i++) cad.setColumnWidth(i + 1, w[i]);

  // Remover aba padrao
  var def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Planilha1');
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Etapa 1/3 OK! Agora execute: setup2_Cadastro()');
}

// ═══ ETAPA 2: Validacoes, dropdowns, formatacao ═══

function setup2_Cadastro() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cad = ss.getSheetByName(SHEET_CADASTRO);
  var cat = ss.getSheetByName(SHEET_CATEGORIAS);
  if (!cad || !cat) { SpreadsheetApp.getUi().alert('Erro: execute setup1_Abas() primeiro.'); return; }

  // Formato preco
  cad.getRange('C2:C').setNumberFormat('R$ #,##0.00');

  // Formato data
  cad.getRange('J2:J').setNumberFormat('dd/MM/yyyy HH:mm');

  // Dropdown unidade
  cad.getRange('D2:D').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(UNIDADES, true).setAllowInvalid(false).build()
  );

  // Dropdown categoria
  cad.getRange('E2:E').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInRange(cat.getRange('B2:B50'), true).setAllowInvalid(true).build()
  );

  // Checkbox ativo (so 20 linhas)
  cad.getRange('G2:G21').insertCheckboxes();

  // Formatacao condicional
  cad.clearConditionalFormatRules();
  cad.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$G2=FALSE').setBackground('#fef2f2').setRanges([cad.getRange('A2:J')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Sincronizado').setFontColor('#059669').setRanges([cad.getRange('I2:I')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Erro').setFontColor('#dc2626').setRanges([cad.getRange('I2:I')]).build()
  ]);

  // Linha exemplo
  cad.getRange(2, 2).setValue('Produto Exemplo');
  cad.getRange(2, 3).setValue(29.90);
  cad.getRange(2, 4).setValue('un');
  cad.getRange(2, 7).setValue(true);
  cad.getRange(2, 9).setValue('Novo');

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Etapa 2/3 OK! Agora execute: setup3_Menu()');
}

// ═══ ETAPA 3: Menu e finalizacao ═══

function setup3_Menu() {
  createMenu_();
  SpreadsheetApp.getUi().alert('Setup completo! Va em Levee Produtos > Configuracoes para inserir credenciais.');
}

// ── Menu ────────────────────────────────────────────────

function createMenu_() {
  SpreadsheetApp.getUi()
    .createMenu('Levee Produtos')
    .addItem('Atualizar Planilha (Supabase -> Sheets)', 'pullFromSupabase')
    .addItem('Enviar para Loja (Sheets -> Supabase)', 'pushToSupabase')
    .addSeparator()
    .addItem('Configuracoes', 'showConfig')
    .addToUi();
}

function onOpen() { createMenu_(); }

// ── Configuracoes ───────────────────────────────────────

function showConfig() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var urlResp = ui.prompt('Supabase URL', 'Ex: https://xxxx.supabase.co', ui.ButtonSet.OK_CANCEL);
  if (urlResp.getSelectedButton() !== ui.Button.OK) return;
  var url = urlResp.getResponseText().trim();
  if (url) props.setProperty('SUPABASE_URL', url.replace(/\/+$/, ''));

  var keyResp = ui.prompt('Supabase Service Role Key', 'Cole a service_role key:', ui.ButtonSet.OK_CANCEL);
  if (keyResp.getSelectedButton() !== ui.Button.OK) return;
  var key = keyResp.getResponseText().trim();
  if (key) props.setProperty('SUPABASE_SERVICE_ROLE_KEY', key);

  ui.alert('Configuracao salva!');
}

// ── Helpers ─────────────────────────────────────────────

function getSupabaseConfig_() {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty('SUPABASE_URL');
  var key = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Credenciais nao configuradas. Levee Produtos > Configuracoes');
  return { url: url, key: key };
}

function supabaseRequest_(method, endpoint, payload) {
  var config = getSupabaseConfig_();
  var options = {
    method: method,
    headers: {
      'apikey': config.key,
      'Authorization': 'Bearer ' + config.key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    muteHttpExceptions: true
  };
  if (payload) options.payload = JSON.stringify(payload);
  var resp = UrlFetchApp.fetch(config.url + endpoint, options);
  if (resp.getResponseCode() >= 400) throw new Error('Supabase erro ' + resp.getResponseCode() + ': ' + resp.getContentText());
  return JSON.parse(resp.getContentText());
}
