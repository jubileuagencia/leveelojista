const fs = require('fs');

// Carregar os dados
console.log('📊 LEVEE HORTIPLUS - ANÁLISE DEMOGRÁFICA DE CLIENTES\n');
console.log('Carregando dados...\n');

const users = JSON.parse(fs.readFileSync('./banco de dados/export-users.json', 'utf8'));
const enderecos = JSON.parse(fs.readFileSync('./banco de dados/export-enderecos.json', 'utf8'));

console.log(`✅ ${users.length} usuários carregados`);
console.log(`✅ ${enderecos.length} endereços carregados\n`);

// ============================================
// 1. VALIDAÇÃO DO RELACIONAMENTO ENTRE TABELAS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. VALIDAÇÃO DE RELACIONAMENTO ENTRE TABELAS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Criar mapa de emails de usuários
const userEmails = new Set(users.map(u => u.email).filter(e => e));
const enderecosComUser = enderecos.filter(e => e.user);
const enderecosOrfaos = enderecosComUser.filter(e => !userEmails.has(e.user));

console.log(`📧 Usuários únicos com email: ${userEmails.size}`);
console.log(`📍 Endereços com campo 'user' preenchido: ${enderecosComUser.length}`);
console.log(`⚠️  Endereços órfãos (sem usuário correspondente): ${enderecosOrfaos.length}`);

// Usuários com e sem endereços
const usersComEndereco = new Set(enderecos.map(e => e.user).filter(u => u));
const usersSemEndereco = users.filter(u => u.email && !usersComEndereco.has(u.email));

console.log(`👥 Usuários com pelo menos 1 endereço: ${usersComEndereco.size}`);
console.log(`👤 Usuários sem endereço cadastrado: ${usersSemEndereco.length}\n`);

// ============================================
// 2. ANÁLISE DE GÊNERO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2. DISTRIBUIÇÃO POR GÊNERO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const generoCount = {};
users.forEach(u => {
  const genero = u.sexo || 'Não informado';
  generoCount[genero] = (generoCount[genero] || 0) + 1;
});

Object.entries(generoCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([genero, count]) => {
    const percent = ((count / users.length) * 100).toFixed(2);
    console.log(`${genero.padEnd(20)} ${count.toString().padStart(5)} (${percent}%)`);
  });

console.log();

// ============================================
// 3. ANÁLISE DE FAIXA ETÁRIA
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('3. DISTRIBUIÇÃO POR FAIXA ETÁRIA');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null;

  try {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade > 0 && idade < 120 ? idade : null;
  } catch (e) {
    return null;
  }
}

function getFaixaEtaria(idade) {
  if (!idade) return 'Não informado';
  if (idade < 18) return 'Menor de 18';
  if (idade < 25) return '18-24 anos';
  if (idade < 35) return '25-34 anos';
  if (idade < 45) return '35-44 anos';
  if (idade < 55) return '45-54 anos';
  if (idade < 65) return '55-64 anos';
  return '65+ anos';
}

const idades = users.map(u => calcularIdade(u['Data de Nascimento'])).filter(i => i);
const faixasEtarias = {};

users.forEach(u => {
  const idade = calcularIdade(u['Data de Nascimento']);
  const faixa = getFaixaEtaria(idade);
  faixasEtarias[faixa] = (faixasEtarias[faixa] || 0) + 1;
});

// Ordenar faixas etárias
const faixasOrdenadas = [
  'Menor de 18',
  '18-24 anos',
  '25-34 anos',
  '35-44 anos',
  '45-54 anos',
  '55-64 anos',
  '65+ anos',
  'Não informado'
];

faixasOrdenadas.forEach(faixa => {
  const count = faixasEtarias[faixa] || 0;
  if (count > 0) {
    const percent = ((count / users.length) * 100).toFixed(2);
    console.log(`${faixa.padEnd(20)} ${count.toString().padStart(5)} (${percent}%)`);
  }
});

if (idades.length > 0) {
  const idadeMedia = (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1);
  const idadeMediana = idades.sort((a, b) => a - b)[Math.floor(idades.length / 2)];
  console.log(`\n📊 Idade média: ${idadeMedia} anos`);
  console.log(`📊 Idade mediana: ${idadeMediana} anos`);
}

console.log();

// ============================================
// 4. ANÁLISE GEOGRÁFICA - BAIRROS
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('4. DISTRIBUIÇÃO GEOGRÁFICA - TOP 20 BAIRROS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const bairrosCount = {};
const cidadesCount = {};

enderecos.forEach(e => {
  if (e.bairro) {
    bairrosCount[e.bairro] = (bairrosCount[e.bairro] || 0) + 1;
  }
  if (e.cidade) {
    cidadesCount[e.cidade] = (cidadesCount[e.cidade] || 0) + 1;
  }
});

// Top 20 bairros
Object.entries(bairrosCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([bairro, count], index) => {
    const percent = ((count / enderecos.length) * 100).toFixed(2);
    console.log(`${(index + 1).toString().padStart(2)}. ${bairro.padEnd(30)} ${count.toString().padStart(4)} endereços (${percent}%)`);
  });

console.log();

// ============================================
// 5. ANÁLISE GEOGRÁFICA - CIDADES
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('5. DISTRIBUIÇÃO POR CIDADE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

Object.entries(cidadesCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cidade, count]) => {
    const percent = ((count / enderecos.length) * 100).toFixed(2);
    console.log(`${cidade.padEnd(30)} ${count.toString().padStart(4)} endereços (${percent}%)`);
  });

console.log();

// ============================================
// 6. ANÁLISE DE DISTÂNCIA DE ENTREGA
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('6. ANÁLISE DE DISTÂNCIA DE ENTREGA');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const distancias = enderecos
  .map(e => e.km_value)
  .filter(d => d && d > 0)
  .map(d => d / 1000); // Converter metros para km

let faixasDistancia = {};

if (distancias.length > 0) {
  const distanciaMedia = (distancias.reduce((a, b) => a + b, 0) / distancias.length).toFixed(2);
  const distanciaMin = Math.min(...distancias).toFixed(2);
  const distanciaMax = Math.max(...distancias).toFixed(2);
  const distanciasOrdenadas = distancias.sort((a, b) => a - b);
  const distanciaMediana = distanciasOrdenadas[Math.floor(distanciasOrdenadas.length / 2)].toFixed(2);

  console.log(`📏 Distância média de entrega: ${distanciaMedia} km`);
  console.log(`📏 Distância mediana: ${distanciaMediana} km`);
  console.log(`📏 Distância mínima: ${distanciaMin} km`);
  console.log(`📏 Distância máxima: ${distanciaMax} km`);

  // Distribuição por faixas de distância
  console.log('\n📊 Distribuição por faixa de distância:\n');

  faixasDistancia = {
    '0-2 km': distancias.filter(d => d <= 2).length,
    '2-5 km': distancias.filter(d => d > 2 && d <= 5).length,
    '5-10 km': distancias.filter(d => d > 5 && d <= 10).length,
    '10-15 km': distancias.filter(d => d > 10 && d <= 15).length,
    '15-20 km': distancias.filter(d => d > 15 && d <= 20).length,
    '20+ km': distancias.filter(d => d > 20).length
  };

  Object.entries(faixasDistancia).forEach(([faixa, count]) => {
    const percent = ((count / distancias.length) * 100).toFixed(2);
    console.log(`${faixa.padEnd(15)} ${count.toString().padStart(4)} endereços (${percent}%)`);
  });
}

console.log();

// ============================================
// 7. ANÁLISE DE TEMPO DE ENTREGA
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('7. ANÁLISE DE TEMPO DE ENTREGA');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const tempos = enderecos
  .map(e => e.tempo_entrega_valor)
  .filter(t => t && t > 0)
  .map(t => Math.round(t / 60)); // Converter segundos para minutos

let faixasTempo = {};

if (tempos.length > 0) {
  const tempoMedio = (tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1);
  const tempoMin = Math.min(...tempos);
  const tempoMax = Math.max(...tempos);
  const temposOrdenados = tempos.sort((a, b) => a - b);
  const tempoMediano = temposOrdenados[Math.floor(temposOrdenados.length / 2)];

  console.log(`⏱️  Tempo médio de entrega: ${tempoMedio} minutos`);
  console.log(`⏱️  Tempo mediano: ${tempoMediano} minutos`);
  console.log(`⏱️  Tempo mínimo: ${tempoMin} minutos`);
  console.log(`⏱️  Tempo máximo: ${tempoMax} minutos`);

  // Distribuição por faixas de tempo
  console.log('\n📊 Distribuição por faixa de tempo:\n');

  faixasTempo = {
    '0-10 min': tempos.filter(t => t <= 10).length,
    '10-20 min': tempos.filter(t => t > 10 && t <= 20).length,
    '20-30 min': tempos.filter(t => t > 20 && t <= 30).length,
    '30+ min': tempos.filter(t => t > 30).length
  };

  Object.entries(faixasTempo).forEach(([faixa, count]) => {
    const percent = ((count / tempos.length) * 100).toFixed(2);
    console.log(`${faixa.padEnd(15)} ${count.toString().padStart(4)} endereços (${percent}%)`);
  });
}

console.log();

// ============================================
// 8. ENDEREÇOS POR USUÁRIO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('8. QUANTIDADE DE ENDEREÇOS POR USUÁRIO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const enderecosUsuario = {};
enderecos.forEach(e => {
  if (e.user) {
    enderecosUsuario[e.user] = (enderecosUsuario[e.user] || 0) + 1;
  }
});

const distribuicaoEnderecos = {};
Object.values(enderecosUsuario).forEach(count => {
  const key = count > 5 ? '6+' : count.toString();
  distribuicaoEnderecos[key] = (distribuicaoEnderecos[key] || 0) + 1;
});

['1', '2', '3', '4', '5', '6+'].forEach(key => {
  const count = distribuicaoEnderecos[key] || 0;
  if (count > 0) {
    const percent = ((count / Object.keys(enderecosUsuario).length) * 100).toFixed(2);
    console.log(`${key.padEnd(3)} endereço(s): ${count.toString().padStart(4)} usuários (${percent}%)`);
  }
});

console.log();

// ============================================
// 9. RESUMO EXECUTIVO
// ============================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('9. 📋 RESUMO EXECUTIVO - PERFIL DEMOGRÁFICO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`✅ Base total de ${users.length} usuários cadastrados`);
console.log(`✅ ${enderecos.length} endereços cadastrados no sistema`);
console.log(`✅ ${usersComEndereco.size} usuários com endereço (${((usersComEndereco.size/users.length)*100).toFixed(1)}%)`);
console.log(`✅ ${Object.keys(bairrosCount).length} bairros diferentes atendidos`);
console.log(`✅ ${Object.keys(cidadesCount).length} cidades diferentes atendidas`);

if (idades.length > 0) {
  const idadeMedia = (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1);
  console.log(`✅ Idade média dos clientes: ${idadeMedia} anos`);
}

if (distancias.length > 0) {
  const distanciaMedia = (distancias.reduce((a, b) => a + b, 0) / distancias.length).toFixed(2);
  console.log(`✅ Distância média de entrega: ${distanciaMedia} km`);
}

if (tempos.length > 0) {
  const tempoMedio = (tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1);
  console.log(`✅ Tempo médio de entrega: ${tempoMedio} minutos`);
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Análise concluída! ✨');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Exportar dados para JSON
const resultado = {
  data_analise: new Date().toISOString(),
  total_usuarios: users.length,
  total_enderecos: enderecos.length,
  usuarios_com_endereco: usersComEndereco.size,
  usuarios_sem_endereco: usersSemEndereco.length,
  distribuicao_genero: generoCount,
  distribuicao_faixa_etaria: faixasEtarias,
  top_20_bairros: Object.fromEntries(
    Object.entries(bairrosCount).sort((a, b) => b[1] - a[1]).slice(0, 20)
  ),
  distribuicao_cidades: cidadesCount,
  metricas_distancia: distancias.length > 0 ? {
    media_km: (distancias.reduce((a, b) => a + b, 0) / distancias.length).toFixed(2),
    mediana_km: distancias.sort((a, b) => a - b)[Math.floor(distancias.length / 2)].toFixed(2),
    minima_km: Math.min(...distancias).toFixed(2),
    maxima_km: Math.max(...distancias).toFixed(2),
    distribuicao_faixas: faixasDistancia
  } : null,
  metricas_tempo_entrega: tempos.length > 0 ? {
    media_minutos: (tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1),
    mediana_minutos: tempos.sort((a, b) => a - b)[Math.floor(tempos.length / 2)],
    minimo_minutos: Math.min(...tempos),
    maximo_minutos: Math.max(...tempos),
    distribuicao_faixas: faixasTempo
  } : null,
  distribuicao_enderecos_por_usuario: distribuicaoEnderecos
};

fs.writeFileSync('./analise-demografica-resultado.json', JSON.stringify(resultado, null, 2));
console.log('📄 Resultado exportado para: analise-demografica-resultado.json\n');
