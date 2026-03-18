/**
 * ============================================================================
 * LEVEE LOJISTA — Sync Engine (Sheets <-> Supabase)
 * ============================================================================
 * Autor: @dev (Synkra AIOS)
 * Data: 2026-03-04
 * Depende de: SetupSheet.gs (constantes, helpers, supabaseRequest_)
 * ============================================================================
 */

// ── PULL: Supabase → Sheets ────────────────────────────

/**
 * Baixa produtos e categorias do Supabase e atualiza a planilha.
 * Menu: "Levee Produtos > Atualizar Planilha"
 */
function pullFromSupabase() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Confirmar
  var confirm = ui.alert(
    'Atualizar Planilha',
    'Isso vai sobrescrever os dados atuais com os dados do Supabase.\n\n' +
    'Certifique-se de ter enviado suas alteracoes antes de atualizar.\n\n' +
    'Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Buscando dados do Supabase...', 'Atualizando', -1);

    // 1. Buscar categorias
    var categories = supabaseRequest_(
      'get',
      '/rest/v1/categories?select=id,name,sort_order&order=sort_order.asc,name.asc'
    );

    // 2. Atualizar aba Categorias
    updateCategoriasSheet_(ss, categories);

    // 3. Buscar produtos (ativos e inativos, excluindo soft-deleted)
    var products = supabaseRequest_(
      'get',
      '/rest/v1/products?select=display_id,name,price,unit,category_id,description,is_active,image_url,categories(id,name)&deleted_at=is.null&order=display_id.asc'
    );

    // 4. Atualizar aba Cadastro
    var stats = updateCadastroSheet_(ss, products, categories);

    SpreadsheetApp.getActiveSpreadsheet().toast(
      stats.total + ' produtos carregados (' + stats.updated + ' atualizados, ' + stats.added + ' novos)',
      'Concluido!',
      5
    );

  } catch (e) {
    ui.alert('Erro ao atualizar', e.message, ui.ButtonSet.OK);
  }
}

/**
 * Sobrescreve aba Categorias com dados do Supabase.
 */
function updateCategoriasSheet_(ss, categories) {
  var sheet = ss.getSheetByName(SHEET_CATEGORIAS);
  if (!sheet) return;

  // Limpar dados (manter header)
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 3).clear();
  }

  if (categories.length === 0) return;

  // Escrever dados
  var data = categories.map(function(cat) {
    return [cat.id, cat.name, cat.sort_order || 0];
  });

  sheet.getRange(2, 1, data.length, 3).setValues(data);
}

/**
 * Atualiza aba Cadastro com produtos do Supabase (sobrescreve).
 */
function updateCadastroSheet_(ss, products, categories) {
  var sheet = ss.getSheetByName(SHEET_CADASTRO);
  if (!sheet) return { total: 0, updated: 0, added: 0 };

  // Mapa de category_id → nome
  var catMap = {};
  categories.forEach(function(cat) {
    catMap[cat.id] = cat.name;
  });

  // Limpar dados (manter header)
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, HEADERS_CADASTRO.length).clear();
  }

  if (products.length === 0) return { total: 0, updated: 0, added: 0 };

  var now = new Date();
  var data = products.map(function(p) {
    var catName = '';
    if (p.categories && p.categories.name) {
      catName = p.categories.name;
    } else if (p.category_id && catMap[p.category_id]) {
      catName = catMap[p.category_id];
    }

    return [
      p.display_id,                          // A: ID
      p.name,                                // B: Nome
      p.price,                               // C: Preco
      p.unit,                                // D: Unidade
      catName,                               // E: Categoria
      p.description || '',                   // F: Descricao
      p.is_active,                           // G: Ativo
      p.image_url || '',                     // H: Imagem URL
      'Sincronizado',                        // I: Status Sync
      now                                    // J: Ultima Sync
    ];
  });

  sheet.getRange(2, 1, data.length, HEADERS_CADASTRO.length).setValues(data);

  // Re-aplicar checkboxes na coluna Ativo (perde apos clear)
  var ativoRange = sheet.getRange(2, 7, data.length, 1);
  ativoRange.insertCheckboxes();

  return { total: products.length, updated: products.length, added: 0 };
}

// ── PUSH: Sheets → Supabase ────────────────────────────

/**
 * Envia produtos da planilha para o Supabase.
 * Menu: "Levee Produtos > Enviar para Loja"
 */
function pushToSupabase() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    // 1. Ler dados da planilha
    var sheet = ss.getSheetByName(SHEET_CADASTRO);
    var lastRow = getLastDataRow_(sheet);

    if (lastRow < 2) {
      ui.alert('Nenhum produto para enviar.');
      return;
    }

    var dataRange = sheet.getRange(2, 1, lastRow - 1, HEADERS_CADASTRO.length);
    var data = dataRange.getValues();

    // 2. Ler categorias (para lookup nome → UUID)
    var catSheet = ss.getSheetByName(SHEET_CATEGORIAS);
    var catMap = buildCategoryMap_(catSheet);

    // 3. Validar e preparar payload
    var validation = validateAndPrepare_(data, catMap);

    if (validation.errors.length > 0) {
      // Marcar erros na planilha
      markErrors_(sheet, validation.errors);

      if (validation.valid.length === 0) {
        ui.alert(
          'Erros de Validacao',
          validation.errors.length + ' erro(s) encontrado(s). Nenhum produto valido para enviar.\n' +
          'Verifique a coluna "Status Sync" para detalhes.',
          ui.ButtonSet.OK
        );
        return;
      }

      var proceed = ui.alert(
        'Erros de Validacao',
        validation.errors.length + ' erro(s) encontrado(s).\n' +
        validation.valid.length + ' produto(s) valido(s).\n\n' +
        'Enviar apenas os validos?',
        ui.ButtonSet.YES_NO
      );

      if (proceed !== ui.Button.YES) return;
    }

    // 4. Confirmar envio
    var confirm = ui.alert(
      'Enviar para Loja',
      validation.valid.length + ' produto(s) serao enviados ao Supabase.\n\n' +
      'Continuar?',
      ui.ButtonSet.YES_NO
    );

    if (confirm !== ui.Button.YES) return;

    // 5. Chamar RPC
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Enviando ' + validation.valid.length + ' produtos...',
      'Sincronizando',
      -1
    );

    var result = supabaseRequest_('post', '/rest/v1/rpc/bulk_upsert_products', {
      p_products: validation.valid
    });

    // 6. Processar resultado
    var now = new Date();

    // Marcar sucesso nas linhas validas
    validation.validRows.forEach(function(rowIdx) {
      sheet.getRange(rowIdx + 2, 9).setValue('Sincronizado');
      sheet.getRange(rowIdx + 2, 10).setValue(now);
    });

    // Marcar erros retornados pela RPC
    if (result && result.errors && result.errors.length > 0) {
      result.errors.forEach(function(err) {
        if (err.row !== undefined) {
          var sheetRow = validation.validRows[err.row];
          if (sheetRow !== undefined) {
            sheet.getRange(sheetRow + 2, 9).setValue('Erro: ' + err.error);
          }
        }
      });
    }

    // Atualizar IDs dos produtos novos (re-pull para pegar display_ids gerados)
    if (result && result.inserted > 0) {
      SpreadsheetApp.getActiveSpreadsheet().toast('Atualizando IDs dos novos produtos...', 'Finalizando', -1);
      pullNewIds_(ss);
    }

    var inserted = (result && result.inserted) || 0;
    var updated = (result && result.updated) || 0;
    var rpcErrors = (result && result.errors) ? result.errors.length : 0;

    SpreadsheetApp.getActiveSpreadsheet().toast(
      inserted + ' criado(s), ' + updated + ' atualizado(s)' +
      (rpcErrors > 0 ? ', ' + rpcErrors + ' erro(s)' : ''),
      'Envio Completo!',
      5
    );

  } catch (e) {
    ui.alert('Erro ao enviar', e.message, ui.ButtonSet.OK);
  }
}

// ── Validacao Local ─────────────────────────────────────

/**
 * Valida dados da planilha e prepara payload para a RPC.
 * Retorna { valid: [], validRows: [], errors: [] }
 */
function validateAndPrepare_(data, catMap) {
  var valid = [];
  var validRows = [];
  var errors = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var displayId = row[0];    // A: ID
    var name = String(row[1]).trim();  // B: Nome
    var price = row[2];        // C: Preco
    var unit = String(row[3]).trim();   // D: Unidade
    var category = String(row[4]).trim(); // E: Categoria
    var description = String(row[5]).trim(); // F: Descricao
    var isActive = row[6];     // G: Ativo

    // Pular linhas vazias
    if (!name && !price && !unit) continue;

    var rowErrors = [];

    // Validar nome
    if (!name || name.length < 2) {
      rowErrors.push('Nome obrigatorio (min 2 chars)');
    }

    // Validar preco
    var priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      rowErrors.push('Preco deve ser numero >= 0');
    }

    // Validar unidade
    if (UNIDADES.indexOf(unit) === -1) {
      rowErrors.push('Unidade invalida: ' + unit);
    }

    // Validar categoria (se preenchida)
    var categoryName = null;
    if (category && category !== '') {
      if (!catMap[category]) {
        rowErrors.push('Categoria nao encontrada: ' + category);
      } else {
        categoryName = category;
      }
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: i,
        displayId: displayId,
        errors: rowErrors
      });
    } else {
      valid.push({
        display_id: (displayId !== '' && displayId !== null && displayId !== undefined) ? parseInt(displayId) : null,
        name: name,
        price: priceNum,
        unit: unit,
        category_name: categoryName,
        description: description || null,
        is_active: isActive === true || isActive === 'TRUE'
      });
      validRows.push(i);
    }
  }

  return { valid: valid, validRows: validRows, errors: errors };
}

// ── Helpers ─────────────────────────────────────────────

/**
 * Constroi mapa nome → UUID de categorias.
 */
function buildCategoryMap_(catSheet) {
  var map = {};
  if (!catSheet) return map;

  var lastRow = catSheet.getLastRow();
  if (lastRow < 2) return map;

  var data = catSheet.getRange(2, 1, lastRow - 1, 2).getValues();
  data.forEach(function(row) {
    if (row[1]) {
      map[String(row[1]).trim()] = String(row[0]).trim();
    }
  });

  return map;
}

/**
 * Marca erros de validacao na planilha (coluna Status Sync).
 */
function markErrors_(sheet, errors) {
  errors.forEach(function(err) {
    var rowNum = err.row + 2; // +2 porque header = 1, array 0-based
    sheet.getRange(rowNum, 9).setValue('Erro: ' + err.errors.join('; '));
  });
}

/**
 * Encontra a ultima linha com dados na aba.
 */
function getLastDataRow_(sheet) {
  var col = sheet.getRange('B:B').getValues();
  for (var i = col.length - 1; i >= 0; i--) {
    if (col[i][0] !== '') return i + 1;
  }
  return 1;
}

/**
 * Apos inserir novos produtos, re-busca para pegar os display_ids gerados.
 */
function pullNewIds_(ss) {
  var sheet = ss.getSheetByName(SHEET_CADASTRO);
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return;

  // Buscar todos os produtos do Supabase
  var products = supabaseRequest_(
    'get',
    '/rest/v1/products?select=display_id,name&deleted_at=is.null&order=display_id.asc'
  );

  // Mapa nome → display_id
  var nameMap = {};
  products.forEach(function(p) {
    nameMap[p.name] = p.display_id;
  });

  // Leitura batch: colunas A e B de uma vez
  var rows = lastRow - 1;
  var ids = sheet.getRange(2, 1, rows, 1).getValues();
  var names = sheet.getRange(2, 2, rows, 1).getValues();

  for (var i = 0; i < rows; i++) {
    if (!ids[i][0] && names[i][0] && nameMap[names[i][0]]) {
      ids[i][0] = nameMap[names[i][0]];
    }
  }

  // Escrita batch
  sheet.getRange(2, 1, rows, 1).setValues(ids);
}
