---
trigger: always_on
---

# Antigravity Development Guidelines & Architecture Rules

Essas diretrizes definem o padrão **OBRIGATÓRIO** de desenvolvimento do projeto. Devem ser seguidas rigorosamente para manter a escalabilidade.

## 1. Arquitetura de Componentes

### 📂 Estrutura de Pastas
Organize por **Domínio/Funcionalidade**, nunca por tipo técnico.
- `src/components/common/`: UI Kits genéricos (Botões, Inputs, Modais).
- `src/components/[feature]/`: Componentes de negócio (ex: `auth/`, `home/`, `cart/`).
- `src/components/layout/`: Blocos estruturais (Sidebar, Navbar, Footers).
- `src/pages/`: Controladores de rota. **Não devem conter CSS complexo nem lógica de renderização "crua".**

### 🧠 Responsabilidade (Separation of Concerns)
- **Service Layer (`src/services/`)**: **OBRIGATÓRIO** para qualquer comunicação externa (API, Supabase, LocalStorage).
    - 🚫 *Proibido:* Chamar `supabase.from('...').select()` dentro de um componente.
    - ✅ *Correto:* Chamar `ProductService.getAll()` dentro de um `useEffect`.
- **Pages**: Gerenciam Estado Global da tela e busca de dados (Data Fetching).
- **Components**: Recebem dados via `props` e exibem UI. Devem ser "burros" (Stateless) preferencialmente.

## 2. Estilização (CSS Modules)

### 🎨 Regra de Ouro do CSS
🚫 **PROIBIDO:** Inline styles (`style={{ margin: 10 }}`) para layout estático.
✅ **OBRIGATÓRIO:** CSS Modules (`styles.container`).

1.  Arquivos devem ser nomeados como `[Componente].module.css`.
2.  Importe os estilos como objeto: `import styles from './Componente.module.css'`.
3.  Aplique usando `className={styles.nomeDaClasse}`.
4.  Evite seletores aninhados profundos. Prefira classes diretas no elemento.

## 3. Protocolo de Alterações e Manutenção (IMPORTANTE) ⚠️

Ao receber um pedido de alteração em uma página ou componente existente:

1.  **Localize o Componente Alvo**: Não edite a lógica na `Page` se o problema é visual. Vá até o arquivo do componente específico (ex: `src/components/ProductCard.jsx`).
2.  **Edição Visual = Edição de CSS Module**:
    - Se o pedido é "Mude a cor do botão", **NUNCA** adicione um `style={{ backgroundColor: ... }}` no JSX.
    - ✅ **Correto**: Abra o arquivo `.module.css` correspondente (ex: `ProductCard.module.css`) e altere a classe lá.
3.  **Preservação da Estrutura**: Mantenha a separação. Se precisar adicionar uma nova div, adicione também sua classe no CSS Module. Não quebre o padrão por "preguiça" ou "pressa".

3.3 Documentação de Mudanças (Changelog) 📜
*   **REGRA**: Toda nova versão ou correção significativa DEVE ser registrada no `CHANGELOG.md`.
*   **Formato**:
    *   `Added`: Novas funcionalidades.
    *   `Changed`: Alterações em funcionalidades existentes.
    *   `Fixed`: Correção de bugs.
    *   `Removed`: Funcionalidades removidas.

    *   `Removed`: Funcionalidades removidas.

3.4 Workflow de Git e Deploy (OBRIGATÓRIO) 🌳

### Passo 0: Verificação de Segurança
Antes de qualquer comando git de envio (push), execute uma varredura por credenciais expostas.
```bash
grep -r "sb_" .
grep -r "ey" .
git status --ignored
```
**REGRA**: Se encontrar chaves hardcoded, **PARE**. Revogue a chave, limpe o arquivo e adicione ao `.gitignore`.

### Passo 1: Backup da Versão Atual
Antes de atualizar a `main` (release), cria-se um snapshot da versão anterior.
1. `git checkout -b v0.XX` (onde XX é a versão atual/main).
2. `git push origin v0.XX` (Backup enviado).

### Passo 2: Atualização da Main
1. Volte para a `main`.
2. Traga as alterações da nova versão.
3. `git push origin main`.
*   Resultado: `v0.XX` (Backup seguro), `main` (Nova versão).

3.5 Documentação de Banco de Dados (Schema) 🗄️
*   **REGRA**: Toda alteração no banco de dados (DDL) DEVE ser refletida no arquivo `.agent/rules/schema.md`.
*   **Workflow**:
    1.  Execute a migração.
    2.  Atualize `schema.md` com as novas tabelas/colunas.

## 4. Gerenciamento de Estado

- **Local (useState)**: Apenas para UI efêmera (ex: abrir/fechar modal).
- **Context (useContext)**: Apenas para dados globais (Auth, Carrinho).
- **Server State**: Prefira recarregar dados do servidor a gerenciar caches manuais complexos.

## 5. Assets e Recursos

- **Nomes**: `PascalCase` para componentes, `camelCase` para hooks/utils.
- **Imagens**: Importar de `src/assets/`. Não usar caminhos mágicos (strings soltas).

## 6. Padrões de Design (Design System) 🎨

O projeto possui regras visuais estritas (Cores, Tipografia, Estilo Clean).
� **CONSULTE O ARQUIVO:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
**OBS:** As regras visuais definidas lá são tão obrigatórias quanto as regras de código deste documento.

## 7. Checklist para Alterações ✅

Antes de confirmar uma tarefa:
1.  [ ] A alteração visual foi feita no arquivo `.module.css` e não inline?
2.  [ ] A lógica de dados permanece isolada em `src/services`?
3.  [ ] O componente continua independente e reutilizável?
4.  [ ] Nada foi quebrado no Mobile ou Desktop?