# Guia de Configuração ManyChat — Spoiler Astrológico da Semana
## Fluxo completo com instruções passo a passo

**Versão:** 1.0
**Responsável setup:** Fernando / Gabriel
**Atualização semanal:** Fernando ou Gabriel (toda segunda-feira)
**Cliente:** Película Sideral

---

## Visão Geral

O ManyChat responde automaticamente quando pessoas interagem nos Stories e Reels sobre o Spoiler Astrológico da Semana. A mesma estrutura se repete toda semana — só muda o tema astrológico e as 12 mini-interpretações.

### Diagrama do Fluxo

```
Comentário / Resposta no Instagram
           │
           ▼
    ┌──────────────┐
    │  DETECTOR DE  │
    │ PALAVRA-CHAVE │
    └──────┬───────┘
           │
    ┌──────┴──────────────────┐
    │                         │
    ▼                         ▼
 Signo detectado        "não sei" detectado
 (áries, touro...)      (não sei, nao sei...)
    │                         │
    ▼                         ▼
┌─────────────┐        ┌──────────────┐
│ CAMINHO A   │        │ CAMINHO B    │
│ Interpretação│       │ Vídeo tutorial│
│ personalizada│       │ "Como descobrir│
│              │       │  ascendente"  │
│ → Oferta    │        │              │
│   Camarin   │        │ → Oferta     │
└─────────────┘        │   Curso      │
                       │              │
                       │ → Ou volta   │
                       │   Caminho A  │
                       └──────────────┘

  Comentário não reconhecido
           │
           ▼
    ┌──────────────┐
    │  FALLBACK    │
    │ "Qual seu    │
    │  ascendente?"│
    └──────────────┘
```

---

## PARTE 1 — Configuração Inicial (fazer uma vez)

### 1.1 Triggers (Gatilhos)

Criar **um único fluxo** com múltiplas palavras-chave de entrada.

**No ManyChat:**
1. Ir em **Automation** → **New Automation**
2. Nome: `Spoiler Semanal — Fluxo Principal`
3. Trigger: **Instagram Comment / Story Reply**

**Palavras-chave do trigger (todas em lowercase):**

| Grupo | Palavras-chave | Destino |
|-------|---------------|---------|
| Signos | áries, aries, touro, gêmeos, gemeos, câncer, cancer, leão, leao, virgem, libra, escorpião, escorpiao, sagitário, sagitario, capricórnio, capricornio, aquário, aquario, peixes | Caminho A |
| Não sabe | não sei, nao sei, n sei, não tenho certeza, nao tenho certeza | Caminho B |
| Interesse | quero, spoiler | Caminho A (genérico) |

> **IMPORTANTE:** Adicionar versões sem acento para cada palavra (ex: `áries` E `aries`).

### 1.2 Custom Fields (Campos Personalizados)

Criar os seguintes Custom Fields no ManyChat:

| Campo | Tipo | Uso |
|-------|------|-----|
| `ascendente` | Text | Armazena o signo do usuário |
| `tema_semana` | Text | Tema astrológico atual |
| `interp_aries` | Text | Interpretação Áries da semana |
| `interp_touro` | Text | Interpretação Touro da semana |
| `interp_gemeos` | Text | Interpretação Gêmeos da semana |
| `interp_cancer` | Text | Interpretação Câncer da semana |
| `interp_leao` | Text | Interpretação Leão da semana |
| `interp_virgem` | Text | Interpretação Virgem da semana |
| `interp_libra` | Text | Interpretação Libra da semana |
| `interp_escorpiao` | Text | Interpretação Escorpião da semana |
| `interp_sagitario` | Text | Interpretação Sagitário da semana |
| `interp_capricornio` | Text | Interpretação Capricórnio da semana |
| `interp_aquario` | Text | Interpretação Aquário da semana |
| `interp_peixes` | Text | Interpretação Peixes da semana |

### 1.3 Tags

Criar as seguintes tags:

| Tag | Quando aplicar |
|-----|----------------|
| `spoiler-caminho-a` | Quando entra no Caminho A |
| `spoiler-caminho-b` | Quando entra no Caminho B |
| `spoiler-clicou-camarin` | Quando clica no botão do Camarin |
| `spoiler-clicou-curso` | Quando clica no botão do Curso |
| `spoiler-remarketing` | Quando clica "agora não" |
| `spoiler-descobriu-signo` | Quando volta do Caminho B pro A |

---

## PARTE 2 — Caminho A: Sabe o Ascendente

### Fluxo passo a passo

**Step 1 — Condição: Identificar o signo**

Criar condição (Condition node) que verifica qual signo foi mencionado:
- Se contém "áries" ou "aries" → Set Custom Field `ascendente` = "Áries" → Ir para Step 2 (Áries)
- Se contém "touro" → Set Custom Field `ascendente` = "Touro" → Ir para Step 2 (Touro)
- *(repetir para todos os 12 signos)*

**Step 2 — Mensagem 1: Interpretação personalizada**

> Enviar IMEDIATAMENTE após o trigger

Para cada signo, uma mensagem com o template abaixo. Usar variáveis dinâmicas para que só precise atualizar os Custom Fields semanalmente.

**Template da mensagem (copiar para cada signo, trocando nome/emoji):**

```
Oi! Vi que seu ascendente é Áries ♈

Essa semana, com {{tema_semana}}, isso significa que {{interp_aries}}

✨ Cuida dessa energia e aproveita o momento.
```

| Signo | Emoji | Custom Field |
|-------|-------|-------------|
| Áries | ♈ | `{{interp_aries}}` |
| Touro | ♉ | `{{interp_touro}}` |
| Gêmeos | ♊ | `{{interp_gemeos}}` |
| Câncer | ♋ | `{{interp_cancer}}` |
| Leão | ♌ | `{{interp_leao}}` |
| Virgem | ♍ | `{{interp_virgem}}` |
| Libra | ♎ | `{{interp_libra}}` |
| Escorpião | ♏ | `{{interp_escorpiao}}` |
| Sagitário | ♐ | `{{interp_sagitario}}` |
| Capricórnio | ♑ | `{{interp_capricornio}}` |
| Aquário | ♒ | `{{interp_aquario}}` |
| Peixes | ♓ | `{{interp_peixes}}` |

**Ação:** Aplicar tag `spoiler-caminho-a`

**Step 3 — Delay: 30 segundos**

**Step 4 — Mensagem 2: Transição para oferta**

```
Toda semana eu aprofundo isso ao vivo no Camarin Sideral — é onde eu abro o céu inteiro e mostro como navegar cada energia.

Quer conhecer?
```

**Botões:**
- `Quero fazer parte ✨` → Ir para Step 5A
- `Agora não, obrigado` → Ir para Step 5B

**Step 5A — Clicou "Quero fazer parte"**

```
Que bom! 💜

Aqui tá o link pra conhecer o Camarin Sideral:
{link_camarin_utm}

Lá dentro tem aula ao vivo toda semana, aprofundamento no seu mapa pessoal, e uma comunidade incrível de pessoas que também tão nessa jornada.

Te espero lá!
```

**Ação:** Aplicar tag `spoiler-clicou-camarin`

**Step 5B — Clicou "Agora não"**

```
Sem problema! Quando sentir que é o momento, o convite tá de pé 😊

Enquanto isso, continua acompanhando o Jornal Sideral — toda semana tem conteúdo novo por aqui.
```

**Ação:** Aplicar tag `spoiler-remarketing`

---

## PARTE 3 — Caminho B: Não Sabe o Ascendente

### Fluxo passo a passo

**Step 1 — Mensagem 1: Acolhimento + vídeo**

> Enviar IMEDIATAMENTE após o trigger

```
Sem problema! Muita gente não sabe e tá tudo bem 😊

Fiz um vídeo rapidinho (1 minuto) te mostrando como descobrir. É super fácil!
```

**Ação:** Enviar vídeo tutorial (anexar arquivo de vídeo no ManyChat)
**Ação:** Aplicar tag `spoiler-caminho-b`

> **DEPENDÊNCIA:** O vídeo tutorial precisa ser gravado pelo Victor (60-90s mostrando como acessar o mapa gratuito e encontrar o ascendente).

**Step 2 — Delay: 2 minutos** (tempo de assistir o vídeo)

**Step 3 — Mensagem 2: Follow-up**

```
E aí, conseguiu descobrir? 🌟

Saber seu ascendente muda TUDO na astrologia — é a chave pra entender como os trânsitos da semana afetam a sua vida de verdade.
```

**Botões:**
- `Descobri! Meu ascendente é...` → Ir para Step 4A
- `Quero aprender mais sobre mapa astral` → Ir para Step 4B

**Step 4A — Descobriu o ascendente**

```
Boa! Me conta então: qual é o seu ascendente? 😊
```

**Ação:** Aplicar tag `spoiler-descobriu-signo`
**Ação:** Aguardar resposta → Redirecionar para **Caminho A** (detector de palavra-chave)

> No ManyChat: Configurar um "User Input" node que captura a próxima mensagem e redireciona para o início do Caminho A.

**Step 4B — Quer aprender mais**

```
O mapa astral é tipo um manual de quem você é — e aprender a ler muda tudo.

Eu fiz um curso chamado Decifrando o Mapa Astral, onde ensino do zero a interpretar cada parte do mapa.

Se faz sentido pra você, dá uma olhada:
{link_curso_utm}
```

**Ação:** Aplicar tag `spoiler-clicou-curso`

---

## PARTE 4 — Fallback

Para comentários que o ManyChat não reconhece (não contém nenhuma palavra-chave):

```
Oi! Não consegui identificar seu signo 😅

Pode me dizer qual seu ascendente? (ex: Áries, Touro, Gêmeos...)

Se não sabe, responde "não sei" que eu te ajudo a descobrir!
```

**Ação:** Aguardar resposta → Redirecionar para detector de palavra-chave (início do fluxo)

---

## PARTE 5 — Eventos de Pixel do Facebook

Configurar eventos customizados no ManyChat para rastreamento e remarketing:

| Evento | Quando dispara | Uso |
|--------|----------------|-----|
| `SpoilerCaminhoA` | Quando entra no Caminho A | Público: pessoas engajadas com astrologia |
| `SpoilerCaminhoB` | Quando entra no Caminho B | Público: iniciantes em astrologia |
| `SpoilerClicouCamarin` | Quando clica no botão LP Camarin | Público: quase-comprou Camarin |
| `SpoilerClicouCurso` | Quando clica no botão LP Curso | Público: quase-comprou Curso |

**Como configurar no ManyChat:**
1. Ir em **Settings** → **Integrations** → **Facebook Pixel**
2. Conectar o Pixel ID da Película Sideral
3. Em cada step indicado acima, adicionar **Action** → **Track Event** → Nome do evento

**Públicos de Remarketing no Meta Ads:**
- Criar público customizado baseado em cada evento
- Lookalike baseado em `SpoilerClicouCamarin` (mais qualificados)

---

## PARTE 6 — Atualização Semanal

### O que atualizar toda segunda-feira

Apenas **13 campos** precisam ser atualizados semanalmente:

| Campo | Exemplo |
|-------|---------|
| `tema_semana` | "Lua Nova em Peixes" |
| `interp_aries` | "essa energia ativa sua casa 12 — momento de olhar pra dentro, revisar padrões e confiar na sua intuição antes de agir" |
| `interp_touro` | "a Lua Nova ilumina sua casa 11 — novas conexões e projetos coletivos ganham força" |
| `interp_gemeos` | "sua casa 10 é ativada — semana decisiva para carreira e reputação" |
| `interp_cancer` | "a energia vai pra casa 9 — expansão, aprendizado, e uma vontade de ir mais longe" |
| `interp_leao` | "casa 8 ativada — transformação profunda, desapegos necessários, renovação" |
| `interp_virgem` | "a Lua Nova mexe na sua casa 7 — relacionamentos pedem atenção e novos acordos" |
| `interp_libra` | "casa 6 em foco — rotina, saúde e hábitos pedem reorganização" |
| `interp_escorpiao` | "energia na casa 5 — criatividade, romance e expressão pessoal em alta" |
| `interp_sagitario` | "casa 4 iluminada — lar, família e raízes emocionais pedem atenção" |
| `interp_capricornio` | "sua casa 3 é ativada — comunicação, estudos e conversas importantes" |
| `interp_aquario` | "casa 2 em foco — valores, dinheiro e autoestima em revisão" |
| `interp_peixes` | "a Lua Nova acontece no SEU signo — recomeço pessoal, novas intenções, momento de plantar" |

### Passo a passo para atualizar

1. Abrir ManyChat → **Settings** → **Custom Fields**
2. Atualizar o campo `tema_semana` com o tema da semana
3. Atualizar os 12 campos `interp_*` com as interpretações da semana
4. **Testar:** Enviar um comentário teste com um signo e verificar se a mensagem está com o conteúdo atualizado
5. Marcar como feito no checklist semanal

> **DICA:** As 12 interpretações são fornecidas no briefing semanal (templates/briefing-semanal-pelicula.md, seção 5).

### Regras das mini-interpretações

| Regra | Descrição |
|-------|-----------|
| **Tamanho** | 2-3 frases (máximo 280 caracteres) |
| **Tom** | Pessoal, direto, empoderador |
| **Conteúdo** | Qual casa é ativada + o que significa na prática |
| **Proibido** | Previsões negativas, fatalismo, medo |
| **Exemplo bom** | "essa energia ativa sua casa 7 — momento ideal pra conversas honestas nos relacionamentos" |
| **Exemplo ruim** | "cuidado com brigas nos relacionamentos essa semana" |

---

## PARTE 7 — Links com UTM

### Camarin Sideral
```
{url_camarin}?utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-a
```

### Curso Decifrando Mapa Astral
```
{url_curso}?utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-b
```

> Substituir `{url_camarin}` e `{url_curso}` pelos links reais antes de configurar.

---

## PARTE 8 — Checklist de Testes

Antes de ativar o fluxo, testar cada cenário:

### Testes obrigatórios

- [ ] **Teste Caminho A (Áries):** Comentar "áries" em um Reel → verificar DM com interpretação correta
- [ ] **Teste Caminho A (Peixes):** Comentar "peixes" → verificar DM
- [ ] **Teste Caminho A (sem acento):** Comentar "gemeos" → verificar DM
- [ ] **Teste Caminho A (botão Camarin):** Clicar "Quero fazer parte" → verificar link correto e tag
- [ ] **Teste Caminho A (botão agora não):** Clicar "Agora não" → verificar tag remarketing
- [ ] **Teste Caminho B:** Comentar "não sei" → verificar DM + vídeo
- [ ] **Teste Caminho B (sem acento):** Comentar "nao sei" → verificar DM
- [ ] **Teste Caminho B (botão curso):** Clicar "Quero aprender mais" → verificar link
- [ ] **Teste Caminho B (botão descobriu):** Clicar "Descobri!" → verificar redirecionamento para Caminho A
- [ ] **Teste Fallback:** Comentar algo aleatório → verificar mensagem de fallback
- [ ] **Teste Stories:** Responder caixinha com "leão" → verificar DM
- [ ] **Teste UTM:** Verificar que todos os links têm UTM correto
- [ ] **Teste Pixel:** Verificar no Events Manager que os eventos estão disparando

---

## PARTE 9 — Dependências e Próximos Passos

| Item | Status | Responsável | Impacto |
|------|--------|-------------|---------|
| Vídeo tutorial "Como descobrir ascendente" | Precisa gravar | Victor | Bloqueia Caminho B |
| Link LP Camarin com UTM | Confirmar | Fernando | Links no Caminho A |
| Link LP Curso com UTM | Confirmar | Fernando | Links no Caminho B |
| Pixel ID da Película | Confirmar | Fernando/Diego | Eventos de rastreamento |
| Primeira semana de interpretações | Escrever | Fernando | Conteúdo dos Custom Fields |

> **Workaround Caminho B (se vídeo não estiver pronto):** Substituir o vídeo por uma mensagem de texto com o passo a passo escrito:
> "1. Acesse astro.com → 2. Clique em 'Carta Natal Gratuita' → 3. Coloque sua data, hora e local de nascimento → 4. Seu ascendente aparece ao lado do signo solar"

---

*Documento referência para configuração e manutenção do ManyChat. Atualizar conforme iterações.*
