const fs = require('fs');

console.log('📊 LEVEE HORTIPLUS - ANÁLISE COMPLETA: TEMPORAL + PRODUTOS\n');
console.log('Carregando dados...\n');

// Carregar todas as tabelas
const users = JSON.parse(fs.readFileSync('./banco de dados/export-users.json', 'utf8'));
const enderecos = JSON.parse(fs.readFileSync('./banco de dados/export-enderecos.json', 'utf8'));
const pedidos = JSON.parse(fs.readFileSync('./banco de dados/export_pedidos.json', 'utf8'));
const produtos = JSON.parse(fs.readFileSync('./banco de dados/export_produtos.json', 'utf8'));

// Carregar sacola-itens com tratamento de erro
let sacolaItens = [];
try {
    const sacolaData = fs.readFileSync('./banco de dados/export_sacola-itens.json', 'utf8');
    sacolaItens = JSON.parse(sacolaData);
    console.log('✅ Sacola-itens carregada com sucesso');
} catch (error) {
    console.log('⚠️  Erro ao carregar sacola-itens, continuando sem análise de produtos por item');
    console.log(`   Motivo: ${error.message}\n`);
}

console.log(`✅ ${users.length} usuários carregados`);
console.log(`✅ ${enderecos.length} endereços carregados`);
console.log(`✅ ${pedidos.length} pedidos carregados`);
console.log(`✅ ${produtos.length} produtos carregados`);
console.log(`✅ ${sacolaItens.length} itens de sacola carregados\n`);

// Criar índices para performance
const userMap = new Map(users.map(u => [u.email, u]));
const enderecoMap = new Map(enderecos.map(e => [e['unique id'], e]));
const produtoMap = new Map(produtos.map(p => [p['unique id'], p]));

// Criar mapa de endereços por usuário
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

console.log(`📦 Total de pedidos: ${pedidos.length}`);
console.log(`✅ Pedidos concluídos: ${pedidosConcluidos.length}\n`);

// ============================================
// ANÁLISE TEMPORAL 1: VENDAS POR DIA DA SEMANA
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. ANÁLISE POR DIA DA SEMANA');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const vendasPorDiaSemana = {
    'Domingo': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Segunda': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Terça': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Quarta': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Quinta': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Sexta': { pedidos: 0, faturamento: 0, clientes: new Set() },
    'Sábado': { pedidos: 0, faturamento: 0, clientes: new Set() }
};

pedidosConcluidos.forEach(pedido => {
    if (pedido['Creation Date'] || pedido.data_pedido) {
        const data = new Date(pedido['Creation Date'] || pedido.data_pedido);
        if (isNaN(data.getTime())) return; // Skip invalid dates
        const diaSemana = diasSemana[data.getDay()];

        vendasPorDiaSemana[diaSemana].pedidos++;
        vendasPorDiaSemana[diaSemana].faturamento += parseFloat(pedido.total || 0);
        if (pedido.user) {
            vendasPorDiaSemana[diaSemana].clientes.add(pedido.user);
        }
    }
});

console.log('Dia         Pedidos    Faturamento      Clientes  Ticket Médio  % do Total');
console.log('──────────────────────────────────────────────────────────────────────────────');

const totalPedidosSemana = Object.values(vendasPorDiaSemana).reduce((sum, d) => sum + d.pedidos, 0);

diasSemana.forEach(dia => {
    const dados = vendasPorDiaSemana[dia];
    const ticketMedio = dados.pedidos > 0 ? dados.faturamento / dados.pedidos : 0;
    const percentual = totalPedidosSemana > 0 ? (dados.pedidos / totalPedidosSemana * 100) : 0;

    console.log(
        `${dia.padEnd(10)} ` +
        `${dados.pedidos.toString().padStart(7)} ` +
        `R$ ${dados.faturamento.toFixed(2).padStart(12)} ` +
        `${dados.clientes.size.toString().padStart(9)} ` +
        `R$ ${ticketMedio.toFixed(2).padStart(9)} ` +
        `${percentual.toFixed(1).padStart(6)}%`
    );
});

// Identificar melhor e pior dia
const diasOrdenados = diasSemana.map(dia => ({
    dia,
    ...vendasPorDiaSemana[dia],
    ticketMedio: vendasPorDiaSemana[dia].pedidos > 0 ? vendasPorDiaSemana[dia].faturamento / vendasPorDiaSemana[dia].pedidos : 0
})).sort((a, b) => b.faturamento - a.faturamento);

console.log(`\n🏆 Melhor dia: ${diasOrdenados[0].dia} (R$ ${diasOrdenados[0].faturamento.toFixed(2)})`);
console.log(`📉 Dia mais fraco: ${diasOrdenados[diasOrdenados.length - 1].dia} (R$ ${diasOrdenados[diasOrdenados.length - 1].faturamento.toFixed(2)})\n`);

// ============================================
// ANÁLISE TEMPORAL 2: VENDAS POR MÊS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2. ANÁLISE POR MÊS (SAZONALIDADE)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendasPorMes = {};

pedidosConcluidos.forEach(pedido => {
    if (pedido['Creation Date'] || pedido.data_pedido) {
        const data = new Date(pedido['Creation Date'] || pedido.data_pedido);
        if (isNaN(data.getTime())) return;
        const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

        if (!vendasPorMes[mesAno]) {
            vendasPorMes[mesAno] = {
                pedidos: 0,
                faturamento: 0,
                clientes: new Set()
            };
        }

        vendasPorMes[mesAno].pedidos++;
        vendasPorMes[mesAno].faturamento += parseFloat(pedido.total || 0);
        if (pedido.user) {
            vendasPorMes[mesAno].clientes.add(pedido.user);
        }
    }
});

// Ordenar por mês
const mesesOrdenados = Object.entries(vendasPorMes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([mesAno, dados]) => ({
        mesAno,
        ...dados,
        ticketMedio: dados.pedidos > 0 ? dados.faturamento / dados.pedidos : 0
    }));

console.log('Mês         Pedidos    Faturamento      Clientes  Ticket Médio  Crescimento');
console.log('─────────────────────────────────────────────────────────────────────────────────');

mesesOrdenados.forEach((mes, idx) => {
    let crescimento = '';
    if (idx > 0) {
        const variacaoPercent = ((mes.faturamento - mesesOrdenados[idx - 1].faturamento) / mesesOrdenados[idx - 1].faturamento * 100);
        crescimento = variacaoPercent >= 0 ? `+${variacaoPercent.toFixed(1)}%` : `${variacaoPercent.toFixed(1)}%`;
    } else {
        crescimento = '-';
    }

    console.log(
        `${mes.mesAno.padEnd(10)} ` +
        `${mes.pedidos.toString().padStart(7)} ` +
        `R$ ${mes.faturamento.toFixed(2).padStart(12)} ` +
        `${mes.clientes.size.toString().padStart(9)} ` +
        `R$ ${mes.ticketMedio.toFixed(2).padStart(9)} ` +
        `${crescimento.padStart(12)}`
    );
});

// Top 3 meses
const top3Meses = [...mesesOrdenados].sort((a, b) => b.faturamento - a.faturamento).slice(0, 3);
console.log(`\n🏆 Top 3 Meses por Faturamento:`);
top3Meses.forEach((mes, idx) => {
    console.log(`   ${idx + 1}. ${mes.mesAno}: R$ ${mes.faturamento.toFixed(2)} (${mes.pedidos} pedidos)`);
});
console.log();

// ============================================
// ANÁLISE TEMPORAL 3: VENDAS POR SEMANA
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('3. ANÁLISE POR SEMANA (ÚLTIMAS 12 SEMANAS)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendasPorSemana = {};

pedidosConcluidos.forEach(pedido => {
    if (pedido['Creation Date'] || pedido.data_pedido) {
        const data = new Date(pedido['Creation Date'] || pedido.data_pedido);
        if (isNaN(data.getTime())) return;

        // Calcular número da semana do ano
        const inicioAno = new Date(data.getFullYear(), 0, 1);
        const dias = Math.floor((data - inicioAno) / (24 * 60 * 60 * 1000));
        const numeroSemana = Math.ceil((dias + inicioAno.getDay() + 1) / 7);
        const semanaAno = `${data.getFullYear()}-S${String(numeroSemana).padStart(2, '0')}`;

        if (!vendasPorSemana[semanaAno]) {
            vendasPorSemana[semanaAno] = {
                pedidos: 0,
                faturamento: 0,
                clientes: new Set(),
                dataInicio: data
            };
        }

        vendasPorSemana[semanaAno].pedidos++;
        vendasPorSemana[semanaAno].faturamento += parseFloat(pedido.total || 0);
        if (pedido.user) {
            vendasPorSemana[semanaAno].clientes.add(pedido.user);
        }
    }
});

// Ordenar e pegar últimas 12 semanas
const semanasOrdenadas = Object.entries(vendasPorSemana)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 12)
    .reverse()
    .map(([semana, dados]) => ({
        semana,
        ...dados,
        ticketMedio: dados.pedidos > 0 ? dados.faturamento / dados.pedidos : 0
    }));

console.log('Semana      Pedidos    Faturamento      Clientes  Ticket Médio  Variação');
console.log('─────────────────────────────────────────────────────────────────────────────');

semanasOrdenadas.forEach((semana, idx) => {
    let variacao = '';
    if (idx > 0) {
        const variacaoPercent = ((semana.faturamento - semanasOrdenadas[idx - 1].faturamento) / semanasOrdenadas[idx - 1].faturamento * 100);
        variacao = variacaoPercent >= 0 ? `+${variacaoPercent.toFixed(1)}%` : `${variacaoPercent.toFixed(1)}%`;
    } else {
        variacao = '-';
    }

    console.log(
        `${semana.semana.padEnd(10)} ` +
        `${semana.pedidos.toString().padStart(7)} ` +
        `R$ ${semana.faturamento.toFixed(2).padStart(12)} ` +
        `${semana.clientes.size.toString().padStart(9)} ` +
        `R$ ${semana.ticketMedio.toFixed(2).padStart(9)} ` +
        `${variacao.padStart(9)}`
    );
});

console.log();

// ============================================
// ANÁLISE TEMPORAL 4: HORÁRIO DE PEDIDOS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('4. ANÁLISE POR HORÁRIO DO DIA');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendasPorHorario = {};
for (let h = 0; h < 24; h++) {
    vendasPorHorario[h] = { pedidos: 0, faturamento: 0 };
}

pedidosConcluidos.forEach(pedido => {
    if (pedido['Creation Date'] || pedido.data_pedido) {
        const data = new Date(pedido['Creation Date'] || pedido.data_pedido);
        if (isNaN(data.getTime())) return;
        const hora = data.getHours();

        vendasPorHorario[hora].pedidos++;
        vendasPorHorario[hora].faturamento += parseFloat(pedido.total || 0);
    }
});

// Agrupar por períodos do dia
const periodos = {
    'Madrugada (0h-6h)': { pedidos: 0, faturamento: 0 },
    'Manhã (6h-12h)': { pedidos: 0, faturamento: 0 },
    'Tarde (12h-18h)': { pedidos: 0, faturamento: 0 },
    'Noite (18h-24h)': { pedidos: 0, faturamento: 0 }
};

Object.entries(vendasPorHorario).forEach(([hora, dados]) => {
    const h = parseInt(hora);
    if (h >= 0 && h < 6) {
        periodos['Madrugada (0h-6h)'].pedidos += dados.pedidos;
        periodos['Madrugada (0h-6h)'].faturamento += dados.faturamento;
    } else if (h >= 6 && h < 12) {
        periodos['Manhã (6h-12h)'].pedidos += dados.pedidos;
        periodos['Manhã (6h-12h)'].faturamento += dados.faturamento;
    } else if (h >= 12 && h < 18) {
        periodos['Tarde (12h-18h)'].pedidos += dados.pedidos;
        periodos['Tarde (12h-18h)'].faturamento += dados.faturamento;
    } else {
        periodos['Noite (18h-24h)'].pedidos += dados.pedidos;
        periodos['Noite (18h-24h)'].faturamento += dados.faturamento;
    }
});

console.log('Período            Pedidos    Faturamento      % Pedidos  Ticket Médio');
console.log('────────────────────────────────────────────────────────────────────────');

const totalPedidosHorario = Object.values(periodos).reduce((sum, p) => sum + p.pedidos, 0);

Object.entries(periodos).forEach(([periodo, dados]) => {
    const percent = totalPedidosHorario > 0 ? (dados.pedidos / totalPedidosHorario * 100) : 0;
    const ticketMedio = dados.pedidos > 0 ? dados.faturamento / dados.pedidos : 0;

    console.log(
        `${periodo.padEnd(17)} ` +
        `${dados.pedidos.toString().padStart(7)} ` +
        `R$ ${dados.faturamento.toFixed(2).padStart(12)} ` +
        `${percent.toFixed(1).padStart(9)}% ` +
        `R$ ${ticketMedio.toFixed(2)}`
    );
});

console.log();

// ============================================
// ANÁLISE DE PRODUTOS 1: TOP PRODUTOS GLOBAIS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('5. TOP 20 PRODUTOS MAIS VENDIDOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendaProdutos = {};

// Processar produtos a partir do campo sacola_itens dos pedidos (nomes, não IDs)
pedidosConcluidos.forEach(pedido => {
    if (pedido.sacola_itens) {
        // sacola_itens contém nomes de produtos separados por " , "
        const nomeProdutos = pedido.sacola_itens.split(' , ').map(nome => nome.trim()).filter(n => n);

        nomeProdutos.forEach(nomeProduto => {
            if (!nomeProduto) return;

            // Buscar produto pelo nome
            let produto = null;
            for (const [id, p] of produtoMap) {
                if (p.nome_produto === nomeProduto) {
                    produto = p;
                    break;
                }
            }

            if (!vendaProdutos[nomeProduto]) {
                vendaProdutos[nomeProduto] = {
                    nome: nomeProduto,
                    categoria: produto ? produto.categoria_produtos : 'Sem categoria',
                    quantidade: 0,
                    faturamento: 0,
                    pedidos: new Set()
                };
            }

            vendaProdutos[nomeProduto].quantidade += 1;
            vendaProdutos[nomeProduto].pedidos.add(pedido['unique id']);
        });

        // Estimar faturamento distribuindo total do pedido pelos produtos
        const totalItens = nomeProdutos.length;
        if (totalItens > 0) {
            const faturamentoPorItem = parseFloat(pedido.total || 0) / totalItens;
            nomeProdutos.forEach(nomeProduto => {
                if (nomeProduto && vendaProdutos[nomeProduto]) {
                    vendaProdutos[nomeProduto].faturamento += faturamentoPorItem;
                }
            });
        }
    }
});

// Top 20 produtos
const top20Produtos = Object.entries(vendaProdutos)
    .map(([id, dados]) => ({
        id,
        ...dados,
        pedidos: dados.pedidos.size,
        precoMedio: dados.quantidade > 0 ? dados.faturamento / dados.quantidade : 0
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 20);

console.log('Rank  Produto                          Categoria           Qtd Vendida  Pedidos  Faturamento');
console.log('───────────────────────────────────────────────────────────────────────────────────────────────');

top20Produtos.forEach((produto, idx) => {
    console.log(
        `${(idx + 1).toString().padStart(3)}.  ` +
        `${produto.nome.substring(0, 30).padEnd(30)} ` +
        `${(produto.categoria || 'Sem categoria').substring(0, 18).padEnd(18)} ` +
        `${produto.quantidade.toString().padStart(11)} ` +
        `${produto.pedidos.toString().padStart(8)} ` +
        `R$ ${produto.faturamento.toFixed(2).padStart(10)}`
    );
});

console.log();

// ============================================
// ANÁLISE DE PRODUTOS 2: CATEGORIAS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('6. ANÁLISE POR CATEGORIA DE PRODUTOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const vendaPorCategoria = {};

Object.values(vendaProdutos).forEach(produto => {
    const categoria = produto.categoria || 'Sem categoria';

    if (!vendaPorCategoria[categoria]) {
        vendaPorCategoria[categoria] = {
            quantidade: 0,
            faturamento: 0,
            produtos: 0
        };
    }

    vendaPorCategoria[categoria].quantidade += produto.quantidade;
    vendaPorCategoria[categoria].faturamento += produto.faturamento;
    vendaPorCategoria[categoria].produtos++;
});

const categoriasOrdenadas = Object.entries(vendaPorCategoria)
    .map(([categoria, dados]) => ({
        categoria,
        ...dados,
        ticketMedio: dados.quantidade > 0 ? dados.faturamento / dados.quantidade : 0
    }))
    .sort((a, b) => b.faturamento - a.faturamento);

console.log('Categoria                    Qtd Vendida  Faturamento      % Fat.  Produtos  Preço Médio');
console.log('──────────────────────────────────────────────────────────────────────────────────────────');

const faturamentoTotalCategorias = categoriasOrdenadas.reduce((sum, c) => sum + c.faturamento, 0);

categoriasOrdenadas.forEach(cat => {
    const percent = faturamentoTotalCategorias > 0 ? (cat.faturamento / faturamentoTotalCategorias * 100) : 0;

    console.log(
        `${cat.categoria.substring(0, 25).padEnd(25)} ` +
        `${cat.quantidade.toString().padStart(11)} ` +
        `R$ ${cat.faturamento.toFixed(2).padStart(12)} ` +
        `${percent.toFixed(1).padStart(6)}% ` +
        `${cat.produtos.toString().padStart(8)} ` +
        `R$ ${cat.ticketMedio.toFixed(2)}`
    );
});

console.log();

// ============================================
// ANÁLISE DE PRODUTOS 3: TICKET MÉDIO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('7. PRODUTOS COM MAIOR TICKET MÉDIO (TOP 10)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const produtosPorTicket = Object.entries(vendaProdutos)
    .map(([id, dados]) => ({
        id,
        nome: dados.nome,
        categoria: dados.categoria,
        quantidade: dados.quantidade,
        precoMedio: dados.quantidade > 0 ? dados.faturamento / dados.quantidade : 0
    }))
    .filter(p => p.quantidade >= 5) // Apenas produtos com vendas significativas
    .sort((a, b) => b.precoMedio - a.precoMedio)
    .slice(0, 10);

console.log('Rank  Produto                          Categoria           Preço Médio  Qtd Vendida');
console.log('──────────────────────────────────────────────────────────────────────────────────────');

produtosPorTicket.forEach((produto, idx) => {
    console.log(
        `${(idx + 1).toString().padStart(3)}.  ` +
        `${produto.nome.substring(0, 30).padEnd(30)} ` +
        `${(produto.categoria || 'Sem categoria').substring(0, 18).padEnd(18)} ` +
        `R$ ${produto.precoMedio.toFixed(2).padStart(9)} ` +
        `${produto.quantidade.toString().padStart(11)}`
    );
});

console.log();

// ============================================
// EXPORTAR RESULTADO COMPLETO
// ============================================
const resultado = {
    data_analise: new Date().toISOString(),

    // Análises temporais
    vendas_por_dia_semana: Object.fromEntries(
        diasSemana.map(dia => [
            dia,
            {
                pedidos: vendasPorDiaSemana[dia].pedidos,
                faturamento: parseFloat(vendasPorDiaSemana[dia].faturamento.toFixed(2)),
                clientes: vendasPorDiaSemana[dia].clientes.size,
                ticket_medio: vendasPorDiaSemana[dia].pedidos > 0 ?
                    parseFloat((vendasPorDiaSemana[dia].faturamento / vendasPorDiaSemana[dia].pedidos).toFixed(2)) : 0
            }
        ])
    ),

    vendas_por_mes: Object.fromEntries(
        mesesOrdenados.map(mes => [
            mes.mesAno,
            {
                pedidos: mes.pedidos,
                faturamento: parseFloat(mes.faturamento.toFixed(2)),
                clientes: mes.clientes.size,
                ticket_medio: parseFloat(mes.ticketMedio.toFixed(2))
            }
        ])
    ),

    vendas_por_semana: Object.fromEntries(
        semanasOrdenadas.map(semana => [
            semana.semana,
            {
                pedidos: semana.pedidos,
                faturamento: parseFloat(semana.faturamento.toFixed(2)),
                clientes: semana.clientes.size,
                ticket_medio: parseFloat(semana.ticketMedio.toFixed(2))
            }
        ])
    ),

    vendas_por_periodo_dia: Object.fromEntries(
        Object.entries(periodos).map(([periodo, dados]) => [
            periodo,
            {
                pedidos: dados.pedidos,
                faturamento: parseFloat(dados.faturamento.toFixed(2)),
                ticket_medio: dados.pedidos > 0 ? parseFloat((dados.faturamento / dados.pedidos).toFixed(2)) : 0,
                percentual: totalPedidosHorario > 0 ? parseFloat((dados.pedidos / totalPedidosHorario * 100).toFixed(2)) : 0
            }
        ])
    ),

    // Análises de produtos
    top_20_produtos: top20Produtos.map(p => ({
        nome: p.nome,
        categoria: p.categoria,
        quantidade: p.quantidade,
        pedidos: p.pedidos,
        faturamento: parseFloat(p.faturamento.toFixed(2)),
        preco_medio: parseFloat(p.precoMedio.toFixed(2))
    })),

    vendas_por_categoria: categoriasOrdenadas.map(cat => ({
        categoria: cat.categoria,
        quantidade: cat.quantidade,
        faturamento: parseFloat(cat.faturamento.toFixed(2)),
        produtos: cat.produtos,
        preco_medio: parseFloat(cat.ticketMedio.toFixed(2)),
        percentual: faturamentoTotalCategorias > 0 ? parseFloat((cat.faturamento / faturamentoTotalCategorias * 100).toFixed(2)) : 0
    })),

    produtos_maior_ticket: produtosPorTicket.map(p => ({
        nome: p.nome,
        categoria: p.categoria,
        preco_medio: parseFloat(p.precoMedio.toFixed(2)),
        quantidade: p.quantidade
    })),

    // Insights temporais
    insights_temporais: {
        melhor_dia_semana: diasOrdenados[0] ? diasOrdenados[0].dia : 'N/A',
        pior_dia_semana: diasOrdenados[diasOrdenados.length - 1] ? diasOrdenados[diasOrdenados.length - 1].dia : 'N/A',
        melhor_mes: top3Meses[0] ? top3Meses[0].mesAno : 'N/A',
        periodo_dia_mais_vendas: Object.entries(periodos).length > 0 ?
            Object.entries(periodos).sort((a, b) => b[1].faturamento - a[1].faturamento)[0][0] : 'N/A'
    }
};

fs.writeFileSync('./analise-temporal-produtos-resultado.json', JSON.stringify(resultado, null, 2));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Análise Temporal + Produtos concluída!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📄 Resultado exportado para: analise-temporal-produtos-resultado.json\n');
