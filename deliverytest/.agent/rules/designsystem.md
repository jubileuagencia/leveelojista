---
trigger: always_on
---

# 🎨 Antigravity Design Standards (Design Rules)

Este documento define as **regras visuais OBRIGATÓRIAS** para o projeto. Ele deve ser tratado com a mesma rigidez das `DEVELOPMENT_GUIDELINES.md`.

## 1. Fundamentos & Tokens (Não Alterar)

### Cores Normativas
🚫 **PROIBIDO**: Usar cores hexadecimais (ex: `#22C55E`) diretamente no código.
✅ **OBRIGATÓRIO**: Usar as variáveis CSS definidas.

*   `--primary-color` (Verde): Ações principais, botões, preços.
*   `--bg-color` (Cinza Fundo): Fundo geral das páginas.
*   `--surface-color` (Branco): Fundo de cartões, modais e painéis.
*   `--text-primary` e `--text-secondary`: Hierarquia de texto.

### Estilo Visual: Flat/Clean Surface
O projeto segue estritamente um visual **Clean e Sólido**.

*   **Glassmorphism**: 🚫 PROIBIDO. Não use `backdrop-filter` ou transparências embaçadas para fundos.
*   **Modais**: Devem ter fundo branco sólido (`#FFFFFF`) e sombra suave.
*   **Inputs**: Fundo cinza claro (`#F9FAFB`), texto escuro, borda definida (`#E5E7EB`).
*   **Contraste**: Garanta sempre alto contraste (Texto escuro em fundo claro).

## 2. Componentes Padrão

### Botões
*   **Principal**: Verde Sólido (`var(--primary-color)`). Cantos arredondados (8px ou 12px). Full width em mobile.
*   **Secundário**: Outline ou Fantasma (Texto colorido, fundo transparente).

### Cards & Painéis (.glass-panel / .panel)
Apesar do nome legado `.glass-panel` (se ainda existir), o estilo visual deve ser:
*   Cor de Fundo: `var(--surface-color)` (Branco Sólido).
*   Borda: 1px sólida cinza claro (`#E5E7EB`).
*   Sombra: `var(--shadow-lg)`.

## 3. Checklist de Design ✅
Antes de aprovar uma tela:
1.  [ ] O layout está limpo/flat (sem efeitos de vidro desnecessários)?
2.  [ ] Todas as cores usam `var(--...)`?
3.  [ ] Os inputs têm fundo claro e texto escuro legível?
4.  [ ] O espaçamento lateral é de 20px no mobile?

---
*Este documento é a Lei Visual do projeto. Desvios não justificados serão considerados bug.*