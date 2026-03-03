# Diagrama Visual — Funil Spoiler Astrologico da Semana

**Cliente:** Pelicula Sideral
**Criado:** 2026-02-24
**Referencia:** `docs/funil-spoiler-semanal.md`

---

## Funil Completo

```mermaid
flowchart TD
    %% ============================================
    %% TOPO — AWARENESS (100k+ alcance organico)
    %% ============================================

    subgraph TOPO["🔺 TOPO — AWARENESS"]
        direction TB

        R1["🎬 Reels: Jornal Sideral #1\n(Terca — Victor grava, Gabriel edita)\n50-100k alcance"]
        R2["🎬 Reels: Jornal Sideral #2\n(Quinta — Victor grava, Gabriel edita)\n50-100k alcance"]
        ST["📱 Stories: Teaser Spoiler\n(Quarta — Victor)\n6-8 stories sequenciais\nCaixinha: 'Qual seu ascendente?'"]
        STL["📱 Stories: Lembrete\n(Sexta — Karol)\nProva social + urgencia"]
        RC["🎬 Reels: Cortes/Highlights\nSpoiler anterior\nCTA: 'Link na bio'"]

        R1 --> |"CTA legenda:\n'Comenta teu ascendente'"| CMT
        R2 --> |"CTA legenda:\n'Comenta teu ascendente'"| CMT
        ST --> |"Resposta caixinha\nou reply"| CMT
        STL --> |"Engajamento\ndireto"| CMT
        RC --> |"Link na bio"| LINKTREE

        CMT{{"💬 Comentario / Resposta\nno Instagram"}}
        LINKTREE["🔗 Linktree Pelicula\nlp.peliculasideral.com.br"]
    end

    %% ============================================
    %% TRIGGER — ManyChat
    %% ============================================

    CMT --> |"Trigger automatico"| MC
    MC{{"🤖 ManyChat\nDetecta palavra-chave"}}

    MC --> |"Signo detectado:\naries, touro, gemeos..."| CA
    MC --> |"'nao sei' detectado"| CB
    MC --> |"Nao reconhecido"| FALL

    %% ============================================
    %% MEIO — CONSIDERATION (ManyChat + Substack)
    %% ============================================

    subgraph MEIO["🔷 MEIO — CONSIDERATION"]
        direction TB

        subgraph CaminhoA["Caminho A — Sabe o Ascendente"]
            CA["1. Mini-interpretacao\npersonalizada do signo\n(12 versoes por semana)"]
            CA2["2. Transicao natural:\n'Toda semana eu aprofundo\nisso no Camarin...'"]
            CA3["3. CTA: 'Quero fazer parte'"]
            CA --> CA2 --> CA3
        end

        subgraph CaminhoB["Caminho B — Nao Sabe o Ascendente"]
            CB["1. 'Sem problema!'\nEnvia video tutorial\n'Como descobrir ascendente' (90s)"]
            CB2["2. 'Conseguiu descobrir?\nSaber seu ascendente\nmuda tudo!'"]
            CB3{"Resposta?"}
            CB --> CB2 --> CB3
        end

        FALL["🔄 Fallback:\n'Qual seu ascendente?'\nRedireciona pro fluxo"]

        subgraph SubstackFlow["Substack — Nurturing (Segunda)"]
            SUB["📧 Post semanal expandido\nPanorama astrologico\n(Fernando + IA)"]
            SUB2["🔒 Paywall\nAntes das interpretacoes\npor signo"]
            SUB3["CTA final:\nConvite Camarin"]
            SUB --> SUB2 --> SUB3
        end
    end

    CB3 --> |"'Descobri! Meu\nascendente e...'"| CA
    CB3 --> |"'Quero aprender mais'"| LP_CURSO
    FALL --> MC

    %% ============================================
    %% FUNDO — CONVERSAO
    %% ============================================

    subgraph FUNDO["🔻 FUNDO — CONVERSAO"]
        direction TB

        subgraph LP_Camarin["LP Camarin Sideral"]
            LP_CAM["🌐 optimizeformobile.vercel.app\nAssinatura comunidade"]
            CHK_SUB["💳 Checkout Substack\nMensal: R$19/mes"]
            CHK_KIW_A["💳 Checkout Kiwify\nAnual: R$297\n(12x R$31)"]
            LP_CAM --> CHK_SUB
            LP_CAM --> CHK_KIW_A
        end

        subgraph LP_Curso["LP Curso Decifrando"]
            LP_CURSO["🌐 lp-decifrando-v3.vercel.app\nCurso completo"]
            CHK_SOLO["💳 Checkout Kiwify\nSolo: R$147\n(12x R$14,23)"]
            CHK_PKG["💳 Checkout Kiwify\nPacote: R$297\n(Curso + Camarin Anual)"]
            LP_CURSO --> CHK_SOLO
            LP_CURSO --> CHK_PKG
        end
    end

    CA3 --> LP_CAM
    SUB3 --> LP_CAM
    LINKTREE --> LP_CAM
    LINKTREE --> LP_CURSO

    %% ============================================
    %% POS-VENDA / RETENCAO
    %% ============================================

    subgraph RETENCAO["♻️ RETENCAO"]
        AULA["🎓 Aula: Spoiler da Semana\n(Domingo — Victor + Sylvia)\nEntrega de valor"]
        FOMO["📱 Stories pos-aula\nHighlights + FOMO\n(Domingo — Karol)"]
        AULA --> FOMO
    end

    CHK_SUB --> AULA
    CHK_KIW_A --> AULA
    CHK_PKG --> AULA
    FOMO --> |"Novos seguidores\nveem highlights"| TOPO

    %% ============================================
    %% REMARKETING
    %% ============================================

    CA3 -. "Agora nao →\nTag remarketing" .-> RMK["🎯 Remarketing\nPixels FB + X\nnas LPs"]
    RMK -. "Retargeting ads" .-> LP_CAM
    RMK -. "Retargeting ads" .-> LP_CURSO

    %% ============================================
    %% ESTILOS
    %% ============================================

    classDef topo fill:#FF6B6B,stroke:#CC0000,color:#fff
    classDef meio fill:#4ECDC4,stroke:#009688,color:#fff
    classDef fundo fill:#45B7D1,stroke:#0277BD,color:#fff
    classDef trigger fill:#FFE66D,stroke:#F9A825,color:#333
    classDef checkout fill:#95E1D3,stroke:#00897B,color:#333
    classDef retencao fill:#DDA0DD,stroke:#8B008B,color:#333

    class R1,R2,ST,STL,RC topo
    class CA,CA2,CA3,CB,CB2,CB3,FALL,SUB,SUB2,SUB3 meio
    class LP_CAM,LP_CURSO fundo
    class CMT,MC trigger
    class CHK_SUB,CHK_KIW_A,CHK_SOLO,CHK_PKG checkout
    class AULA,FOMO retencao
```

---

## Fluxo ManyChat (Detalhe)

```mermaid
flowchart TD
    TRIGGER["💬 Comentario / Reply\nno Instagram"] --> DETECT{{"🤖 ManyChat\nDeteccao de palavra-chave"}}

    DETECT --> |"aries, touro, gemeos,\ncancer, leao, virgem,\nlibra, escorpiao,\nsagitario, capricornio,\naquario, peixes"| A1

    DETECT --> |"nao sei, n sei,\nnao tenho certeza"| B1

    DETECT --> |"spoiler, quero"| A_GEN["Caminho A\n(generico)"]

    DETECT --> |"Nao reconhecido"| FALLBACK["'Qual seu ascendente?'\nBotoes: 12 signos\n+ 'Nao sei'"]

    subgraph A["✅ CAMINHO A — Sabe o Ascendente"]
        A1["DM imediato:\nMini-interpretacao\npersonalizada\n{signo} + {tema_semana}"]
        A2["⏱️ 30s depois:\n'Toda semana eu aprofundo\nisso ao vivo no\nCamarin Sideral.\nQuer conhecer?'"]
        A3{"Resposta?"}
        A1 --> A2 --> A3
    end

    A_GEN --> A1

    A3 --> |"'Quero fazer parte ✨'"| LP1["🔗 LP Camarin Sideral\n+ UTM: caminho-a"]
    A3 --> |"'Agora nao'"| TAG["🏷️ Tag: remarketing\n(recontatar depois)"]

    subgraph B["📹 CAMINHO B — Nao Sabe o Ascendente"]
        B1["DM imediato:\n'Sem problema! Fiz um\nvideo rapidinho te mostrando\ncomo descobrir.'"]
        B2["📹 Envia video tutorial\n'Como descobrir seu\nascendente' (60-90s)"]
        B3["⏱️ 2 min depois:\n'Conseguiu descobrir?\nSaber seu ascendente\nmuda tudo na astrologia!'"]
        B4{"Resposta?"}
        B1 --> B2 --> B3 --> B4
    end

    B4 --> |"'Quero aprender mais'"| LP2["🔗 LP Curso Decifrando\n+ UTM: caminho-b"]
    B4 --> |"'Descobri! Meu\nascendente e {signo}'"| A1

    FALLBACK --> |"Seleciona signo"| A1
    FALLBACK --> |"'Nao sei'"| B1

    classDef caminhoA fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef caminhoB fill:#FF9800,stroke:#E65100,color:#fff
    classDef lp fill:#2196F3,stroke:#0D47A1,color:#fff
    classDef fallback fill:#9E9E9E,stroke:#616161,color:#fff

    class A1,A2,A3 caminhoA
    class B1,B2,B3,B4 caminhoB
    class LP1,LP2 lp
    class FALLBACK,A_GEN fallback
```

---

## Grade Semanal (Timeline)

```mermaid
gantt
    title Grade Semanal — Spoiler Astrologico
    dateFormat X
    axisFormat %s

    section Producao
    Briefing semana seguinte        :done, 0, 1
    Roteiros Reels + Stories        :active, 1, 2
    Gravacoes Victor                :1, 3
    Edicao Reel 1 (Gabriel)         :2, 3
    Edicao Reel 2 (Gabriel)         :3, 4
    Atualizar ManyChat              :1, 2
    Post Substack                   :1, 2
    Coleta metricas (Karol)         :1, 2

    section Publicacao
    SEG — Substack                  :crit, 1, 2
    TER — Reels Jornal #1          :crit, 2, 3
    QUA — Stories Teaser + Caixinha :crit, 3, 4
    QUI — Reels Jornal #2          :crit, 4, 5
    SEX — Stories Lembrete         :5, 6
    SAB — Ultimo CTA + Urgencia    :6, 7
    DOM — AULA SPOILER             :milestone, 7, 7

    section Pos-Aula
    Stories Highlights + FOMO       :7, 8
```

---

## UTM Tracking Map

```mermaid
flowchart LR
    subgraph Fontes["📡 Fontes de Trafego"]
        IG["Instagram\nutm_source=instagram"]
        MC["ManyChat\nutm_source=manychat"]
        SS["Substack\nutm_source=substack"]
    end

    subgraph Medios["📺 Meios"]
        REELS["utm_medium=reels"]
        STORIES["utm_medium=stories"]
        DM["utm_medium=dm"]
        EMAIL["utm_medium=email"]
    end

    subgraph Conteudos["🏷️ Conteudo"]
        C_A["utm_content=caminho-a"]
        C_B["utm_content=caminho-b"]
        CTA_P["utm_content=cta-post"]
        CTA_S["utm_content=cta-substack"]
    end

    IG --> REELS & STORIES
    MC --> DM
    SS --> EMAIL

    REELS --> CTA_P
    STORIES --> CTA_P
    DM --> C_A & C_B
    EMAIL --> CTA_S

    C_A & C_B & CTA_P & CTA_S --> |"utm_campaign=\nspoiler-semanal"| DEST["🎯 LPs\nCamarin / Curso"]
```

---

## Legenda

| Cor | Significado |
|-----|-------------|
| 🔴 Vermelho | TOPO — Awareness (alcance organico) |
| 🟢 Verde | MEIO — Consideration (ManyChat + Substack) |
| 🔵 Azul | FUNDO — Conversao (LPs + Checkout) |
| 🟡 Amarelo | Triggers / Deteccao |
| 🟣 Roxo | Retencao / Pos-venda |
| ⬜ Cinza | Remarketing |

---

*Diagrama gerado para uso em Notion, GitHub, ou qualquer renderer Mermaid.*
*Referencia: `docs/funil-spoiler-semanal.md` + `docs/campanha-spoiler-semanal.md`*
