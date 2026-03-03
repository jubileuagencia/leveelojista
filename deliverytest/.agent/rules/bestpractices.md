---
trigger: always_on
---

# 🛡️ Antigravity Engineering Standards (Strict Rules)

Este documento define os **Padrões Técnicos e de Segurança** que devem ser seguidos e validados pelo Agente.

## 1. Segurança (Security Core) �

### 1.1 Banco de Dados (PostgreSQL/Supabase)
*   **MANDATÓRIO**: Row Level Security (RLS) deve estar habilitado em todas as tabelas.
*   **PROIBIDO**: Criar tabelas públicas sem políticas de RLS restritivas.
*   **REGRA**: O Frontend (`anon_key`) nunca deve ter "superpoderes". A lógica de permissão reside no banco (`CREATE POLICY`).

### 1.2 Frontend Security
*   **XSS Zero Tolerance**:
    *   🚫 **NUNCA** use `dangerouslySetInnerHTML` exceto se extremamente necessário e COM sanitização (`DOMPurify`).
    *   🚫 **NUNCA** injete variáveis de usuário diretamente em atributos `href` ou `src` sem validação.
*   **Secrets**:
    *   🚫 **CRÍTICO**: Jamais comite chaves `service_role` ou senhas no código frontend.
    *   ⚠️ `anon_key` é a única chave permitida no `.env` do cliente.

## 2. Performance & Otimização ⚡

### 2.1 React Rendering
*   **Re-renders**:
    *   ✅ **USE** `useMemo` para operações de filtro/sort em listas grandes (>50 itens).
    *   ✅ **USE** `useCallback` para funções passadas como prop para componentes filhos otimizados.
*   **Listas**:
    *   🚫 **PROIBIDO**: Usar `index` como `key` em listas dinâmicas. Use `id` único.

### 2.2 Carregamento e Assets
*   **Code Splitting**: Todas as rotas (Pages) devem ser importadas com `React.lazy()` para reduzir o bundle inicial.
*   **Imports**: Use *Named Imports* (`import { Button }`) ao invés de *Default Imports* gigantes para facilitar o Tree Shaking.

## 3. Robustez e Qualidade de Código 🛠️

### 3.1 Tratamento de Erros
*   **Services**: Toda função assíncrona em `src/services/` **DEVE** ter bloco `try/catch`.
*   **UI Feedback**: Erros de API não podem ser silenciados. Devem falhar graciosamente ou notificar o usuário (Toast).

### 3.2 Imutabilidade
*   **State**: Nunca mute o estado do React diretamente (`state.value = 1`). Sempre use o setter (`setState`).
*   **Arrays/Objetos**: Use spread operator `...` ou métodos imutáveis (`map`, `filter`) ao invés de `push`, `splice`.

---
*Estas regras são absolutas. Código que viola estes princípios será considerado "quebrado".*