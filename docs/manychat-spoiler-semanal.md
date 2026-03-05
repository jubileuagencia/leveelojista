# Guia de Configuracao ManyChat — Spoiler Astrologico Semanal

**Versao:** 2.0
**Responsavel setup:** Fernando / Gabriel
**Atualizacao semanal:** Fernando ou Gabriel (toda segunda-feira)
**Cliente:** Pelicula Sideral

---

## Visao Geral do Fluxo

```
Comentario / Resposta no Instagram
           |
           v
    +----------------+
    | DETECTOR DE    |
    | PALAVRA-CHAVE  |
    +-------+--------+
            |
    +-------+-----------------------+-------------------+
    |                               |                   |
    v                               v                   v
 Signo detectado           "nao sei" detectado     Nao reconhecido
 (aries, touro...)         (nao sei, n sei...)
    |                               |                   |
    v                               v                   v
+-----------+              +---------------+     +------------+
| CAMINHO A |              | CAMINHO B     |     | FALLBACK   |
| Interp.   |              | Video tutorial|     | Reperguntar|
| + Oferta  |              | + Oferta      |     | signo      |
| Camarim   |              | Curso         |     +------------+
+-----------+              | ou volta ao A |
                           +---------------+
```

---

## PARTE 1 — Configuracao Inicial (fazer uma vez)

### 1.1 Custom Fields (Campos Personalizados)

> Menu lateral > **Settings** > **Custom Fields** > **+ New User Field**

| #  | Nome do Campo        | Tipo | Para que serve                  |
|----|----------------------|------|---------------------------------|
| 1  | `ascendente`         | Text | Guardar o signo da pessoa       |
| 2  | `tema_semana`        | Text | Tema astrologico da semana      |
| 3  | `interp_aries`       | Text | Mini-interpretacao de Aries     |
| 4  | `interp_touro`       | Text | Mini-interpretacao de Touro     |
| 5  | `interp_gemeos`      | Text | Mini-interpretacao de Gemeos    |
| 6  | `interp_cancer`      | Text | Mini-interpretacao de Cancer    |
| 7  | `interp_leao`        | Text | Mini-interpretacao de Leao      |
| 8  | `interp_virgem`      | Text | Mini-interpretacao de Virgem    |
| 9  | `interp_libra`       | Text | Mini-interpretacao de Libra     |
| 10 | `interp_escorpiao`   | Text | Mini-interpretacao de Escorpiao |
| 11 | `interp_sagitario`   | Text | Mini-interpretacao de Sagitario |
| 12 | `interp_capricornio` | Text | Mini-interpretacao de Capricornio |
| 13 | `interp_aquario`     | Text | Mini-interpretacao de Aquario   |
| 14 | `interp_peixes`      | Text | Mini-interpretacao de Peixes    |

Para cada: **+ New User Field** > digita o nome > seleciona "Text" > **Create**

- [ ] Todos os 14 Custom Fields criados

---

### 1.2 Bot Fields (Campos Globais)

> **Settings** > **Bot Fields** > **+ New Bot Field**

Bot Fields valem para TODOS os usuarios (diferente dos Custom Fields que sao por pessoa).

| Nome                 | Tipo | Valor Inicial                           |
|----------------------|------|-----------------------------------------|
| `tema_semana_global` | Text | "Lua Nova em Peixes" (ou o tema atual)  |

**NOTA IMPORTANTE:** As 12 interpretacoes (`interp_*`) devem ser Bot Fields tambem, nao Custom Fields — assim voce atualiza UMA VEZ e vale pra todo mundo. Revise o passo 1.1 e crie como Bot Fields em vez de Custom Fields.

- [ ] Bot Field `tema_semana_global` criado

---

### 1.3 Tags

> Menu lateral > **Audience** > **Tags** > **+ New Tag**

| Tag                   | Para que serve                           |
|-----------------------|------------------------------------------|
| `spoiler-interagiu`   | Marcou quem interagiu no spoiler         |
| `sabe-ascendente`     | Sabe o ascendente                        |
| `nao-sabe-ascendente` | Nao sabe o ascendente                    |
| `remarketing`         | Disse "agora nao" — remarketing futuro   |
| `interesse-camarim`   | Clicou no link do Camarim                |
| `interesse-curso`     | Clicou no link do Curso                  |

- [ ] Todas as 6 Tags criadas

---

## PARTE 2 — Criar o Trigger (Gatilho de Automacao)

### 2.1 Criar Nova Automacao

1. Menu lateral > **Automation**
2. Botao azul **+ New Automation**
3. Selecionar **Start from Scratch**
4. Nome: `Spoiler Astrologico Semanal`

### 2.2 Configurar o Trigger

1. Clicar em **Choose a Trigger**
2. Selecionar **Instagram**
3. Escolher **Instagram Comments**
4. Configurar:
   - **Comment Automation for:** `Specific Post` (recomendado) — colar link do Reels/Post
   - Ou `All Posts` se quiser pra todos
5. **Trigger Keywords** (uma por linha):

```
aries
áries
touro
gemeos
gêmeos
cancer
câncer
leao
leão
virgem
libra
escorpiao
escorpião
sagitario
sagitário
capricornio
capricórnio
aquario
aquário
peixes
não sei
nao sei
quero
spoiler
```

6. **Keyword matching rule:** `Message contains keyword`
7. Marcar **Also trigger for Story Replies** (se disponivel)
8. Clicar **Done / Save**

- [ ] Trigger configurado com todas as keywords

---

## PARTE 3 — CAMINHO A: Sabe o Ascendente (12 signos)

### 3.1 Adicionar Condicao (Condition)

Logo apos o trigger:

1. Clicar no **+** abaixo do trigger
2. Selecionar **Condition**
3. Configurar: `If > Comment Text > contains > aries`
4. Isso cria dois caminhos: **Yes** e **No**

### 3.2 Caminho Yes (Aries) — Acoes + Mensagem 1

**ANTES da mensagem, adicionar Actions:**

1. **+** > **Action** > **Set Custom Field** > `ascendente` = `aries`
2. **Action** > **Add Tag** > `spoiler-interagiu`
3. **Action** > **Add Tag** > `sabe-ascendente`

**Mensagem 1 — Mini-interpretacao personalizada:**

4. **+** > **Send Message** > **Instagram DM** > **Text**

```
Oi, {{first name}}! Vi que seu ascendente e Aries ♈

{{interp_aries}}

Essa semana o tema e: {{tema_semana_global}}
```

### 3.3 Delay de 30 segundos

1. **+** > **Smart Delay** > **30 segundos**

### 3.4 Mensagem 2 — Transicao para Oferta

1. **+** > **Send Message** > **Instagram DM** > **Text + Buttons**

```
Toda semana eu aprofundo isso ao vivo no Camarim Sideral. Quer conhecer? ✨
```

**Botao 1:**
- Texto: `Quero fazer parte ✨`
- Tipo: **Open Website**
- URL: `https://optimizeformobile.vercel.app/`
- Action no botao: **Add Tag** > `interesse-camarim`

**Botao 2:**
- Texto: `Agora nao, obrigado`
- Tipo: **Send Message** (vai para encerramento)
- Action no botao: **Add Tag** > `remarketing`

### 3.5 Mensagem de Encerramento ("Agora nao")

No caminho do botao "Agora nao":

```
Sem problema! Se mudar de ideia, e so me chamar 😊
Toda semana tem conteudo novo por aqui.
```

### 3.6 REPLICAR PARA OS OUTROS 11 SIGNOS

No caminho **No** da primeira condicao, encadear novas condicoes:

| # | Condicao (contains)         | Emoji | Campo              | Valor ascendente |
|---|----------------------------|-------|--------------------|------------------|
| 1 | aries / áries              | ♈    | `interp_aries`     | aries            |
| 2 | touro                      | ♉    | `interp_touro`     | touro            |
| 3 | gemeos / gêmeos            | ♊    | `interp_gemeos`    | gemeos           |
| 4 | cancer / câncer            | ♋    | `interp_cancer`    | cancer           |
| 5 | leao / leão                | ♌    | `interp_leao`      | leao             |
| 6 | virgem                     | ♍    | `interp_virgem`    | virgem           |
| 7 | libra                      | ♎    | `interp_libra`     | libra            |
| 8 | escorpiao / escorpião      | ♏    | `interp_escorpiao` | escorpiao        |
| 9 | sagitario / sagitário      | ♐    | `interp_sagitario` | sagitario        |
| 10| capricornio / capricórnio  | ♑    | `interp_capricornio`| capricornio     |
| 11| aquario / aquário          | ♒    | `interp_aquario`   | aquario          |
| 12| peixes                     | ♓    | `interp_peixes`    | peixes           |

**DICA:** Botao direito no bloco > **Duplicate** para copiar a estrutura e so trocar textos.

Cada signo segue a MESMA estrutura:
1. Actions (set ascendente + tags)
2. Mensagem 1 (interpretacao)
3. Delay 30s
4. Mensagem 2 (botoes oferta)
5. Encerramento (se "agora nao")

- [ ] Caminho A completo para todos os 12 signos

---

## PARTE 4 — CAMINHO B: Nao Sabe o Ascendente

### 4.1 Condicao para "nao sei"

Apos todas as 12 condicoes de signo, no ultimo caminho **No**:

1. **Condition:** `If > Comment Text > contains > não sei` OR `nao sei`

### 4.2 Mensagem 1 — Acolhimento + Video

No caminho **Yes**:

1. **Action:** Add Tag > `nao-sabe-ascendente`
2. **Action:** Add Tag > `spoiler-interagiu`
3. **Send Message** > Instagram DM:

```
Sem problema! Muita gente nao sabe 😊
Fiz um video rapido te mostrando como descobrir — e bem facil!
```

4. **+** > **Send Message** > Instagram DM > **Attachment / Video**
5. Upload do video tutorial OU enviar como link:

```
👉 Assista aqui: [link do video tutorial]
```

> Video pode ser MP4 ate 25MB direto no ManyChat, ou enviar como link.

### 4.3 Delay de 2 minutos

**Smart Delay:** 2 minutos (tempo de assistir o video)

### 4.4 Mensagem 2 — Follow-up com Botoes

**Send Message** > Instagram DM > **Text + Buttons:**

```
Conseguiu descobrir? Saber seu ascendente muda tudo na astrologia! 🌟
```

**Botao 1:**
- Texto: `Descobri! Meu ascendente e...`
- Tipo: **Send Message**
- Vai para: perguntar o signo (4.5)

**Botao 2:**
- Texto: `Quero aprender mais`
- Tipo: **Open Website**
- URL: `[Link LP Curso Decifrando]`
- Action: **Add Tag** > `interesse-curso`

### 4.5 Reconectar com Caminho A ("Descobri!")

1. **Send Message:**

```
Que legal! Me conta: qual e o seu ascendente?
(ex: Aries, Touro, Gemeos...)
```

2. **User Input:**
   - Tipo: **Multiple Choice** (listar os 12 signos) OU **Free Text**
   - Salvar resposta em: Custom Field `ascendente`
3. Apos capturar, usar **Condition** para verificar o valor e redirecionar para o Caminho A correspondente

**DICA:** Usar **"Go to Step"** para redirecionar para blocos ja existentes sem duplicar.

- [ ] Caminho B completo

---

## PARTE 5 — FALLBACK

### 5.1 Mensagem de Fallback

No ultimo caminho **No** (nao e signo nem "nao sei"):

1. **Action:** Add Tag > `spoiler-interagiu`
2. **Send Message** > Instagram DM:

```
Oi! Nao consegui identificar seu signo 😅
Pode me dizer qual seu ascendente?

(ex: Aries, Touro, Gemeos...)

Se nao sabe, responde "nao sei" que eu te ajudo 😊
```

3. **User Input:**
   - Tipo: **Free Text**
   - Salvar em: Custom Field `ascendente`
   - Timeout: **24 horas**
4. Apos resposta, **Conditions:**
   - Se contem um dos 12 signos > Caminho A
   - Se contem "nao sei" > Caminho B
   - Se outra coisa > mensagem educada encerrando

- [ ] Fallback configurado

---

## PARTE 6 — Publicar e Testar

### 6.1 Revisar o Fluxo

1. No editor visual, clicar em CADA bloco e verificar:
   - Textos corretos
   - Links funcionando
   - Tags corretas
   - Custom Fields corretos
2. Verificar que nao ha caminhos "soltos" (blocos sem conexao)

### 6.2 Testar com Preview

Clicar **Preview** (canto superior direito) e testar:

| Cenario                | Digitar       | Resultado esperado                  |
|------------------------|---------------|-------------------------------------|
| Caminho A (aries)      | `aries`       | DM com interpretacao de Aries       |
| Caminho A (leao)       | `leao`        | DM com interpretacao de Leao        |
| Caminho A (sem acento) | `gemeos`      | DM com interpretacao de Gemeos      |
| Caminho B              | `nao sei`     | DM com video tutorial               |
| Fallback               | `bla bla bla` | DM perguntando ascendente           |
| Botoes                 | Clicar cada   | Links abrem / tags aplicam          |

### 6.3 Teste Real

1. **Publish** (canto superior direito — botao fica azul)
2. Pedir pra alguem da equipe (Gabriel, Karol) comentar no post de teste
3. Monitorar DMs nos primeiros 30 minutos
4. Verificar em **Audience** se tags estao sendo aplicadas

- [ ] Preview testado (3+ cenarios)
- [ ] Automacao publicada
- [ ] Teste real com equipe

---

## PARTE 7 — Atualizacao Semanal (Toda Segunda-Feira)

### 7.1 Atualizar Tema da Semana

1. **Settings** > **Bot Fields**
2. Encontrar `tema_semana_global`
3. Trocar valor para o novo tema
4. **Save**

### 7.2 Atualizar as 12 Mini-Interpretacoes

> Se criou como **Bot Fields** (recomendado):

1. **Settings** > **Bot Fields**
2. Atualizar cada campo:

| Campo              | Exemplo de valor                                                |
|--------------------|-----------------------------------------------------------------|
| `interp_aries`     | "Com Marte ativando seu setor de comunicacao, cuidado com..."   |
| `interp_touro`     | "A semana pede revisao financeira. Marte mexe com seu setor..." |
| `interp_gemeos`    | *(preencher)*                                                   |
| `interp_cancer`    | *(preencher)*                                                   |
| `interp_leao`      | *(preencher)*                                                   |
| `interp_virgem`    | *(preencher)*                                                   |
| `interp_libra`     | *(preencher)*                                                   |
| `interp_escorpiao` | *(preencher)*                                                   |
| `interp_sagitario` | *(preencher)*                                                   |
| `interp_capricornio`| *(preencher)*                                                  |
| `interp_aquario`   | *(preencher)*                                                   |
| `interp_peixes`    | *(preencher)*                                                   |

3. **Save** em cada um

**Tempo estimado:** 15-20 minutos por semana.

### Regras das mini-interpretacoes

| Regra      | Descricao                                          |
|------------|---------------------------------------------------|
| Tamanho    | 2-3 frases (max 280 caracteres)                   |
| Tom        | Pessoal, direto, empoderador                      |
| Conteudo   | Qual casa e ativada + o que significa na pratica   |
| Proibido   | Previsoes negativas, fatalismo, medo              |
| Bom        | "essa energia ativa sua casa 7 — conversas honestas" |
| Ruim       | "cuidado com brigas nos relacionamentos"           |

---

## PARTE 8 — Links com UTM

### Camarim Sideral (Caminho A)
```
https://optimizeformobile.vercel.app/?utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-a
```

### Curso Decifrando Mapa Astral (Caminho B)
```
{url_curso}?utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-b
```

> Substituir `{url_curso}` pelo link real antes de configurar.

---

## PARTE 9 — Checklist de Verificacao Final

| #  | Item                                                          | Status |
|----|---------------------------------------------------------------|--------|
| 1  | Custom Fields criados (ascendente + 12 interpretacoes)        | [ ]    |
| 2  | Bot Fields criados (tema_semana_global)                       | [ ]    |
| 3  | Tags criadas (6 tags)                                         | [ ]    |
| 4  | Trigger configurado (palavras-chave)                          | [ ]    |
| 5  | Caminho A: 12 signos com mensagem + delay + botoes            | [ ]    |
| 6  | Caminho B: "nao sei" + video + delay + botoes                 | [ ]    |
| 7  | Fallback: mensagem de reperguntar                             | [ ]    |
| 8  | Botao "Quero fazer parte" > link LP Camarim                   | [ ]    |
| 9  | Botao "Quero aprender mais" > link LP Curso                   | [ ]    |
| 10 | Botao "Agora nao" > tag remarketing                           | [ ]    |
| 11 | Botao "Descobri!" > reconecta no Caminho A                    | [ ]    |
| 12 | Preview testado (3+ cenarios)                                 | [ ]    |
| 13 | Automacao publicada                                           | [ ]    |
| 14 | Teste real com equipe                                         | [ ]    |

---

## Dependencias

| Item                                    | Status         | Responsavel   |
|-----------------------------------------|----------------|---------------|
| Video tutorial "Como descobrir ascendente" | Precisa gravar | Victor        |
| Link LP Camarim com UTM                 | Confirmado     | Fernando      |
| Link LP Curso com UTM                   | Confirmar      | Fernando      |
| Primeira semana de interpretacoes       | Escrever       | Fernando      |

> **Workaround (se video nao estiver pronto):** Substituir por texto:
> "1. Acesse astro.com > 2. Clique em 'Carta Natal Gratuita' > 3. Coloque data, hora e local de nascimento > 4. Seu ascendente aparece ao lado do signo solar"

---

*Documento v2.0 — Guia passo-a-passo para configuracao e manutencao do ManyChat.*
