# Copy Otimizada — Funil ManyChat | Eclipse Lunar em Virgem 03/03/2026

**Versão:** 1.0
**Data:** 03/03/2026
**Task ClickUp:** [86afwe6t5](https://app.clickup.com/t/86afwe6t5)
**Cliente:** Película Sideral
**Autor:** Orion (AIOS) + skill copywriting

---

## Resumo Estratégico

### O que mudou vs. versão anterior

| Aspecto | Antes | Agora |
|---------|-------|-------|
| **Interp_*** | Genéricas ("Com Marte ativando...") | Extraídas da aula real — casa específica + dor concreta |
| **CTAs** | Referenciavam "minipodcast"/"recado em áudio" | Referem o conteúdo real: interpretação escrita + ritual + mecânica |
| **Fluxo A** | Vendia Camarim direto no DM | Vende a AULA (Substack) — o paywall vende o Camarim |
| **Tom** | Amigável mas vago | Específico, pessoal, com open loop |
| **Botões** | "Abrir Aula 🌙" (genérico) | "Quero ver 🌙" (desejo + curiosidade) |
| **Follow-up** | Não existia | Soft sell Camarim 30s após link |
| **Remarketing** | "Se mudar de ideia" | Planta semente semanal |

### Lógica do funil

```
DM (hook personalizado)
    ↓
Aula no Substack (preview gratuita — interpretação geral + qual casa pra cada signo)
    ↓
Paywall (interpretação detalhada + mecânica + ritual + curadoria)
    ↓
Assinatura Camarim (R$19/mês ou R$297/ano)
```

**Princípio:** O DM não vende o Camarim. O DM vende a curiosidade pela AULA. A aula vende o Camarim via paywall natural.

---

## Fluxo Completo

```
GATILHO (comentário com ascendente)
    ↓
AÇÕES: set ascendente, add tags (spoiler-interagiu, sabe-ascendente)
    ↓
MSG 1: Saudação + Mini-interpretação (interp_*)
    ↓
DELAY 15s
    ↓
MSG 2: CTA personalizado (cta_*) + botões
    ├── [🌙 Quero ver] → TAG: foi-pra-aula → MSG 3: Link → DELAY 30s → MSG 4: Soft sell
    └── [😊 Agora não] → DELAY 15s → MSG 5: Remarketing → TAG: remarketing
```

---

## PARTE 1 — Textos Fixos

### MSG 1 — Saudação (header, antes do interp_*)

```
{{first_name}} com ascendente em [signo] [emoji]
```

> **Nota:** Sem "Oi!" ou "Olá!". Direto, como se já estivesse no meio de uma conversa. Isso gera intimidade.

### MSG 1 — Tema da Semana (footer, depois do interp_*)

```
O tema dessa semana: {{tema_semana_global}}
```

**Bot Field `tema_semana_global` para essa semana:**
```
Eclipse Lunar Total em Virgem — o último até 2029
```

### MSG 2 — Botões CTA

| Botão | Texto | Tipo | Ação |
|-------|-------|------|------|
| Principal | `Quero ver 🌙` | Send Message → MSG 3 | Add Tag: `foi-pra-aula` |
| Secundário | `Agora não 😊` | Send Message → MSG 5 | Add Tag: `remarketing` |

> **Por que "Quero ver" e não "Abrir Aula":** "Quero ver" é desejo ativo. "Abrir Aula" é ação mecânica. A pessoa não quer "abrir uma aula" — ela quer VER o que o eclipse faz na vida dela.

### MSG 3 — Link da Aula (Path A)

```
Tá aqui 👇

https://peliculasideral.substack.com/p/eclipse-lunar-total-em-virgem-03032026

Começa pelo topo. Quando chegar na parte do seu ascendente, é onde a coisa fica pessoal.
```

### MSG 4 — Soft Sell Camarim (30s depois do link)

```
Ah, e isso é só a aula dessa semana.

Toda semana tem conteúdo assim no Camarim Sideral — interpretação por ascendente, ritual prático, curadoria cultural. Tudo personalizado.

Se quiser fazer parte: https://optimizeformobile.vercel.app/?utm_source=manychat&utm_medium=dm&utm_campaign=eclipse-virgem&utm_content=soft-sell

Qualquer dúvida, manda aqui 😊
```

### MSG 5 — Remarketing Close (Path B)

```
Sem problema! Se mudar de ideia, é só me chamar 😊

Toda semana tem conteúdo novo por aqui — personalizado pro seu ascendente.
```

### Caminho B — Não Sabe o Ascendente

**MSG B1 — Acolhimento:**
```
Sem problema! Muita gente não sabe 😊

Criei uma ferramenta rapidinha — coloca data, hora e local de nascimento e descobre na hora.
```

**MSG B2 — Link da ferramenta:**
```
👉 Descubra aqui: https://pelicula-lps-lovat.vercel.app/mapa-astral
```

**MSG B3 — Follow-up (2min delay):**
```
Conseguiu descobrir? Me conta qual é o seu ascendente que eu te mando a interpretação personalizada dessa semana 🌙
```

### Fallback (não reconheceu signo)

```
Oi! Não consegui identificar seu ascendente 😅

Me diz qual é? (ex: Áries, Touro, Gêmeos...)

Se não sabe, responde "não sei" que eu te ajudo a descobrir 😊
```

---

## PARTE 2 — Mini-Interpretações por Signo (interp_*)

> **Regras:** Max 280 caracteres. Tom pessoal e direto. Diz QUAL casa o eclipse ativa + UMA dor/insight concreto + open loop. Sem fatalismo, sem jargão técnico pesado.

### ♈ interp_aries

```
Esse eclipse cai na sua Casa 6 — rotina, saúde, hábitos. Algo que você mantém no automático vai ficar impossível de ignorar. Seu corpo já sabe o que precisa mudar. A pergunta é se você vai ouvir dessa vez.
```

### ♉ interp_touro

```
Esse eclipse cai na sua Casa 5 — prazer, criatividade, expressão. Quando foi a última vez que você fez algo só por prazer? Sem meta, sem post, sem cobrar resultado? Essa resposta importa mais do que parece.
```

### ♊ interp_gemeos

```
Esse eclipse cai na sua Casa 4 — lar, família, raiz emocional. Algo na sua base tá pedindo atenção faz tempo. Pode ser literal (a casa, a família) ou interno. Mas no fundo você sabe do que eu tô falando.
```

### ♋ interp_cancer

```
Esse eclipse cai na sua Casa 3 — pensamentos, conversas, narrativa interna. Aquela conversa que você evita ter. Aquele insight que aparece mas você empurra. Essa semana não vai dar pra empurrar mais.
```

### ♌ interp_leao

```
Esse eclipse cai na sua Casa 2 — valor, dinheiro, autoestima. Onde você tá gastando energia demais pra retorno de menos? O eclipse ilumina o desequilíbrio. E também o talento que você subestima.
```

### ♍ interp_virgem

```
Esse eclipse cai direto na sua Casa 1. Identidade. Corpo. Quem você é. Nenhum ascendente é mais impactado essa semana do que o seu. Se tá sentindo que algo não encaixa — não é bug. É atualização.
```

### ♎ interp_libra

```
Esse eclipse cai na sua Casa 12 — o lugar mais silencioso do mapa. Tem algo que você carrega e talvez nem consiga nomear. Mas consome energia todo dia. Essa semana, começa a sair.
```

### ♏ interp_escorpiao

```
Esse eclipse cai na sua Casa 11 — amigos, grupos, planos pro futuro. O rumo que você imaginava pros próximos anos tá sendo recalculado. Algumas pessoas ficam. Outras saem. E tudo bem.
```

### ♐ interp_sagitario

```
Esse eclipse cai na sua Casa 10 — carreira, reputação, missão. O que você construiu até aqui tá sendo escaneado. A pergunta que o eclipse faz: você se reconhece no que construiu?
```

### ♑ interp_capricornio

```
Esse eclipse cai na sua Casa 9 — crenças, filosofia, visão de mundo. Aquela certeza que você carregava como verdade? Tá tremendo. Não é o chão cedendo. É atualização.
```

### ♒ interp_aquario

```
Esse eclipse cai na sua Casa 8 — transformação, medos, verdades que você evita. Algo escondido vem à tona essa semana. Parece desconforto. Mas atrás dele tem tesouro.
```

### ♓ interp_peixes

```
Esse eclipse cai na sua Casa 7 — parcerias, relacionamentos, contratos emocionais. Aquele acordo tácito que nunca foi falado? Precisa de atualização. E no meio disso: o que EU quero?
```

---

## PARTE 3 — CTAs Personalizados por Signo (cta_*)

> **Regras:** Referencia conteúdo REAL da aula paga (interpretação detalhada + ritual + mecânica). Cria desejo específico pelo que a pessoa vai encontrar. Usa urgência real (último eclipse até 2029). Tom de convite, não de venda.

### ♈ cta_aries

```
Na aula dessa semana eu interpreto exatamente o que o eclipse ativa na sua rotina — o que tá pedindo pra sair, o que o corpo já denuncia, e como fechar esse ciclo com um ritual que usa gesto real, não argumento bonito.

É o último eclipse nesse eixo até 2029.
```

### ♉ cta_touro

```
Na aula eu mostro o que o eclipse revela sobre o prazer que você parou de se permitir — e a tensão entre criar o que é seu e atender o que esperam de você.

Tem um ritual de corpo inteiro pra reconectar com o que é genuinamente seu. Sem meta. Sem performance.
```

### ♊ cta_gemeos

```
Na aula eu mostro o que o eclipse escava na sua base emocional — e o conflito entre vida privada e vida pública que aparece forte agora.

Tem um ritual prático pra ajudar o corpo a acompanhar o que a mente já percebeu. O corpo precisa participar dessa mudança.
```

### ♋ cta_cancer

```
Na aula eu interpreto como o eclipse tensiona sua mente com sua visão de mundo — e por que Mercúrio retrógrado nesse contexto muda tudo.

Tem um ritual pra reprogramar a narrativa interna com gesto, não com teoria. E uma curadoria cultural que traduz a energia da semana.
```

### ♌ cta_leao

```
Na aula eu mostro a tensão entre o que é seu e o que é do outro — autonomia, valor real, o que você aceita receber.

Tem um ritual pra recalibrar energia. Não é sobre dinheiro. É sobre quanto você acha que vale de verdade.
```

### ♍ cta_virgem

```
Na aula eu interpreto o impacto mais pessoal desse eclipse: identidade, corpo, relações que precisam se reorganizar. Virgem é o ascendente mais afetado dessa semana. Não tem como ignorar.

Tem um ritual pra autorizar a nova versão de você. Começa por essa aula.
```

### ♎ cta_libra

```
Na aula eu explico por que o alívio vem agora — e o que fazer pra não segurar de novo.

Tem a mecânica do eclipse, o mito por trás, e um ritual que usa o corpo pra mover o que tá parado. Casa 12 não fala alto. Mas fala muito.
```

### ♏ cta_escorpiao

```
Na aula eu mostro como o eclipse reorganiza seu futuro e a tensão entre expressão individual e expectativa coletiva.

Tem um ritual prático de encerramento de ciclo. Sem drama. Sem teatralidade. Só gesto real. E uma curadoria cultural que espelha essa energia.
```

### ♐ cta_sagitario

```
Na aula eu interpreto o que o eclipse revela no topo do seu mapa — carreira, missão, propósito público. E a tensão entre sucesso e pertencimento que aparece forte agora.

Saturno tá pedindo planejamento, não salto no escuro. Na aula eu mostro como fazer isso.
```

### ♑ cta_capricornio

```
Na aula eu mostro o que tá sendo trocado nas suas crenças — e o que vem no lugar. Tem a mecânica do eclipse explicada em detalhe, o mito por trás, e um ritual pra expandir mente reorganizando destino.

Se surgir vontade de mover — vai. A Casa 9 se ativa no movimento.
```

### ♒ cta_aquario

```
Na aula eu interpreto o que o eclipse transforma no lugar mais profundo do seu mapa. Tem um ritual pra processar o que sai e enxergar o que sobra.

O que sobra é genuinamente seu. Às vezes é preciso perder pra descobrir o que não pode ser tirado.
```

### ♓ cta_peixes

```
Na aula eu mostro a tensão entre agradar o outro e afirmar quem você é — e como Saturno tá refundando seu valor próprio nos próximos anos.

Tem um ritual de selagem. Prático. Concreto. Sem teatro. Eclipse pede gesto real.
```

---

## PARTE 4 — Configuração no ManyChat (Bot Fields)

### Bot Fields para atualizar

| Bot Field | Valor |
|-----------|-------|
| `tema_semana_global` | Eclipse Lunar Total em Virgem — o último até 2029 |
| `interp_aries` | *(copiar da Parte 2 acima)* |
| `interp_touro` | *(copiar da Parte 2 acima)* |
| `interp_gemeos` | *(copiar da Parte 2 acima)* |
| `interp_cancer` | *(copiar da Parte 2 acima)* |
| `interp_leao` | *(copiar da Parte 2 acima)* |
| `interp_virgem` | *(copiar da Parte 2 acima)* |
| `interp_libra` | *(copiar da Parte 2 acima)* |
| `interp_escorpiao` | *(copiar da Parte 2 acima)* |
| `interp_sagitario` | *(copiar da Parte 2 acima)* |
| `interp_capricornio` | *(copiar da Parte 2 acima)* |
| `interp_aquario` | *(copiar da Parte 2 acima)* |
| `interp_peixes` | *(copiar da Parte 2 acima)* |

### Bot Fields NOVOS a criar (CTAs por signo)

| Bot Field | Valor |
|-----------|-------|
| `cta_aries` | *(copiar da Parte 3 acima)* |
| `cta_touro` | *(copiar da Parte 3 acima)* |
| `cta_gemeos` | *(copiar da Parte 3 acima)* |
| `cta_cancer` | *(copiar da Parte 3 acima)* |
| `cta_leao` | *(copiar da Parte 3 acima)* |
| `cta_virgem` | *(copiar da Parte 3 acima)* |
| `cta_libra` | *(copiar da Parte 3 acima)* |
| `cta_escorpiao` | *(copiar da Parte 3 acima)* |
| `cta_sagitario` | *(copiar da Parte 3 acima)* |
| `cta_capricornio` | *(copiar da Parte 3 acima)* |
| `cta_aquario` | *(copiar da Parte 3 acima)* |
| `cta_peixes` | *(copiar da Parte 3 acima)* |

### Links com UTM

**Aula (Substack):**
```
https://peliculasideral.substack.com/p/eclipse-lunar-total-em-virgem-03032026?utm_source=manychat&utm_medium=dm&utm_campaign=eclipse-virgem&utm_content=aula
```

**Camarim (soft sell):**
```
https://optimizeformobile.vercel.app/?utm_source=manychat&utm_medium=dm&utm_campaign=eclipse-virgem&utm_content=soft-sell
```

**Mapa Astral (Caminho B):**
```
https://pelicula-lps-lovat.vercel.app/mapa-astral?utm_source=manychat&utm_medium=dm&utm_campaign=eclipse-virgem&utm_content=descobrir-asc
```

---

## PARTE 5 — Anotações de Copy

### Princípios aplicados

| Princípio | Como foi usado |
|-----------|---------------|
| **Especificidade > Vagueza** | Cada interp diz a casa exata + dor concreta: "Casa 6 — rotina, saúde, hábitos" |
| **Open Loop** | Interps criam curiosidade sem entregar a resposta: "A pergunta é se você vai ouvir dessa vez" |
| **Benefício tangível no CTA** | CTAs descrevem o que a pessoa VAI ENCONTRAR: "interpreto exatamente o que o eclipse ativa na sua rotina" |
| **Urgência real** | "Último eclipse nesse eixo até 2029" — fato, não manipulação |
| **Linguagem de DM** | Zero jargão: "não é bug, é atualização". Tom de conversa com amigo que entende de astro |
| **Uma ideia por frase** | Frases curtas. Uma função cada. Sem conjunções encadeadas |
| **Desejo > Medo** | CTAs focam no que a pessoa GANHA (clareza, ritual, entendimento), não no que perde |
| **Funil em duas etapas** | DM vende a AULA (curiosidade). Aula vende o CAMARIM (paywall). Não vende tudo de uma vez |
| **Congruência de tom** | Copy do DM espelha o tom do Victor na aula: direto, poético sem ser místico, prático |

### O que a aula entrega (valor extraído)

| Seção | O que é | Por que cria desejo |
|-------|---------|-------------------|
| Mecânica do Eclipse | Explicação técnica com mapa astral | Entender o "por quê" do que estão sentindo |
| Mito | Narrativa civilizacional sobre eclipses | Contexto universal que dá profundidade |
| 12 Interpretações | Casa por casa, ascendente por ascendente | PESSOAL — "o que isso significa PRA MIM" |
| Ritual Criativo | Faxina + banho + roupa + gesto simbólico | AÇÃO CONCRETA — sai da teoria pro corpo |
| Curadoria Cultural | Filmes, livros, música, poesia, arte | EXPERIÊNCIA — traduz o céu em linguagem artística |

### Diferença entre interp_* e cta_*

| | interp_* | cta_* |
|-|----------|-------|
| **Função** | Hook — criar identificação | Bridge — criar desejo de ver mais |
| **Tom** | "Eu sei o que você tá sentindo" | "Eu tenho a resposta no conteúdo" |
| **Tamanho** | 2-3 frases (max 280 chars) | 3-4 frases (mais detalhado) |
| **Referência** | A vida da pessoa | O conteúdo da aula |
| **Verbo** | Descreve estado atual | Promete transformação |

### Variação por signo — tom da interp

| Signo | Tom dominante | Palavra-chave |
|-------|---------------|---------------|
| Áries | Desafio direto | "ouvir" |
| Touro | Pergunta reflexiva | "prazer" |
| Gêmeos | Reconhecimento | "sabe do que eu tô falando" |
| Câncer | Inevitabilidade | "não vai dar pra empurrar" |
| Leão | Desequilíbrio | "energia demais / retorno de menos" |
| Virgem | Validação | "não é bug, é atualização" |
| Libra | Peso invisível | "consome energia todo dia" |
| Escorpião | Transição | "algumas ficam, outras saem" |
| Sagitário | Questionamento | "se reconhece no que construiu?" |
| Capricórnio | Tremor de certezas | "atualização" |
| Aquário | Tesouro escondido | "atrás dele tem tesouro" |
| Peixes | Pergunta existencial | "o que EU quero?" |

---

## Checklist de Implementação

- [ ] Criar 12 Bot Fields novos: `cta_aries` a `cta_peixes`
- [ ] Atualizar 12 Bot Fields existentes: `interp_aries` a `interp_peixes`
- [ ] Atualizar Bot Field: `tema_semana_global`
- [ ] Atualizar textos fixos das mensagens no fluxo
- [ ] Atualizar labels dos botões para "Quero ver 🌙" / "Agora não 😊"
- [ ] Adicionar MSG 3 (link da aula) após botão principal
- [ ] Adicionar MSG 4 (soft sell Camarim) com delay 30s após MSG 3
- [ ] Verificar URLs com UTMs em todos os links
- [ ] Testar fluxo completo com 3+ signos no Preview
- [ ] Teste real com equipe

---

*Documento v1.0 — Copy otimizada Funil ManyChat Eclipse Lunar Virgem 03/03/2026*
*Reescrito com base na aula real, copy do Camarim, e princípios de copywriting*
*Cliente: Película Sideral | AIOS Orion*
