# Template: Relatorio Astrologico Semanal

> **Proposito:** Relatorio tecnico-pedagogico dos transitos planetarios da semana.
> Serve como insumo para todos os agentes do pipeline de conteudo Pelicula Sideral.
> **Usado por:** @astro-analyst (Agente 1), consumido por Agentes 2-8
> **Versao:** 1.0

---

## Variaveis

| Variavel | Fonte | Descricao |
|----------|-------|-----------|
| `{{SEMANA_INICIO}}` | Input usuario | Data inicio (DD/MM/YYYY) |
| `{{SEMANA_FIM}}` | Input usuario | Data fim (DD/MM/YYYY) |
| `{{EVENTO_PRINCIPAL}}` | Script API (rank #1) | Nome do evento mais importante |
| `{{CLASSIFICACAO_PRINCIPAL}}` | Script API | Nivel: critico/estrutural/gatilho/ambiente |
| `{{FASE_LUNAR}}` | Script API | Fase lunar significativa da semana |
| `{{TABELA_TRANSITOS}}` | Script API | Tabela de posicoes planetarias |
| `{{EVENTOS_RANKEADOS}}` | Script API | Lista de eventos rankeados |
| `{{INGRESSOS}}` | Script API | Planetas que mudam de signo |
| `{{RETROGRADOS}}` | Script API | Planetas retrogrados ativos |
| `{{ELEMENTO_DOMINANTE}}` | Script API | Elemento com mais planetas |
| `{{NARRATIVA_EVENTO_N}}` | Agente Analista | Narrativa por evento (Mecanica + Metafora + Vivencia) |
| ~~`{{INTERPRETACAO_CASA_N}}`~~ | ~~Agente Analista~~ | **REMOVIDO v1.1** — 12 casas produzidas pelos Agentes 3 e 5 |
| `{{KEYWORDS}}` | Agente Analista | Palavras-chave para conteudo |
| `{{TOM_EMOCIONAL}}` | Agente Analista | Tom emocional dominante da semana |
| `{{REFERENCIAS_MITOLOGICAS}}` | Agente Analista | Arquetipos e mitos relevantes |
| `{{MATERIA_PRIMA_RITUAL}}` | Agente Analista | Elementos para o ritual criativo |

---

## Template

---

# Relatorio Astrologico — Semana de {{SEMANA_INICIO}} a {{SEMANA_FIM}}

**Classificacao geral:** {{CLASSIFICACAO_PRINCIPAL}}
**Gerado por:** Agente Sirius (@astro-analyst)

---

## I. PANORAMA CELESTE

> Resumo executivo da semana em 4-6 frases. Tom: academico mas acessivel.
> Deve capturar a "energia geral" da semana para alguem que nao sabe astrologia.

**Evento principal:** {{EVENTO_PRINCIPAL}}

**Fase lunar:** {{FASE_LUNAR}}

**Tom da semana:** {{TOM_EMOCIONAL}}

**Palavra-chave:** {{KEYWORD_PRINCIPAL}}

{{PARAGRAFO_PANORAMA}}

---

## II. MAPA DE TRANSITOS

### Posicoes Planetarias

{{TABELA_TRANSITOS}}

### Mudancas durante a semana

**Ingressos:**
{{INGRESSOS}}

**Retrogrados ativos:**
{{RETROGRADOS}}

---

## III. EVENTOS RANKEADOS POR IMPORTANCIA

> Cada evento segue o framework tripartite:
> **Mecanica** (o que esta acontecendo no ceu)
> **Metafora** (como explicar para um leigo com profundidade)
> **Vivencia** (como a pessoa sente isso no corpo/emocao/vida)

### Evento 1: {{EVENTO_1_TITULO}}

**Classificacao:** {{EVENTO_1_CLASSIFICACAO}}
**Orbe:** {{EVENTO_1_ORBE}}

**A Mecanica:**
{{EVENTO_1_MECANICA}}

**A Metafora:**
{{EVENTO_1_METAFORA}}

**A Vivencia:**
{{EVENTO_1_VIVENCIA}}

**Sintomatologia (o que o leitor pode estar sentindo):**
- {{EVENTO_1_SINTOMA_1}}
- {{EVENTO_1_SINTOMA_2}}
- {{EVENTO_1_SINTOMA_3}}

---

### Evento 2: {{EVENTO_2_TITULO}}

**Classificacao:** {{EVENTO_2_CLASSIFICACAO}}
**Orbe:** {{EVENTO_2_ORBE}}

**A Mecanica:**
{{EVENTO_2_MECANICA}}

**A Metafora:**
{{EVENTO_2_METAFORA}}

**A Vivencia:**
{{EVENTO_2_VIVENCIA}}

---

### Evento 3: {{EVENTO_3_TITULO}}

*(Repetir estrutura para 3-5 eventos top)*

---

## IV. MATERIA-PRIMA PARA CONTEUDO

> NOTA: "Guia por Casa" (12 interpretacoes) sera produzido pelos Agentes 3 e 5,
> nao pelo Agente 1. O relatorio do Agente 1 fornece materia-prima para que
> os agentes downstream criem as interpretacoes por casa.

> Dados brutos e sugestoes para alimentar os agentes de criacao.

### Para o Post Substack (Agente 3)
- **Titulo sugerido:** {{TITULO_SUGERIDO}}
- **Subtitulo poetico:** {{SUBTITULO_POETICO}}
- **Keywords SEO:** {{KEYWORDS}}
- **Metafora central:** {{METAFORA_CENTRAL}}
- **Gancho emocional:** {{GANCHO_EMOCIONAL}}

### Para o Roteiro de Video (Agente 4)
- **Talking points:** {{TALKING_POINTS}}
- **Analogia visual:** {{ANALOGIA_VISUAL}}

### Para a Curadoria Cultural (Agente 6)
- **Temas para pesquisa:** {{TEMAS_CURADORIA}}
- **Arquetipos ativados:** {{ARQUETIPOS}}
- **Elementos (fogo/terra/ar/agua):** {{ELEMENTO_DOMINANTE}}

### Para o Ritual Criativo (Agente 7)
- **Materia-prima ritual:** {{MATERIA_PRIMA_RITUAL}}
- **Elemento do ritual:** {{ELEMENTO_RITUAL}}
- **Objetivo experiencial:** {{OBJETIVO_RITUAL}}

### Referencias Mitologicas
{{REFERENCIAS_MITOLOGICAS}}

---

## V. DADOS BRUTOS (JSON)

> Anexar o JSON completo dos dados da API para referencia e auditoria.
> Usado pelo Agente 2 (Conferencia) para validar o relatorio.

```json
{{JSON_DADOS_BRUTOS}}
```

---

*Template v1.0 — Pelicula Content Pipeline*
*Agente responsavel: @astro-analyst (Sirius)*
