const fs = require('fs');

console.log('🛒 LEVEE HORTIPLUS - ANÁLISE DE CARRINHO ABANDONADO\n');
console.log('Carregando dados...\n');

// Carregar tabelas
const users = JSON.parse(fs.readFileSync('./banco de dados/export-users.json', 'utf8'));
const enderecos = JSON.parse(fs.readFileSync('./banco de dados/export-enderecos.json', 'utf8'));
const pedidos = JSON.parse(fs.readFileSync('./banco de dados/export_pedidos.json', 'utf8'));
const produtos = JSON.parse(fs.readFileSync('./banco de dados/export_produtos.json', 'utf8'));

console.log(`✅ ${users.length} usuários carregados`);
console.log(`✅ ${enderecos.length} endereços carregados`);
console.log(`✅ ${pedidos.length} pedidos carregados`);
console.log(`✅ ${produtos.length} produtos carregados\n`);

// Criar índices
const userMap = new Map(users.map(u => [u.email, u]));
const produtoMap = new Map(produtos.map(p => [p['unique id'], p]));

// Separar pedidos por status
const pedidosConcluidos = pedidos.filter(p =>
    p.status_pedido &&
    (p.status_pedido.toLowerCase().includes('concluído') ||
     p.status_pedido.toLowerCase().includes('entregue') ||
     p.pago === 'sim')
);

const pedidosAbandonados = pedidos.filter(p =>
    !p.status_pedido ||
    p.status_pedido.toLowerCase().includes('cancelado') ||
    p.status_pedido.toLowerCase().includes('pendente') ||
    (p.pago === 'não' && !p.status_pedido.toLowerCase().includes('entregue'))
);

console.log(`📦 Total de pedidos: ${pedidos.length}`);
console.log(`✅ Pedidos concluídos: ${pedidosConcluidos.length}`);
console.log(`❌ Pedidos abandonados/cancelados: ${pedidosAbandonados.length}\n`);

// ============================================
// ANÁLISE 1: TAXA DE ABANDONO GERAL
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. MÉTRICAS GERAIS DE ABANDONO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const taxaAbandono = (pedidosAbandonados.length / pedidos.length * 100).toFixed(2);
const taxaConversao = (pedidosConcluidos.length / pedidos.length * 100).toFixed(2);

// Calcular valor perdido
const valorPerdido = pedidosAbandonados.reduce((sum, p) => {
    return sum + parseFloat(p.total || 0);
}, 0);

const valorConcluido = pedidosConcluidos.reduce((sum, p) => {
    return sum + parseFloat(p.total || 0);
}, 0);

const ticketMedioAbandonado = pedidosAbandonados.length > 0 ? valorPerdido / pedidosAbandonados.length : 0;
const ticketMedioConcluido = pedidosConcluidos.length > 0 ? valorConcluido / pedidosConcluidos.length : 0;

console.log(`📊 TAXA DE ABANDONO: ${taxaAbandono}%`);
console.log(`✅ TAXA DE CONVERSÃO: ${taxaConversao}%`);
console.log(`\n💰 Valor Potencial Perdido: R$ ${valorPerdido.toFixed(2)}`);
console.log(`💵 Valor Concluído: R$ ${valorConcluido.toFixed(2)}`);
console.log(`\n🎫 Ticket Médio Abandonado: R$ ${ticketMedioAbandonado.toFixed(2)}`);
console.log(`🎫 Ticket Médio Concluído: R$ ${ticketMedioConcluido.toFixed(2)}`);

if (ticketMedioAbandonado > ticketMedioConcluido) {
    const diff = ((ticketMedioAbandonado - ticketMedioConcluido) / ticketMedioConcluido * 100).toFixed(1);
    console.log(`\n⚠️  INSIGHT: Carrinhos abandonados têm ticket ${diff}% MAIOR que concluídos!`);
}

console.log();

// ============================================
// ANÁLISE 2: PERFIL DOS USUÁRIOS QUE ABANDONAM
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2. PERFIL DOS USUÁRIOS QUE ABANDONAM');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Identificar usuários únicos por comportamento
const usuariosComPedidoConcluido = new Set(pedidosConcluidos.map(p => p.user).filter(u => u));
const usuariosComPedidoAbandonado = new Set(pedidosAbandonados.map(p => p.user).filter(u => u));
const usuariosComEnderecoSemPedido = new Set();

enderecos.forEach(e => {
    if (e.user && !usuariosComPedidoConcluido.has(e.user) && !usuariosComPedidoAbandonado.has(e.user)) {
        usuariosComEnderecoSemPedido.add(e.user);
    }
});

// Usuários que abandonaram mas nunca compraram
const usuariosApenasAbandono = new Set([...usuariosComPedidoAbandonado].filter(u => !usuariosComPedidoConcluido.has(u)));

console.log(`👥 Total de usuários cadastrados: ${users.length}`);
console.log(`✅ Usuários com pedido concluído: ${usuariosComPedidoConcluido.size} (${(usuariosComPedidoConcluido.size/users.length*100).toFixed(1)}%)`);
console.log(`❌ Usuários que abandonaram carrinho: ${usuariosComPedidoAbandonado.size} (${(usuariosComPedidoAbandonado.size/users.length*100).toFixed(1)}%)`);
console.log(`🔴 Usuários APENAS com abandono (nunca compraram): ${usuariosApenasAbandono.size} (${(usuariosApenasAbandono.size/users.length*100).toFixed(1)}%)`);
console.log(`📍 Usuários com endereço mas sem pedido: ${usuariosComEnderecoSemPedido.size} (${(usuariosComEnderecoSemPedido.size/users.length*100).toFixed(1)}%)`);

// Analisar perfil demográfico dos que abandonam
const perfilAbandonoGenero = {};
const perfilAbandonoIdade = {};

usuariosApenasAbandono.forEach(email => {
    const user = userMap.get(email);
    if (user) {
        const genero = user.genero || 'Não informado';
        perfilAbandonoGenero[genero] = (perfilAbandonoGenero[genero] || 0) + 1;

        if (user.idade) {
            const idade = parseInt(user.idade);
            let faixa = 'Não informado';
            if (idade >= 18 && idade <= 24) faixa = '18-24 anos';
            else if (idade >= 25 && idade <= 34) faixa = '25-34 anos';
            else if (idade >= 35 && idade <= 44) faixa = '35-44 anos';
            else if (idade >= 45 && idade <= 54) faixa = '45-54 anos';
            else if (idade >= 55 && idade <= 64) faixa = '55-64 anos';
            else if (idade >= 65) faixa = '65+ anos';

            perfilAbandonoIdade[faixa] = (perfilAbandonoIdade[faixa] || 0) + 1;
        }
    }
});

console.log('\n📊 Perfil de Gênero (usuários apenas com abandono):');
Object.entries(perfilAbandonoGenero)
    .sort((a, b) => b[1] - a[1])
    .forEach(([genero, count]) => {
        const perc = (count / usuariosApenasAbandono.size * 100).toFixed(1);
        console.log(`   ${genero}: ${count} (${perc}%)`);
    });

console.log('\n📊 Perfil de Idade (usuários apenas com abandono):');
Object.entries(perfilAbandonoIdade)
    .sort((a, b) => b[1] - a[1])
    .forEach(([faixa, count]) => {
        const perc = (count / usuariosApenasAbandono.size * 100).toFixed(1);
        console.log(`   ${faixa}: ${count} (${perc}%)`);
    });

console.log();

// ============================================
// ANÁLISE 3: PRODUTOS MAIS ABANDONADOS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('3. PRODUTOS MAIS ABANDONADOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const produtosAbandonados = {};

pedidosAbandonados.forEach(pedido => {
    if (pedido.sacola_itens) {
        const nomeProdutos = pedido.sacola_itens.split(' , ').map(nome => nome.trim()).filter(n => n);

        nomeProdutos.forEach(nomeProduto => {
            if (!produtosAbandonados[nomeProduto]) {
                produtosAbandonados[nomeProduto] = {
                    quantidade: 0,
                    pedidos: new Set()
                };
            }
            produtosAbandonados[nomeProduto].quantidade++;
            produtosAbandonados[nomeProduto].pedidos.add(pedido['unique id']);
        });
    }
});

const top20ProdutosAbandonados = Object.entries(produtosAbandonados)
    .map(([nome, dados]) => ({
        nome,
        quantidade: dados.quantidade,
        pedidos: dados.pedidos.size
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 20);

console.log('Rank  Produto                                    Qtd    Pedidos');
console.log('─────────────────────────────────────────────────────────────────────');
top20ProdutosAbandonados.forEach((prod, idx) => {
    console.log(
        `${(idx + 1).toString().padStart(3)}.  ` +
        `${prod.nome.substring(0, 40).padEnd(40)} ` +
        `${prod.quantidade.toString().padStart(6)} ` +
        `${prod.pedidos.toString().padStart(8)}`
    );
});

console.log();

// ============================================
// ANÁLISE 4: MOTIVOS DE ABANDONO (ANÁLISE DE FORMA DE PAGAMENTO)
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('4. ANÁLISE DE FORMA DE PAGAMENTO EM ABANDONOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const formasPagamentoAbandono = {};

pedidosAbandonados.forEach(p => {
    const forma = p['forma de pagamento'] || p.pagamento_selecionado || 'Não selecionado';
    formasPagamentoAbandono[forma] = (formasPagamentoAbandono[forma] || 0) + 1;
});

console.log('Forma de Pagamento                  Abandonos     %');
console.log('────────────────────────────────────────────────────────');
Object.entries(formasPagamentoAbandono)
    .sort((a, b) => b[1] - a[1])
    .forEach(([forma, count]) => {
        const perc = (count / pedidosAbandonados.length * 100).toFixed(1);
        console.log(`${forma.padEnd(35)} ${count.toString().padStart(9)} ${perc.padStart(5)}%`);
    });

console.log();

// ============================================
// ANÁLISE 5: TEMPO DE ABANDONO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('5. ANÁLISE TEMPORAL DE ABANDONO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const abandonoPorDia = {
    'Domingo': 0, 'Segunda': 0, 'Terça': 0, 'Quarta': 0,
    'Quinta': 0, 'Sexta': 0, 'Sábado': 0
};

pedidosAbandonados.forEach(pedido => {
    if (pedido['Creation Date']) {
        const data = new Date(pedido['Creation Date']);
        if (!isNaN(data.getTime())) {
            const dia = diasSemana[data.getDay()];
            abandonoPorDia[dia]++;
        }
    }
});

console.log('Dia da Semana    Abandonos    %');
console.log('────────────────────────────────────');
diasSemana.forEach(dia => {
    const count = abandonoPorDia[dia];
    const perc = (count / pedidosAbandonados.length * 100).toFixed(1);
    console.log(`${dia.padEnd(15)} ${count.toString().padStart(9)} ${perc.padStart(5)}%`);
});

console.log();

// ============================================
// ANÁLISE 6: SEGMENTAÇÃO DE USUÁRIOS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('6. SEGMENTAÇÃO DE USUÁRIOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const segmentos = {
    'Compradores Ativos': { count: 0, descricao: 'Usuários com pedidos concluídos' },
    'Abandonadores Recuperáveis': { count: 0, descricao: 'Abandonaram mas já compraram antes' },
    'Abandonadores Críticos': { count: 0, descricao: 'Apenas abandonos, nunca compraram' },
    'Cadastrados sem Ação': { count: 0, descricao: 'Cadastrados com endereço mas sem pedido' },
    'Cadastrados Inativos': { count: 0, descricao: 'Sem endereço e sem pedido' }
};

users.forEach(user => {
    const email = user.email;

    if (usuariosComPedidoConcluido.has(email)) {
        segmentos['Compradores Ativos'].count++;
    } else if (usuariosComPedidoAbandonado.has(email) && usuariosComPedidoConcluido.has(email)) {
        segmentos['Abandonadores Recuperáveis'].count++;
    } else if (usuariosApenasAbandono.has(email)) {
        segmentos['Abandonadores Críticos'].count++;
    } else if (usuariosComEnderecoSemPedido.has(email)) {
        segmentos['Cadastrados sem Ação'].count++;
    } else {
        segmentos['Cadastrados Inativos'].count++;
    }
});

console.log('Segmento                         Usuários     %        Descrição');
console.log('─────────────────────────────────────────────────────────────────────────────────');
Object.entries(segmentos).forEach(([segmento, dados]) => {
    const perc = (dados.count / users.length * 100).toFixed(1);
    console.log(
        `${segmento.padEnd(30)} ` +
        `${dados.count.toString().padStart(8)} ` +
        `${perc.padStart(6)}%   ` +
        `${dados.descricao}`
    );
});

console.log();

// ============================================
// EXPORTAR RESULTADO
// ============================================
const resultado = {
    data_analise: new Date().toISOString(),

    metricas_gerais: {
        total_pedidos: pedidos.length,
        pedidos_concluidos: pedidosConcluidos.length,
        pedidos_abandonados: pedidosAbandonados.length,
        taxa_abandono: parseFloat(taxaAbandono),
        taxa_conversao: parseFloat(taxaConversao),
        valor_perdido: parseFloat(valorPerdido.toFixed(2)),
        valor_concluido: parseFloat(valorConcluido.toFixed(2)),
        ticket_medio_abandonado: parseFloat(ticketMedioAbandonado.toFixed(2)),
        ticket_medio_concluido: parseFloat(ticketMedioConcluido.toFixed(2))
    },

    perfil_usuarios: {
        total_usuarios: users.length,
        usuarios_com_pedido_concluido: usuariosComPedidoConcluido.size,
        usuarios_com_abandono: usuariosComPedidoAbandonado.size,
        usuarios_apenas_abandono: usuariosApenasAbandono.size,
        usuarios_endereco_sem_pedido: usuariosComEnderecoSemPedido.size
    },

    perfil_abandono_genero: perfilAbandonoGenero,
    perfil_abandono_idade: perfilAbandonoIdade,

    top_20_produtos_abandonados: top20ProdutosAbandonados,

    formas_pagamento_abandono: formasPagamentoAbandono,

    abandono_por_dia_semana: abandonoPorDia,

    segmentacao_usuarios: Object.fromEntries(
        Object.entries(segmentos).map(([seg, dados]) => [
            seg,
            {
                count: dados.count,
                percentual: parseFloat((dados.count / users.length * 100).toFixed(2)),
                descricao: dados.descricao
            }
        ])
    )
};

fs.writeFileSync('./analise-carrinho-abandonado-resultado.json', JSON.stringify(resultado, null, 2));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ Análise de Carrinho Abandonado concluída!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📄 Resultado exportado para: analise-carrinho-abandonado-resultado.json\n');
