const fs = require('fs');

console.log('📊 LEVEE HORTIPLUS - ANÁLISE DEMOGRÁFICA + VENDAS\n');
console.log('Carregando dados de 4 tabelas...\n');

// Carregar todas as tabelas
const users = JSON.parse(fs.readFileSync('./banco de dados/export-users.json', 'utf8'));
const enderecos = JSON.parse(fs.readFileSync('./banco de dados/export-enderecos.json', 'utf8'));
const pedidos = JSON.parse(fs.readFileSync('./banco de dados/export_pedidos.json', 'utf8'));
const produtos = JSON.parse(fs.readFileSync('./banco de dados/export_produtos.json', 'utf8'));

console.log(`✅ ${users.length} usuários carregados`);
console.log(`✅ ${enderecos.length} endereços carregados`);
console.log(`✅ ${pedidos.length} pedidos carregados`);
console.log(`✅ ${produtos.length} produtos carregados\n`);

// Criar índices para performance
const userMap = new Map(users.map(u => [u.email, u]));
const enderecoMap = new Map(enderecos.map(e => [e['unique id'], e]));
const produtoMap = new Map(produtos.map(p => [p['unique id'], p]));

// Criar mapa de endereços por usuário (email)
const enderecosPorUser = {};
enderecos.forEach(e => {
    if (e.user) {
        if (!enderecosPorUser[e.user]) {
            enderecosPorUser[e.user] = [];
        }
        enderecosPorUser[e.user].push(e);
    }
});

// Filtrar apenas pedidos concluídos/pagos
const pedidosConcluidos = pedidos.filter(p =>
    p.status_pedido &&
    (p.status_pedido.toLowerCase().includes('concluído') ||
     p.status_pedido.toLowerCase().includes('entregue') ||
     p.pago === 'sim')
);

console.log(`📦 Total de pedidos no sistema: ${pedidos.length}`);
console.log(`✅ Pedidos concluídos/pagos: ${pedidosConcluidos.length}\n`);

// ============================================
// ANÁLISE 1: VENDAS POR REGIÃO (BAIRRO)
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. VENDAS POR BAIRRO (TOP 20)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendasPorBairro = {};

pedidosConcluidos.forEach(pedido => {
    // Tentar pegar endereço pelo ID ou pelo user (primeiro endereço do cliente)
    let endereco = enderecoMap.get(pedido.endereço_entrega);

    if (!endereco && pedido.user && enderecosPorUser[pedido.user]) {
        // Pegar o primeiro endereço do cliente
        endereco = enderecosPorUser[pedido.user][0];
    }

    if (endereco && endereco.bairro) {
        const bairro = endereco.bairro;
        if (!vendasPorBairro[bairro]) {
            vendasPorBairro[bairro] = {
                pedidos: 0,
                faturamento: 0,
                clientes: new Set()
            };
        }
        vendasPorBairro[bairro].pedidos++;
        vendasPorBairro[bairro].faturamento += parseFloat(pedido.total || 0);
        if (pedido.user) {
            vendasPorBairro[bairro].clientes.add(pedido.user);
        }
    }
});

// Converter Set para contagem
Object.keys(vendasPorBairro).forEach(bairro => {
    vendasPorBairro[bairro].clientes = vendasPorBairro[bairro].clientes.size;
    vendasPorBairro[bairro].ticketMedio = vendasPorBairro[bairro].faturamento / vendasPorBairro[bairro].pedidos;
});

// Top 20 bairros por faturamento
const top20Bairros = Object.entries(vendasPorBairro)
    .sort((a, b) => b[1].faturamento - a[1].faturamento)
    .slice(0, 20);

console.log('Ranking   Bairro                        Pedidos  Faturamento    Clientes  Ticket Médio');
console.log('────────────────────────────────────────────────────────────────────────────────────────');
top20Bairros.forEach(([bairro, dados], index) => {
    console.log(
        `${(index + 1).toString().padStart(2)}.       ` +
        `${bairro.padEnd(25)} ` +
        `${dados.pedidos.toString().padStart(7)} ` +
        `R$ ${dados.faturamento.toFixed(2).padStart(10)} ` +
        `${dados.clientes.toString().padStart(8)} ` +
        `R$ ${dados.ticketMedio.toFixed(2).padStart(7)}`
    );
});

console.log();

// ============================================
// ANÁLISE 2: VENDAS POR CIDADE
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2. VENDAS POR CIDADE (TOP 10)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendasPorCidade = {};

pedidosConcluidos.forEach(pedido => {
    // Tentar pegar endereço pelo ID ou pelo user (primeiro endereço do cliente)
    let endereco = enderecoMap.get(pedido.endereço_entrega);

    if (!endereco && pedido.user && enderecosPorUser[pedido.user]) {
        endereco = enderecosPorUser[pedido.user][0];
    }

    if (endereco && endereco.cidade) {
        const cidade = endereco.cidade;
        if (!vendasPorCidade[cidade]) {
            vendasPorCidade[cidade] = {
                pedidos: 0,
                faturamento: 0,
                clientes: new Set()
            };
        }
        vendasPorCidade[cidade].pedidos++;
        vendasPorCidade[cidade].faturamento += parseFloat(pedido.total || 0);
        if (pedido.user) {
            vendasPorCidade[cidade].clientes.add(pedido.user);
        }
    }
});

Object.keys(vendasPorCidade).forEach(cidade => {
    vendasPorCidade[cidade].clientes = vendasPorCidade[cidade].clientes.size;
    vendasPorCidade[cidade].ticketMedio = vendasPorCidade[cidade].faturamento / vendasPorCidade[cidade].pedidos;
});

const top10Cidades = Object.entries(vendasPorCidade)
    .sort((a, b) => b[1].faturamento - a[1].faturamento)
    .slice(0, 10);

console.log('Ranking   Cidade                        Pedidos  Faturamento    Clientes  Ticket Médio');
console.log('────────────────────────────────────────────────────────────────────────────────────────');
top10Cidades.forEach(([cidade, dados], index) => {
    console.log(
        `${(index + 1).toString().padStart(2)}.       ` +
        `${cidade.padEnd(25)} ` +
        `${dados.pedidos.toString().padStart(7)} ` +
        `R$ ${dados.faturamento.toFixed(2).padStart(10)} ` +
        `${dados.clientes.toString().padStart(8)} ` +
        `R$ ${dados.ticketMedio.toFixed(2).padStart(7)}`
    );
});

console.log();

// ============================================
// ANÁLISE 3: PRODUTOS MAIS VENDIDOS POR REGIÃO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('3. PRODUTOS MAIS VENDIDOS POR REGIÃO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Analisar itens da sacola
const produtosPorBairro = {};

pedidosConcluidos.forEach(pedido => {
    // Tentar pegar endereço pelo ID ou pelo user
    let endereco = enderecoMap.get(pedido.endereço_entrega);

    if (!endereco && pedido.user && enderecosPorUser[pedido.user]) {
        endereco = enderecosPorUser[pedido.user][0];
    }

    if (endereco && endereco.bairro && pedido.sacola_itens) {
        const bairro = endereco.bairro;

        if (!produtosPorBairro[bairro]) {
            produtosPorBairro[bairro] = {};
        }

        // Parsear sacola_itens (pode ser string separada por vírgula ou array)
        let itens = [];
        if (typeof pedido.sacola_itens === 'string') {
            itens = pedido.sacola_itens.split(',').map(i => i.trim()).filter(i => i);
        } else if (Array.isArray(pedido.sacola_itens)) {
            itens = pedido.sacola_itens;
        }

        itens.forEach(itemId => {
            if (!produtosPorBairro[bairro][itemId]) {
                produtosPorBairro[bairro][itemId] = 0;
            }
            produtosPorBairro[bairro][itemId]++;
        });
    }
});

// Top 3 bairros com mais vendas
console.log('📍 TOP 5 PRODUTOS POR BAIRRO (Top 3 bairros):\n');

top20Bairros.slice(0, 3).forEach(([bairro, dadosVendas], idx) => {
    console.log(`${idx + 1}. ${bairro.toUpperCase()} (${dadosVendas.pedidos} pedidos, R$ ${dadosVendas.faturamento.toFixed(2)})`);
    console.log('   ────────────────────────────────────────────────────');

    if (produtosPorBairro[bairro]) {
        const topProdutos = Object.entries(produtosPorBairro[bairro])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        topProdutos.forEach(([prodId, qtd], i) => {
            console.log(`   ${i + 1}º) Produto ID: ${prodId.substring(0, 20)}... (${qtd}x)`);
        });
    } else {
        console.log('   (Sem dados de produtos)');
    }
    console.log();
});

// ============================================
// ANÁLISE 4: MÉTRICAS GLOBAIS DE VENDAS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('4. MÉTRICAS GLOBAIS DE VENDAS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const faturamentoTotal = pedidosConcluidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
const ticketMedioGlobal = faturamentoTotal / pedidosConcluidos.length;

// Clientes únicos que compraram
const clientesCompradores = new Set(pedidosConcluidos.filter(p => p.user).map(p => p.user));
const taxaConversao = (clientesCompradores.size / users.length) * 100;

// Pedidos por cliente
const pedidosPorCliente = {};
pedidosConcluidos.forEach(p => {
    if (p.user) {
        pedidosPorCliente[p.user] = (pedidosPorCliente[p.user] || 0) + 1;
    }
});

const frequenciaCompra = Object.values(pedidosPorCliente);
const mediaComprasPorCliente = frequenciaCompra.reduce((a, b) => a + b, 0) / frequenciaCompra.length;

console.log(`💰 Faturamento Total: R$ ${faturamentoTotal.toFixed(2)}`);
console.log(`🎫 Ticket Médio Global: R$ ${ticketMedioGlobal.toFixed(2)}`);
console.log(`👥 Total de Clientes Cadastrados: ${users.length}`);
console.log(`🛒 Clientes que Compraram: ${clientesCompradores.size} (${taxaConversao.toFixed(1)}%)`);
console.log(`📦 Total de Pedidos Concluídos: ${pedidosConcluidos.length}`);
console.log(`🔁 Média de Compras por Cliente: ${mediaComprasPorCliente.toFixed(2)}`);

// Distribuição de frequência
const freq1 = frequenciaCompra.filter(f => f === 1).length;
const freq2_3 = frequenciaCompra.filter(f => f >= 2 && f <= 3).length;
const freq4_10 = frequenciaCompra.filter(f => f >= 4 && f <= 10).length;
const freq10plus = frequenciaCompra.filter(f => f > 10).length;

console.log(`\n📊 Distribuição de Frequência de Compra:`);
console.log(`   1 compra:         ${freq1.toString().padStart(5)} clientes (${((freq1/frequenciaCompra.length)*100).toFixed(1)}%)`);
console.log(`   2-3 compras:      ${freq2_3.toString().padStart(5)} clientes (${((freq2_3/frequenciaCompra.length)*100).toFixed(1)}%)`);
console.log(`   4-10 compras:     ${freq4_10.toString().padStart(5)} clientes (${((freq4_10/frequenciaCompra.length)*100).toFixed(1)}%)`);
console.log(`   10+ compras:      ${freq10plus.toString().padStart(5)} clientes (${((freq10plus/frequenciaCompra.length)*100).toFixed(1)}%)`);

console.log();

// ============================================
// ANÁLISE 5: FORMAS DE PAGAMENTO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('5. DISTRIBUIÇÃO POR FORMA DE PAGAMENTO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const formasPagamento = {};
pedidosConcluidos.forEach(p => {
    const forma = p['forma de pagamento'] || p.pagamento_selecionado || 'Não informado';
    if (!formasPagamento[forma]) {
        formasPagamento[forma] = {
            count: 0,
            faturamento: 0
        };
    }
    formasPagamento[forma].count++;
    formasPagamento[forma].faturamento += parseFloat(p.total || 0);
});

Object.entries(formasPagamento)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([forma, dados]) => {
        const percent = (dados.count / pedidosConcluidos.length * 100).toFixed(1);
        const ticketMedio = dados.faturamento / dados.count;
        console.log(
            `${forma.padEnd(30)} ` +
            `${dados.count.toString().padStart(5)} pedidos (${percent.padStart(5)}%) ` +
            `R$ ${dados.faturamento.toFixed(2).padStart(12)} ` +
            `(Ticket: R$ ${ticketMedio.toFixed(2)})`
        );
    });

console.log();

// ============================================
// EXPORTAR RESULTADO
// ============================================
const resultado = {
    data_analise: new Date().toISOString(),
    metricas_globais: {
        total_usuarios: users.length,
        total_enderecos: enderecos.length,
        total_pedidos: pedidos.length,
        pedidos_concluidos: pedidosConcluidos.length,
        clientes_compradores: clientesCompradores.size,
        taxa_conversao: taxaConversao.toFixed(2),
        faturamento_total: faturamentoTotal.toFixed(2),
        ticket_medio_global: ticketMedioGlobal.toFixed(2),
        media_compras_por_cliente: mediaComprasPorCliente.toFixed(2)
    },
    vendas_por_bairro: Object.fromEntries(
        top20Bairros.map(([bairro, dados]) => [
            bairro,
            {
                pedidos: dados.pedidos,
                faturamento: parseFloat(dados.faturamento.toFixed(2)),
                clientes: dados.clientes,
                ticket_medio: parseFloat(dados.ticketMedio.toFixed(2))
            }
        ])
    ),
    vendas_por_cidade: Object.fromEntries(
        top10Cidades.map(([cidade, dados]) => [
            cidade,
            {
                pedidos: dados.pedidos,
                faturamento: parseFloat(dados.faturamento.toFixed(2)),
                clientes: dados.clientes,
                ticket_medio: parseFloat(dados.ticketMedio.toFixed(2))
            }
        ])
    ),
    formas_pagamento: Object.fromEntries(
        Object.entries(formasPagamento).map(([forma, dados]) => [
            forma,
            {
                count: dados.count,
                percentual: ((dados.count / pedidosConcluidos.length) * 100).toFixed(2),
                faturamento: parseFloat(dados.faturamento.toFixed(2)),
                ticket_medio: parseFloat((dados.faturamento / dados.count).toFixed(2))
            }
        ])
    ),
    distribuicao_frequencia: {
        '1_compra': freq1,
        '2_3_compras': freq2_3,
        '4_10_compras': freq4_10,
        '10_plus_compras': freq10plus
    }
};

fs.writeFileSync('./analise-demografica-vendas-resultado.json', JSON.stringify(resultado, null, 2));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Análise concluída! ✨');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📄 Resultado exportado para: analise-demografica-vendas-resultado.json\n');
