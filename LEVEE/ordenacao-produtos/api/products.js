const BUBBLE_API_URL = process.env.BUBBLE_API_URL || 'https://leveehort.com.br/version-test/api/1.1/obj';
const BUBBLE_API_KEY = process.env.BUBBLE_API_KEY;

async function fetchAllProducts() {
  const allProducts = [];
  let cursor = 0;
  const limit = 100;

  while (true) {
    const constraints = JSON.stringify([
      { key: 'visivel', constraint_type: 'equals', value: 'true' }
    ]);

    const url = `${BUBBLE_API_URL}/Produtos?limit=${limit}&cursor=${cursor}&constraints=${encodeURIComponent(constraints)}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${BUBBLE_API_KEY}` }
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Bubble API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const results = data.response.results;
    allProducts.push(...results);

    if (data.response.remaining === 0) break;
    cursor += limit;
  }

  return allProducts.map(p => ({
    id: p._id,
    nome: p.nome || '',
    foto: p.foto && p.foto[0] ? `https:${p.foto[0]}` : null,
    ordem: p.ordem_prateleira ?? null,
    categoria: p.categorias_produto || [],
    estoque: p.estoque ?? 0,
    visivel: p.visivel ?? false,
    cod: p.cod || '',
    preco: p.preço_novo ?? p['preço novo'] ?? 0
  }));
}

async function updateProductOrder(productId, newOrder) {
  const url = `${BUBBLE_API_URL}/Produtos/${productId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${BUBBLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ordem_prateleira: newOrder })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bubble PATCH error ${res.status}: ${err}`);
  }

  return { success: true, id: productId, ordem: newOrder };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!BUBBLE_API_KEY) {
    return res.status(500).json({ error: 'BUBBLE_API_KEY not configured' });
  }

  try {
    if (req.method === 'GET') {
      const products = await fetchAllProducts();
      return res.status(200).json({ products, total: products.length });
    }

    if (req.method === 'PATCH') {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: 'Body must contain "updates" array with [{id, ordem}]' });
      }

      const results = await Promise.all(
        updates.map(u => updateProductOrder(u.id, u.ordem))
      );

      return res.status(200).json({ results });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
