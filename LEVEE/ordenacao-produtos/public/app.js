(function () {
  'use strict';

  // === State ===
  let allProducts = [];
  let filteredProducts = [];
  let pendingChanges = new Map(); // id -> { id, ordem }
  let sortableInstance = null;
  let activeModalProduct = null;

  // === DOM refs ===
  const $ = (sel) => document.querySelector(sel);
  const searchInput = $('#search-input');
  const searchClear = $('#search-clear');
  const filterCat = $('#filter-categoria');
  const filterSort = $('#filter-ordenacao');
  const productList = $('#product-list');
  const loadingEl = $('#loading');
  const emptyState = $('#empty-state');
  const btnSaveAll = $('#btn-save-all');
  const changesCount = $('#changes-count');
  const statsTotal = $('#stats-total');
  const statsOrdenados = $('#stats-ordenados');
  const modalOverlay = $('#modal-overlay');
  const modalSheet = $('#modal-sheet');
  const modalImg = $('#modal-img');
  const modalName = $('#modal-name');
  const modalCat = $('#modal-cat');
  const modalOrderInput = $('#modal-order-input');
  const modalSwapInfo = $('#modal-swap-info');
  const btnOrderPrev = $('#btn-order-prev');
  const btnOrderNext = $('#btn-order-next');
  const btnModalCancel = $('#btn-modal-cancel');
  const btnModalSave = $('#btn-modal-save');
  const btnExportCsv = $('#btn-export-csv');
  const toastEl = $('#toast');

  // === API ===
  async function fetchProducts() {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.products;
  }

  async function saveChanges(updates) {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // === Helpers ===
  function getEffectiveOrder(product) {
    if (pendingChanges.has(product.id)) {
      return pendingChanges.get(product.id).ordem;
    }
    return product.ordem;
  }

  function getAllCategories(products) {
    const cats = new Set();
    products.forEach(p => (p.categoria || []).forEach(c => cats.add(c)));
    return [...cats].sort();
  }

  function showToast(msg, duration = 2500) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.hidden = true; }, duration);
  }

  function updateStats() {
    const ordenados = allProducts.filter(p => getEffectiveOrder(p) != null).length;
    statsTotal.textContent = `${allProducts.length} produtos`;
    statsOrdenados.textContent = `${ordenados} ordenados`;
  }

  function updateChangesUI() {
    const count = pendingChanges.size;
    btnSaveAll.disabled = count === 0;
    changesCount.textContent = count;
    changesCount.hidden = count === 0;
  }

  // === Filtering & Sorting ===
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const cat = filterCat.value;
    const sort = filterSort.value;

    filteredProducts = allProducts.filter(p => {
      if (query && !p.nome.toLowerCase().includes(query)) return false;
      if (cat && !(p.categoria || []).includes(cat)) return false;
      return true;
    });

    filteredProducts.sort((a, b) => {
      const oA = getEffectiveOrder(a);
      const oB = getEffectiveOrder(b);

      switch (sort) {
        case 'ordem-asc':
          if (oA == null && oB == null) return a.nome.localeCompare(b.nome);
          if (oA == null) return 1;
          if (oB == null) return -1;
          return oA - oB;
        case 'ordem-desc':
          if (oA == null && oB == null) return a.nome.localeCompare(b.nome);
          if (oA == null) return 1;
          if (oB == null) return -1;
          return oB - oA;
        case 'nome-asc':
          return a.nome.localeCompare(b.nome);
        case 'nome-desc':
          return b.nome.localeCompare(a.nome);
        case 'sem-ordem':
          if (oA == null && oB != null) return -1;
          if (oA != null && oB == null) return 1;
          if (oA == null && oB == null) return a.nome.localeCompare(b.nome);
          return oA - oB;
        default:
          return 0;
      }
    });

    renderProducts();
  }

  // === Render ===
  function renderProducts() {
    if (filteredProducts.length === 0) {
      productList.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    productList.innerHTML = filteredProducts.map(p => {
      const ordem = getEffectiveOrder(p);
      const hasChange = pendingChanges.has(p.id);
      const imgSrc = p.foto || '';
      const cat = (p.categoria || [])[0] || '';

      return `
        <div class="product-card ${hasChange ? 'changed' : ''}" data-id="${p.id}" data-ordem="${ordem ?? ''}">
          <div class="product-card__order ${ordem == null ? 'no-order' : ''}">
            ${ordem != null ? ordem : '--'}
          </div>
          ${imgSrc
            ? `<img class="product-card__img" src="${imgSrc}" alt="${p.nome}" loading="lazy" onerror="this.classList.add('no-img');this.src='';this.textContent='🍎'">`
            : `<div class="product-card__img no-img">🍎</div>`
          }
          <div class="product-card__info">
            <div class="product-card__name">${p.nome}</div>
            <div class="product-card__meta">
              ${cat ? `<span class="tag">${cat}</span>` : ''}
            </div>
          </div>
          <div class="product-card__drag-handle">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
              <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
              <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
            </svg>
          </div>
        </div>`;
    }).join('');

    initSortable();
  }

  // === Sortable (Drag & Drop) ===
  function initSortable() {
    if (sortableInstance) sortableInstance.destroy();

    sortableInstance = new Sortable(productList, {
      animation: 200,
      delay: 300,
      delayOnTouchOnly: true,
      handle: '.product-card__drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: handleDragEnd
    });
  }

  function calculateNewOrder(newIndex) {
    // Look at the item above in the new DOM arrangement (Sortable already moved the element)
    if (newIndex > 0) {
      const prevEl = productList.children[newIndex - 1];
      if (prevEl) {
        const prevProduct = allProducts.find(p => p.id === prevEl.dataset.id);
        if (prevProduct) {
          const prevOrder = getEffectiveOrder(prevProduct);
          if (prevOrder != null) return prevOrder + 1;
        }
      }
    }

    // No ordered item above → look at item below
    const nextEl = productList.children[newIndex + 1];
    if (nextEl) {
      const nextProduct = allProducts.find(p => p.id === nextEl.dataset.id);
      if (nextProduct) {
        const nextOrder = getEffectiveOrder(nextProduct);
        if (nextOrder != null) return Math.max(1, nextOrder - 1);
      }
    }

    return 1;
  }

  function handleDragEnd(evt) {
    if (evt.oldIndex === evt.newIndex) return;

    // Products from the pre-drag filtered list
    const draggedProduct = filteredProducts[evt.oldIndex];
    if (!draggedProduct) return;

    const draggedId = draggedProduct.id;
    const draggedOrder = getEffectiveOrder(draggedProduct);

    // Product that was at the target position before the drag
    const displacedProduct = filteredProducts[evt.newIndex];
    if (!displacedProduct) return;

    const displacedOrder = getEffectiveOrder(displacedProduct);

    if (draggedOrder != null && displacedOrder != null) {
      // Both have orders → direct swap
      pendingChanges.set(draggedId, { id: draggedId, ordem: displacedOrder });
      pendingChanges.set(displacedProduct.id, { id: displacedProduct.id, ordem: draggedOrder });
      showToast(`Troca: #${draggedOrder} ↔ #${displacedOrder}`);
    } else {
      // At least one has no order → calculate from neighbor above
      const newOrder = calculateNewOrder(evt.newIndex);

      // Check for conflict with another product
      const conflict = allProducts.find(p =>
        p.id !== draggedId && getEffectiveOrder(p) === newOrder
      );

      if (conflict) {
        // Swap: conflict gets the dragged item's old order (may be null)
        pendingChanges.set(conflict.id, { id: conflict.id, ordem: draggedOrder });
        showToast(`${draggedProduct.nome} → #${newOrder} (trocou com ${conflict.nome})`);
      } else {
        showToast(`${draggedProduct.nome} → #${newOrder}`);
      }

      pendingChanges.set(draggedId, { id: draggedId, ordem: newOrder });
    }

    updateChangesUI();
    updateStats();
    applyFilters();
  }

  // === Modal ===
  function openModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    activeModalProduct = product;
    const currentOrder = getEffectiveOrder(product);

    // Handle image with fallback
    if (product.foto) {
      modalImg.src = product.foto;
      modalImg.alt = product.nome;
      modalImg.classList.remove('no-img');
      modalImg.textContent = '';
      modalImg.onerror = function () {
        this.src = '';
        this.classList.add('no-img');
        this.alt = '';
        this.textContent = '🍎';
      };
    } else {
      modalImg.src = '';
      modalImg.alt = '';
      modalImg.classList.add('no-img');
      modalImg.textContent = '🍎';
    }

    modalName.textContent = product.nome || 'Sem nome';
    const cat = (product.categoria || [])[0] || '';
    modalCat.textContent = cat;
    modalCat.hidden = !cat;
    modalOrderInput.value = currentOrder ?? '';
    modalSwapInfo.hidden = true;

    modalOverlay.removeAttribute('hidden');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalOrderInput.focus();
    checkSwapConflict();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    activeModalProduct = null;
  }

  function checkSwapConflict() {
    const newOrder = parseInt(modalOrderInput.value);
    if (isNaN(newOrder) || !activeModalProduct) {
      modalSwapInfo.hidden = true;
      return;
    }

    const conflict = allProducts.find(p =>
      p.id !== activeModalProduct.id && getEffectiveOrder(p) === newOrder
    );

    if (conflict) {
      modalSwapInfo.textContent = `Slot #${newOrder} ocupado por "${conflict.nome}". Sera trocado automaticamente.`;
      modalSwapInfo.hidden = false;
    } else {
      modalSwapInfo.hidden = true;
    }
  }

  function applyModalOrder() {
    if (!activeModalProduct) return;

    const newOrder = parseInt(modalOrderInput.value);
    if (isNaN(newOrder) || newOrder < 1) {
      showToast('Informe um numero valido');
      return;
    }

    const currentOrder = getEffectiveOrder(activeModalProduct);

    // Check for conflict and swap
    const conflict = allProducts.find(p =>
      p.id !== activeModalProduct.id && getEffectiveOrder(p) === newOrder
    );

    if (conflict) {
      // Swap: give the conflict product the current order of activeProduct
      if (currentOrder != null) {
        pendingChanges.set(conflict.id, { id: conflict.id, ordem: currentOrder });
      } else {
        // activeProduct had no order, set conflict to a high number
        pendingChanges.set(conflict.id, { id: conflict.id, ordem: 9999 });
      }
      showToast(`Troca: ${activeModalProduct.nome} → #${newOrder}, ${conflict.nome} → #${currentOrder ?? 9999}`);
    } else {
      showToast(`${activeModalProduct.nome} → #${newOrder}`);
    }

    pendingChanges.set(activeModalProduct.id, { id: activeModalProduct.id, ordem: newOrder });

    updateChangesUI();
    updateStats();
    closeModal();
    applyFilters();
  }

  // === Save All ===
  async function handleSaveAll() {
    if (pendingChanges.size === 0) return;

    const updates = [...pendingChanges.values()];
    btnSaveAll.disabled = true;
    btnSaveAll.textContent = 'Salvando...';

    try {
      await saveChanges(updates);

      // Apply changes to local state
      updates.forEach(u => {
        const product = allProducts.find(p => p.id === u.id);
        if (product) product.ordem = u.ordem;
      });

      pendingChanges.clear();
      updateChangesUI();
      updateStats();
      applyFilters();
      showToast(`${updates.length} produto(s) atualizado(s)!`);
    } catch (err) {
      showToast(`Erro ao salvar: ${err.message}`);
    } finally {
      btnSaveAll.textContent = 'Salvar Alteracoes';
      btnSaveAll.disabled = pendingChanges.size === 0;
    }
  }

  // === Export CSV ===
  function exportCSV() {
    const sorted = [...allProducts].sort((a, b) => {
      const oA = getEffectiveOrder(a);
      const oB = getEffectiveOrder(b);
      if (oA == null && oB == null) return a.nome.localeCompare(b.nome);
      if (oA == null) return 1;
      if (oB == null) return -1;
      return oA - oB;
    });

    const header = ['unique id', 'nome', 'ordem_prateleira', 'categoria', 'cod', 'preco', 'estoque'];
    const rows = sorted.map(p => {
      const ordem = getEffectiveOrder(p);
      return [
        p.id,
        `"${(p.nome || '').replace(/"/g, '""')}"`,
        ordem ?? '',
        `"${(p.categoria || []).join(', ')}"`,
        `"${(p.cod || '').replace(/"/g, '""')}"`,
        p.preco ?? 0,
        p.estoque ?? 0
      ].join(',');
    });

    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordenacao-prateleira-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`CSV exportado: ${sorted.length} produtos`);
  }

  // === Event Listeners ===
  function setupEvents() {
    searchInput.addEventListener('input', () => {
      searchClear.hidden = !searchInput.value;
      applyFilters();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.hidden = true;
      applyFilters();
    });

    filterCat.addEventListener('change', applyFilters);
    filterSort.addEventListener('change', applyFilters);

    btnSaveAll.addEventListener('click', handleSaveAll);
    btnExportCsv.addEventListener('click', exportCSV);

    // Product card tap (not drag)
    productList.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      // Don't open modal if user clicked the drag handle
      if (e.target.closest('.product-card__drag-handle')) return;
      openModal(card.dataset.id);
    });

    // Modal events
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    btnModalCancel.addEventListener('click', closeModal);
    btnModalSave.addEventListener('click', applyModalOrder);

    modalOrderInput.addEventListener('input', checkSwapConflict);

    btnOrderPrev.addEventListener('click', () => {
      const val = parseInt(modalOrderInput.value) || 1;
      if (val > 1) {
        modalOrderInput.value = val - 1;
        checkSwapConflict();
      }
    });

    btnOrderNext.addEventListener('click', () => {
      const val = parseInt(modalOrderInput.value) || 0;
      modalOrderInput.value = val + 1;
      checkSwapConflict();
    });

    modalOrderInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyModalOrder();
      if (e.key === 'Escape') closeModal();
    });
  }

  // === Init ===
  async function init() {
    setupEvents();
    loadingEl.hidden = false;

    try {
      allProducts = await fetchProducts();

      // Populate category filter
      const cats = getAllCategories(allProducts);
      cats.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        filterCat.appendChild(opt);
      });

      updateStats();
      applyFilters();
    } catch (err) {
      showToast(`Erro ao carregar: ${err.message}`);
      console.error(err);
    } finally {
      loadingEl.hidden = true;
    }
  }

  init();
})();
