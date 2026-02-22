# PRD: Landing Page Premium - Cursos de Astrologia Película Sideral

**Versão:** 1.1
**Data:** 2026-02-19
**Responsável:** Fernando Queiroz
**Status:** Em Desenvolvimento

**Changelog v1.1:**
- Duas ofertas: R$147 (cursos) e R$297 (cursos + comunidade)
- Copy reescrita em 1ª pessoa (voz do Victor)
- Mandala com função didática (ensina os 5 passos)
- Cada seção com elementos visuais/imagens
- Adicionada foto "Victor na rua" para seção especial

---

## 1. Visão Geral

### 1.1 Objetivo
Criar uma landing page de alta conversão para vender o bundle de cursos de astrologia (Introdução à Astrologia + Decifrando o Mapa Astral) por R$147/ano, através da autoridade e imagem de Victor Dhornelas.

### 1.2 Diferencial Competitivo
- **Não é uma LP genérica** - Visual premium, imersivo, artístico
- **Mandala astrológica interativa em SVG** - Elemento visual único que demonstra o produto
- **Estética vaporwave/synthwave autêntica** - Alinhada com a marca Película Sideral
- **Público altamente visual** - Design como argumento de venda

### 1.3 Métricas de Sucesso
| Métrica | Meta |
|---------|------|
| Lighthouse Performance | > 90 |
| Taxa de Conversão | > 3% |
| Tempo na Página | > 3 min |
| Bounce Rate | < 40% |
| CTR do CTA | > 8% |

---

## 2. Produto

### 2.1 Duas Ofertas (Cards na LP)

#### OFERTA 1: Cursos — R$147/ano
| Item | Detalhe |
|------|---------|
| **Produto** | Bundle: Introdução à Astrologia + Decifrando o Mapa Astral |
| **Preço** | R$147/ano |
| **Checkout** | https://pay.kiwify.com.br/trGhkn8 |
| **Garantia** | 7 dias incondicional |

**Inclui:**
- 2 cursos completos (6 aulas + 6 módulos)
- Glossário visual em PDF
- Checklist de decodificação
- Atualizações semanais

#### OFERTA 2: Cursos + Comunidade — R$297/ano (Destaque)
| Item | Detalhe |
|------|---------|
| **Produto** | Bundle completo + Acesso à Comunidade Camarim Sideral |
| **Preço** | R$297/ano (economia vs. R$19/mês avulso) |
| **Checkout** | [PENDENTE: Link Kiwify para oferta R$297] |
| **Garantia** | 7 dias incondicional |

**Inclui tudo da Oferta 1, mais:**
- Acesso à Comunidade Camarim Sideral (1 ano)
- Considerações Siderais semanais
- Suporte direto com Victor
- Lives e conteúdo exclusivo

**Nota:** Comunidade avulsa custa R$19/mês (R$228/ano). No bundle, sai por R$150/ano.

### 2.2 Conteúdo dos Cursos

**Curso 1: Introdução à Astrologia (6 aulas)**
- Aula 1: Como o céu virou linguagem
- Aula 2: De Babilônia a Alexandria
- Aula 3: Astrologia clássica, medieval e renascentista
- Aula 4: Ciência, arte ou linguagem simbólica
- Aula 5: Por que a astrologia funciona
- Aula 6: Astrologia e imaginário coletivo

**Curso 2: Decifrando o Mapa Astral (6 módulos)**
- Módulo 1: Estrutura Espacial (anatomia concêntrica, bússola invertida)
- Módulo 2: Semiótica dos Símbolos (elementos primordiais, glifos)
- Módulo 3: Arquitetura das Casas (sistemas, interceptação)
- Módulo 4: Dinâmica dos Aspectos (cores, geometria, orbes)
- Módulo 5: Notação Técnica (DMS, retrógrados, tabelas)
- Módulo 6: Algoritmo de Leitura (os 5 passos)

**Bônus (ambas ofertas):**
- Glossário visual em PDF
- Checklist de decodificação
- Atualizações semanais

---

## 3. Público-Alvo

### 3.1 Persona Principal: A Buscadora Sensível
- **Demografia:** Mulher, 25-45 anos, urbana, classe média/alta
- **Psicografia:** Intuitiva, visual, busca autoconhecimento
- **Dor:** Vê mapas astrais e não entende nada; sente-se perdida
- **Desejo:** Autonomia para interpretar seu próprio mapa
- **Objeção:** "Astrologia é muito complexa para mim"

### 3.2 Persona Secundária: A Protagonista Ambiciosa
- **Demografia:** Mulher profissional, 28-40 anos
- **Psicografia:** Estratégica, usa intuição como ferramenta
- **Dor:** Mercado machista invalida sua sensibilidade
- **Desejo:** Validar intuição como inteligência estratégica
- **Objeção:** "Não tenho tempo para estudar"

---

## 4. Identidade Visual

### 4.1 Estética
**Direção:** Vaporwave/Synthwave Surreal com Elementos Cósmicos

**Referências visuais da marca:**
- Colagem surreal: clown cósmico, cidade B&W, planetas coloridos
- Grid geométrico perspectiva (piso estilo Tron)
- Efeitos glitch RGB/VHS
- Elementos prismaticos/rainbow
- Fundo escuro com acentos neon

### 4.2 Paleta de Cores
```css
:root {
  /* Primárias */
  --periwinkle: #b0aed7;      /* Backgrounds suaves, cards */
  --dark-amethyst: #2c234c;   /* Fundo principal */
  --graphite: #2f2f2f;        /* Textos secundários */

  /* Acentos */
  --fuchsia-plum: #d04ca4;    /* CTAs, botões primários */
  --ultrasonic-blue: #630cc5; /* Links, ícones */
  --pacific-blue: #21b3cb;    /* Destaques, hover */
  --saffron: #e3b805;         /* Urgência, preço, badges */

  /* Neutros */
  --white: #ffffff;
  --off-white: #f5f5f7;
  --black: #0a0a0a;
}
```

### 4.3 Tipografia
```css
/* Headlines impactantes */
font-family: 'Eczar', serif;
font-weight: 700;

/* Subtítulos elegantes */
font-family: 'Crimson Text', serif;
font-weight: 400;

/* Body text e UI */
font-family: 'Pridi', sans-serif;
font-weight: 400;
```

### 4.4 Efeitos Visuais
- **Glitch RGB:** Sutil em hover de imagens e transições
- **Scanlines:** Overlay leve em seções escuras
- **Glow neon:** Em CTAs e elementos de destaque
- **Grain/Noise:** Textura sutil em backgrounds
- **Prismatic gradients:** Em bordas e separadores

---

## 5. Arquitetura de Informação

### 5.0 Diretriz Visual
**IMPORTANTE:** Cada seção DEVE ter elementos visuais — imagens, SVGs, ou backgrounds ilustrados. Não apenas texto e cards brancos. O público é altamente visual.

### 5.1 Estrutura da Página

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (sticky)                                         │
│ Logo | Nav minimal | CTA "Quero Decifrar"              │
│ [BG: transparente → escuro no scroll]                   │
├─────────────────────────────────────────────────────────┤
│ HERO (100vh)                                            │
│ - Mandala SVG interativa (background, 30% opacidade)    │
│ - Headline em 1ª pessoa (Victor falando)                │
│ - Foto Victor com livros + efeito glitch                │
│ - CTA primário com glow                                 │
│ [BG: dark-amethyst + mandala + grain texture]           │
├─────────────────────────────────────────────────────────┤
│ PROBLEMA (Agitação)                                     │
│ - 3 dores visuais com ícones SVG de signos              │
│ - Imagem de mapa astral "borrado/confuso" ao lado       │
│ - Transição emocional                                   │
│ [BG: gradient sutil + elementos cósmicos flutuantes]    │
├─────────────────────────────────────────────────────────┤
│ VIRADA (O Método) — SEÇÃO DIDÁTICA                      │
│ - Mandala DIDÁTICA interativa (ensina os 5 passos)      │
│ - Cada clique revela: nome + explicação + visual        │
│ - Demonstração prática do algoritmo                     │
│ [BG: grid geométrico estilo Tron + glow nos elementos]  │
├─────────────────────────────────────────────────────────┤
│ JORNADA INTERIOR (Nova Seção)                           │
│ - Foto Victor na rua com quadro (fullwidth)             │
│ - Texto: "O mapa te leva pra dentro de você"            │
│ - Efeito parallax na imagem                             │
│ [BG: foto fullbleed com overlay gradient]               │
├─────────────────────────────────────────────────────────┤
│ AUTORIDADE (Victor)                                     │
│ - Foto artística tons quentes (@dagabi.gomes-12)        │
│ - História em 1ª pessoa (pai palhaço + mãe astróloga)   │
│ - Números: 8+ anos, 1000+ mapas                         │
│ - Foto do pai como elemento emocional                   │
│ [BG: split — foto de um lado, texto do outro]           │
├─────────────────────────────────────────────────────────┤
│ CONTEÚDO (O que você vai dominar)                       │
│ - Cards dos módulos com glifos SVG como ícones          │
│ - Screenshots das aulas como preview                    │
│ - Accordion com detalhes                                │
│ [BG: cards com borda glow + fundo com constelações]     │
├─────────────────────────────────────────────────────────┤
│ TRANSFORMAÇÃO (Antes/Depois)                            │
│ - Slider interativo: mapa borrado → mapa anotado        │
│ - Animação de "revelação"                               │
│ [BG: contraste visual forte entre os dois lados]        │
├─────────────────────────────────────────────────────────┤
│ PROVA SOCIAL                                            │
│ - 4-6 depoimentos em cards com foto                     │
│ - Carousel com autoplay sutil                           │
│ [BG: dark com estrelas sutis + cards com glow]          │
├─────────────────────────────────────────────────────────┤
│ OFERTA (2 CARDS)                                        │
│ - Card 1: Cursos R$147/ano                              │
│ - Card 2: Cursos + Comunidade R$297/ano (destaque)      │
│ - Bônus listados com ícones                             │
│ - CTAs com efeito glow pulsante                         │
│ [BG: gradient dramático + elementos prismaticos]        │
├─────────────────────────────────────────────────────────┤
│ GARANTIA                                                │
│ - Visual de "ingresso de cinema" (SVG ilustrado)        │
│ - 7 dias, tom acolhedor em 1ª pessoa                    │
│ [BG: textura VHS/film grain]                            │
├─────────────────────────────────────────────────────────┤
│ FAQ                                                     │
│ - 6 perguntas em accordion                              │
│ - Ícone de planeta diferente para cada pergunta         │
│ [BG: sutil com linhas de constelação]                   │
├─────────────────────────────────────────────────────────┤
│ CTA FINAL                                               │
│ - Mandala simplificada em background                    │
│ - Frase de fechamento emocional em 1ª pessoa            │
│ - Último CTA com ambas ofertas                          │
│ [BG: mandala + gradient intenso]                        │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
│ - Logo | Links legais | Redes sociais                   │
│ [BG: dark-amethyst sólido]                              │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Nova Seção: "Jornada Interior"
**Posição:** Entre "Método" e "Autoridade"

**Conceito:** Seção emocional de transição usando a foto do Victor atravessando a rua com um quadro/retrato. O quadro simboliza o autorretrato interior que a astrologia revela.

**Layout:**
- Foto fullwidth com overlay gradient
- Texto centralizado: "O mapa te leva pra dentro de você"
- Efeito parallax na imagem ao scroll
- Sem CTA (seção contemplativa)

---

## 6. Componentes Especiais

### 6.1 Mandala Astrológica DIDÁTICA (SVG)

**Descrição:** Elemento visual central com FUNÇÃO EDUCATIVA. Não é apenas decorativa — ela ENSINA os 5 passos do método ao interagir.

**Propósito Didático:**
A mandala demonstra visualmente o que o aluno vai aprender. Cada interação ensina um conceito do método de leitura.

**Especificações Técnicas:**
```
- Formato: SVG inline (não imagem)
- Tamanho: Responsivo (300px mobile → 600px desktop)
- Animações: CSS animations + GSAP para interações
- Interatividade: Click/tap revela informações educativas
- Acessibilidade: ARIA labels, navegação por teclado
```

**Camadas da Mandala:**
1. **Círculo externo:** 12 signos com glifos SVG
2. **Círculo médio:** 12 casas numeradas
3. **Centro:** Sol/Lua/Ascendente (luminares)
4. **Linhas de aspecto:** Conectando planetas (vermelho=tensão, azul=harmonia)
5. **Planetas:** Glifos posicionados conforme grau

**Comportamento DIDÁTICO (Seção Método):**

| Passo | Elemento Destacado | Ação do Usuário | O que Aprende |
|-------|-------------------|-----------------|---------------|
| **1. ÂNCORA** | Ascendente (ASC) pulsa | Click no ASC | "O Ascendente é sua porta de entrada. É por aqui que você começa a ler qualquer mapa." |
| **2. LUMINARES** | Sol e Lua iluminam | Click no Sol/Lua | "Sol = sua essência. Lua = suas emoções. Esses dois são os protagonistas do seu filme." |
| **3. GESTALT** | Todos os planetas piscam | Click em "Ver padrão" | "Observe onde os planetas se concentram. Metade do mapa vazio? Metade cheia? Isso conta uma história." |
| **4. TENSÃO** | Linha vermelha destaca | Click na linha | "As linhas vermelhas mostram onde está o conflito. Esse é o plot twist do seu mapa." |
| **5. SÍNTESE** | Tudo se conecta | Animação automática | "Agora você junta tudo: porta de entrada + protagonistas + padrão + conflito = sua narrativa." |

**Fluxo de Interação:**
```
Estado inicial: Mandala estática, botões dos 5 passos numerados ao redor
↓
Usuário clica "Passo 1"
↓
Ascendente pulsa + tooltip aparece com explicação
↓
Botão "Passo 1" fica marcado como "completo"
↓
Usuário clica "Passo 2"
↓
(continua até Passo 5)
↓
Estado final: Badge "Você completou o método!" + CTA para comprar
```

**Uso nas Seções:**

| Seção | Variação | Função |
|-------|----------|--------|
| Hero | Completa, background, 30% opacidade | Atmosférica (não interativa) |
| Método | Interativa, clicável, ensina os 5 passos | DIDÁTICA (principal) |
| CTA Final | Simplificada, menor | Decorativa (não interativa) |

**Mobile:**
- Passos em lista vertical abaixo da mandala
- Tap em cada passo anima o elemento correspondente
- Mandala reduzida mas funcional

### 6.2 Efeito Glitch na Foto do Victor

**Descrição:** Foto estática com efeito glitch sutil que ativa em hover ou em intervalos.

**Implementação:**
```css
.victor-photo {
  position: relative;
}

.victor-photo::before,
.victor-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  mix-blend-mode: screen;
}

.victor-photo:hover::before {
  animation: glitch-1 0.3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-3px, 0);
  opacity: 0.8;
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
  40% { transform: translate(3px, -2px); filter: hue-rotate(180deg); }
  60% { transform: translate(-2px, 1px); filter: hue-rotate(270deg); }
}
```

### 6.3 Cards de Módulo com Glifos SVG

**Descrição:** Cards de conteúdo do curso usando glifos astrológicos como ícones.

**Glifos necessários (SVG):**
- ☉ Sol (luminares)
- ☽ Lua (luminares)
- ☿ Mercúrio (comunicação)
- ♀ Vênus (valores)
- ♂ Marte (ação)
- ♃ Júpiter (expansão)
- ♄ Saturno (estrutura)
- ♅ Urano (inovação)
- ♆ Netuno (intuição)
- ♇ Plutão (transformação)
- ASC Ascendente
- MC Meio do Céu

### 6.4 Seção de Transformação (Antes/Depois)

**Descrição:** Visual split mostrando a jornada do aluno.

**Layout:**
```
┌─────────────────┬─────────────────┐
│     ANTES       │     DEPOIS      │
│                 │                 │
│  Mapa astral    │  Mapa astral    │
│  borrado/       │  nítido com     │
│  confuso        │  anotações      │
│                 │                 │
│  "Círculos,     │  "Lua em        │
│  linhas,        │  Escorpião na   │
│  símbolos..."   │  Casa 8..."     │
└─────────────────┴─────────────────┘
```

**Interação:** Slider arrastável revela gradualmente o "depois".

---

## 7. Copy (Em 1ª Pessoa — Voz do Victor)

**IMPORTANTE:** Toda a copy deve soar como Victor falando diretamente com a pessoa. Tom: acolhedor, cinematográfico, vulnerável, mineiro urbano (sem caricatura).

### 7.1 Hero

**Headline:**
> "Eu sei que você olha pro seu mapa astral e não entende nada."

**Subheadline:**
> E tá tudo bem. Eu também já me senti assim — até criar um método visual de 5 passos que transforma aquele emaranhado de símbolos em uma história que faz sentido. Deixa eu te mostrar.

**CTA:**
> QUERO APRENDER A LER MEU MAPA

### 7.2 Seção Problema

**Headline:**
> "Círculos, linhas, símbolos estranhos... parece grego, né?"

**Copy (Victor falando):**
> Eu já perdi a conta de quantas pessoas me mandaram mensagem dizendo:
>
> *"Victor, eu abro meu mapa e não faço ideia do que tô vendo."*
>
> *"Sei que sou de Capricórnio, mas cadê minha Lua? E o que é Casa 7?"*
>
> *"Tem tanta coisa que eu nem sei por onde começar."*
>
> Se você se identificou, respira. Você não é burra. O problema é que ninguém te ensinou a OLHAR pra isso direito.

### 7.3 Seção Método (Os 5 Passos)

**Headline:**
> "Deixa eu te mostrar como eu leio qualquer mapa em 5 passos"

**Intro:**
> Depois de ler mais de 1.000 mapas, eu percebi que todo mundo trava nos mesmos lugares. Então criei um algoritmo visual — um caminho que funciona pra qualquer mapa, de qualquer pessoa.

**Passos (explicados por Victor):**

1. **ÂNCORA**
   > "Primeiro, eu encontro o Ascendente. É a porta de entrada do mapa. Por aqui que a gente começa."

2. **LUMINARES**
   > "Depois, eu localizo o Sol e a Lua — os protagonistas do filme. Sol é quem você É. Lua é o que você SENTE."

3. **GESTALT**
   > "Aí eu dou um passo pra trás e olho o padrão geral. Os planetas estão espalhados ou concentrados? Metade vazia? Isso conta uma história."

4. **TENSÃO PRINCIPAL**
   > "Agora eu procuro a linha vermelha mais apertada. Esse é o conflito central — o plot twist que movimenta tudo."

5. **SÍNTESE**
   > "Por fim, eu junto tudo numa narrativa. Porta de entrada + protagonistas + padrão + conflito = o roteiro da sua vida."

### 7.4 Seção "Jornada Interior"

**Texto (sobre a foto Victor na rua):**
> "O mapa te leva pra dentro de você."

**Subtexto (opcional):**
> "A astrologia não prevê o futuro. Ela ilumina o presente."

### 7.5 Seção Autoridade

**Headline:**
> "Quem sou eu pra te ensinar isso?"

**Copy (Victor contando sua história):**
> Minha mãe lia mapas astrais na mesa da cozinha. Meu pai era palhaço de circo — literalmente.
>
> Eu cresci entre constelações e palcos. Aos 8 anos, já sabia que Saturno era o "diretor chato" do céu. Aos 15, li meu primeiro mapa pra alguém de fora da família.
>
> Hoje, aos 29, depois de mais de 1.000 mapas lidos, criei a Película Sideral — um jeito de ensinar astrologia usando a linguagem que eu mais amo: o cinema.
>
> Não sou guru. Não tenho barba branca nem tô no topo de uma montanha. Sou parceiro de cena. Tô aqui pra te ajudar a ler o roteiro da sua própria vida.

**Números:**
- 8+ anos estudando astrologia
- 1.000+ mapas interpretados
- Método visual único

### 7.6 Seção Oferta

**Headline:**
> "Sua entrada pro backstage do céu"

**Intro:**
> Eu reuni tudo que aprendi em dois cursos completos. Do básico absoluto até você conseguir pegar qualquer mapa e contar a história dele.

**Card 1 — Cursos (R$147/ano):**
> **Pra quem quer aprender no próprio ritmo**
>
> - 2 cursos completos (12+ horas de conteúdo)
> - Introdução à Astrologia (6 aulas)
> - Decifrando o Mapa Astral (6 módulos)
> - Glossário visual em PDF
> - Checklist de decodificação
> - Atualizações semanais
>
> **R$147/ano** (menos de R$13 por mês)

**Card 2 — Cursos + Comunidade (R$297/ano) [DESTAQUE]:**
> **Pra quem quer aprender junto comigo**
>
> - Tudo do plano anterior, MAIS:
> - Acesso à Comunidade Camarim Sideral
> - Considerações Siderais toda semana
> - Suporte direto comigo
> - Lives e conteúdo exclusivo
>
> **R$297/ano** (economia de R$150 vs. comunidade avulsa)

### 7.7 Seção Garantia

**Headline:**
> "Garantia de Bilheteria: 7 Dias"

**Copy:**
> Entrou na sala e sentiu que não era o filme que você queria ver? Tá tudo bem.
>
> Se em 7 dias você não curtir, eu devolvo 100% do seu dinheiro. É só me mandar um e-mail. Sem burocracia, sem drama.
>
> A amizade continua.

### 7.8 FAQ (Respostas em 1ª pessoa)

1. **Preciso saber alguma coisa de astrologia antes?**
   > Não. Eu começo do zero — literalmente explicando por que o céu virou linguagem lá na Babilônia.

2. **Quanto tempo tenho de acesso?**
   > 1 ano completo. Dá tempo de assistir, reassistir, praticar e voltar quando quiser.

3. **Funciona com qualquer app de mapa astral?**
   > Sim. O método é universal — Astro.com, Solar Fire, Time Passages, Co-Star, qualquer um.

4. **E se eu não gostar?**
   > Você tem 7 dias pra pedir reembolso total. Sem perguntas, sem justificativa.

5. **Tem suporte pra tirar dúvidas?**
   > Na oferta de R$147, você tem acesso às aulas e materiais. Na oferta de R$297, você entra na comunidade e pode tirar dúvidas direto comigo.

6. **Posso parcelar?**
   > Sim, em até 12x no cartão via Kiwify.

7. **Qual a diferença entre as duas ofertas?**
   > A de R$147 é pra quem quer estudar sozinho. A de R$297 inclui a comunidade, onde eu posto conteúdo toda semana e você pode interagir comigo e com outros alunos.

### 7.9 CTA Final

**Headline:**
> "O roteiro tá pronto. Só falta você assumir a direção."

**Copy:**
> Você pode continuar olhando pro seu mapa sem entender nada. Ou pode aprender a ler — e descobrir coisas sobre você que sempre estiveram ali, esperando.

**CTAs:**
> [QUERO OS CURSOS — R$147] [QUERO CURSOS + COMUNIDADE — R$297]

---

## 8. Assets Necessários

### 8.1 Fotos (já disponíveis)
| Uso | Arquivo | Descrição |
|-----|---------|-----------|
| Hero | `foto da hero.png` | Victor com pilha de livros, cenário teatral |
| **Jornada Interior** | `victor na rua.jpeg` | **Victor atravessando rua com quadro/retrato** — seção emocional |
| Autoridade | `VictorDhornelas _ foto @dagabi.gomes-12.jpeg` | Tons quentes, pose contemplativa |
| Autoridade alt | `VictorDhornelas _ foto @dagabi.gomes-15.jpeg` | Alternativa mesma sessão |
| História (pai) | `foto do pai do victor.png` | Pai de Victor (elemento emocional) |
| Curso 1 | `foto da aula - introducao a astrologia.png` | Screenshot/preview do curso |
| Curso 2 | `foto da aula - decifrando mapa astral.png` | Screenshot/preview do curso |
| Avatar | `foto de perfil ou avatar.jpeg` | Para depoimentos/footer |
| Estética | `estetica.jpg` | Referência vaporwave/synthwave |
| Estética surreal | `estetica_rabisco-geometrico.png` | Colagem cósmica (referência visual) |

### 8.2 SVGs a Criar
- [ ] Mandala astrológica completa (componente principal)
- [ ] 12 glifos de signos
- [ ] 10 glifos de planetas + ASC + MC
- [ ] Ícones de aspectos (conjunção, oposição, trígono, quadratura, sextil)
- [ ] Elementos decorativos (estrelas, cometas, grid)
- [ ] Ícone de garantia (ingresso de cinema)

### 8.3 Animações
- [ ] Rotação da mandala (CSS)
- [ ] Glitch effect (CSS)
- [ ] Reveal dos passos (GSAP/CSS)
- [ ] Parallax entre camadas (scroll-driven)
- [ ] Hover states (glow, scale)
- [ ] Slider antes/depois (JS)

---

## 9. Stack Técnica

### 9.1 Framework
**Astro 4.x** — Static Site Generator

**Justificativa:**
- SSG = bundle mínimo, carregamento ultra-rápido
- Islands Architecture = JS apenas onde necessário
- View Transitions nativas = animações fluidas
- Melhor Lighthouse score vs Next.js para sites estáticos

### 9.2 Styling
**Tailwind CSS 3.x** + **CSS Custom Properties**

```
tailwind.config.js
├── Cores customizadas (paleta Película Sideral)
├── Fontes customizadas (Eczar, Crimson, Pridi)
├── Animações customizadas
└── Componentes base
```

### 9.3 Animações
- **CSS Animations:** Efeitos simples (glitch, glow, rotate)
- **GSAP (lite):** ScrollTrigger para parallax e reveals
- **View Transitions API:** Transições de página

### 9.4 Interatividade
- **Vanilla JS:** Slider antes/depois, accordion
- **SVG inline:** Mandala interativa com CSS hover states

### 9.5 Infraestrutura
| Serviço | Uso |
|---------|-----|
| **Vercel** | Hosting + Deploy |
| **Cloudflare** | DNS (subdomínio) |
| **Kiwify** | Checkout |
| **Meta Pixel** | Tracking |
| **Google Analytics** | Analytics |

### 9.6 Estrutura de Pastas
```
curso-pelicula-sideral/
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Mandala.astro
│   │   ├── MandalaInteractive.astro
│   │   ├── ProblemSection.astro
│   │   ├── MethodSection.astro
│   │   ├── AuthoritySection.astro
│   │   ├── ContentSection.astro
│   │   ├── TransformationSlider.astro
│   │   ├── TestimonialsCarousel.astro
│   │   ├── OfferCard.astro
│   │   ├── GuaranteeSection.astro
│   │   ├── FAQ.astro
│   │   ├── FinalCTA.astro
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── global.css
│   │   ├── animations.css
│   │   └── glitch.css
│   ├── scripts/
│   │   ├── mandala.js
│   │   ├── slider.js
│   │   └── scroll-animations.js
│   └── assets/
│       ├── images/
│       └── svg/
├── public/
│   ├── fonts/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## 10. Performance

### 10.1 Metas
| Métrica | Meta | Estratégia |
|---------|------|------------|
| LCP | < 2.5s | Preload hero image, font-display: swap |
| FID | < 100ms | JS mínimo, defer non-critical |
| CLS | < 0.1 | Aspect ratios definidos, font fallbacks |
| TTI | < 3.5s | Code splitting, lazy load below fold |

### 10.2 Otimizações
- **Imagens:** WebP/AVIF com fallback, srcset responsivo
- **Fontes:** Subset, preload, font-display: swap
- **CSS:** Critical CSS inline, resto async
- **JS:** Apenas onde necessário (Islands)
- **SVGs:** Inline para mandala, sprite para ícones repetidos

---

## 11. Tracking & Analytics

### 11.1 Meta Pixel Events
```javascript
// PageView (automático)
fbq('track', 'PageView');

// ViewContent (scroll 50%)
fbq('track', 'ViewContent', {
  content_name: 'Cursos Astrologia Bundle',
  content_category: 'Curso Online',
  value: 147.00,
  currency: 'BRL'
});

// InitiateCheckout (click CTA)
fbq('track', 'InitiateCheckout', {
  value: 147.00,
  currency: 'BRL'
});
```

### 11.2 Google Analytics Events
- `scroll_depth`: 25%, 50%, 75%, 100%
- `cta_click`: section, button_text
- `faq_open`: question_id
- `mandala_interaction`: element_type

---

## 12. SEO

### 12.1 Meta Tags
```html
<title>Cursos de Astrologia | Aprenda a Decifrar Mapas Astrais | Película Sideral</title>
<meta name="description" content="Aprenda a ler qualquer mapa astral com o método visual de 5 passos. 2 cursos completos por R$147/ano. Garantia de 7 dias.">
<meta name="keywords" content="curso astrologia, mapa astral, aprender astrologia, decifrando mapa astral, Victor Dhornelas">
```

### 12.2 Open Graph
```html
<meta property="og:title" content="Cursos de Astrologia | Película Sideral">
<meta property="og:description" content="Aprenda a decifrar qualquer mapa astral com o método visual de 5 passos.">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://curso.peliculasideral.com.br">
```

### 12.3 Schema.org
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Decifrando o Mapa Astral",
  "description": "Curso completo para aprender a interpretar mapas astrais",
  "provider": {
    "@type": "Person",
    "name": "Victor Dhornelas"
  },
  "offers": {
    "@type": "Offer",
    "price": "147",
    "priceCurrency": "BRL"
  }
}
```

---

## 13. Acessibilidade

### 13.1 Requisitos WCAG 2.1 AA
- [ ] Contraste mínimo 4.5:1 para texto
- [ ] Alt text em todas as imagens
- [ ] Focus visible em elementos interativos
- [ ] Navegação por teclado funcional
- [ ] ARIA labels na mandala interativa
- [ ] Reduced motion para animações

### 13.2 Implementação
```css
@media (prefers-reduced-motion: reduce) {
  .mandala { animation: none; }
  .glitch-effect { animation: none; }
}
```

---

## 14. Cronograma Sugerido

### Fase 1: Setup & Design System (1-2 dias)
- [ ] Setup projeto Astro
- [ ] Configurar Tailwind com paleta customizada
- [ ] Importar fontes
- [ ] Criar componentes base (Button, Card, Section)

### Fase 2: SVGs & Mandala (2-3 dias)
- [ ] Criar glifos de signos em SVG
- [ ] Criar glifos de planetas em SVG
- [ ] Desenvolver mandala base (estática)
- [ ] Adicionar animações CSS
- [ ] Implementar interatividade

### Fase 3: Seções da LP (3-4 dias)
- [ ] Hero com foto + mandala background
- [ ] Seção Problema
- [ ] Seção Método (mandala interativa)
- [ ] Seção Autoridade
- [ ] Seção Conteúdo
- [ ] Seção Transformação (slider)
- [ ] Seção Depoimentos
- [ ] Seção Oferta
- [ ] Seção Garantia
- [ ] FAQ
- [ ] CTA Final
- [ ] Header + Footer

### Fase 4: Polish & Otimização (1-2 dias)
- [ ] Animações de scroll
- [ ] Efeito glitch nas fotos
- [ ] Performance optimization
- [ ] Responsividade mobile
- [ ] Testes cross-browser

### Fase 5: Deploy & Tracking (1 dia)
- [ ] Deploy na Vercel
- [ ] Configurar domínio
- [ ] Instalar Meta Pixel
- [ ] Configurar Google Analytics
- [ ] Testar checkout

---

## 15. Referências

### 15.1 Inspirações Visuais
- [Stripe](https://stripe.com) — Animações sutis, performance
- [Linear](https://linear.app) — Dark mode, glow effects
- [Raycast](https://raycast.com) — Gradients, visual polish
- [Vercel](https://vercel.com) — Grid patterns, tech aesthetic

### 15.2 Referências Astrológicas
- [Astro.com](https://astro.com) — Visualização de mapas
- [Co-Star](https://costarastrology.com) — Design moderno de astrologia

### 15.3 Assets Técnicos
- [Astro Icons](https://github.com/astro-community/icons) — Ícones otimizados
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/) — Animações de scroll

---

## Aprovação

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Product Manager | Morgan (@pm) | 2026-02-19 | ✅ Criado |
| Cliente | Fernando | - | ⏳ Pendente |
| Desenvolvedor | - | - | ⏳ Pendente |

---

*Documento criado por Morgan (@pm) - Película Sideral*
*Versão 1.0 - 2026-02-19*
