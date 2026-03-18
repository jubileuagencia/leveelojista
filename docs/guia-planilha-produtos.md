# Guia de Uso — Planilha de Produtos Levee

## O que e esta planilha?

Uma planilha Google Sheets conectada diretamente ao banco de dados da loja Levee. Com ela voce pode:
- Ver todos os produtos cadastrados
- Editar precos, nomes, descricoes e categorias em massa
- Adicionar novos produtos
- Ativar/desativar produtos

Tudo sem precisar acessar o painel admin da loja.

---

## Menu Principal

No topo da planilha, voce vai ver o menu **Levee Produtos** com 3 opcoes:

| Opcao | O que faz |
|-------|-----------|
| **Atualizar Planilha** | Traz os dados mais recentes do banco para a planilha |
| **Enviar para Loja** | Envia as alteracoes da planilha para o banco da loja |
| **Configuracoes** | Configura credenciais (so precisa fazer 1 vez) |

---

## Como Atualizar a Planilha (ver dados atuais)

1. Menu: **Levee Produtos > Atualizar Planilha**
2. Confirme clicando **Sim**
3. Aguarde — os produtos e categorias serao carregados

**Importante:** Isso sobrescreve os dados da planilha. Se voce fez alteracoes que ainda nao enviou, envie antes de atualizar.

---

## Como Editar Produtos

1. Primeiro: **Atualizar Planilha** para ter os dados mais recentes
2. Edite diretamente nas celulas:
   - **Nome**: coluna B
   - **Preco**: coluna C (formato R$ automatico)
   - **Unidade**: coluna D (selecione no dropdown)
   - **Categoria**: coluna E (selecione no dropdown)
   - **Descricao**: coluna F
   - **Ativo**: coluna G (checkbox — marcado = visivel na loja)
3. Quando terminar: **Levee Produtos > Enviar para Loja**

---

## Como Adicionar Novo Produto

1. Va para a **primeira linha vazia** abaixo dos produtos existentes
2. Preencha:
   - **ID (coluna A)**: deixe VAZIO — sera gerado automaticamente
   - **Nome**: obrigatorio (minimo 2 caracteres)
   - **Preco**: obrigatorio (numero >= 0)
   - **Unidade**: selecione no dropdown
   - **Categoria**: selecione no dropdown
   - **Descricao**: opcional
   - **Ativo**: marque o checkbox se quiser que apareca na loja
3. Menu: **Levee Produtos > Enviar para Loja**
4. Apos o envio, o ID aparece automaticamente na coluna A

---

## Como Desativar um Produto

1. Desmarque o **checkbox** na coluna **Ativo** (coluna G)
   - A linha fica com fundo vermelho claro (indicador visual)
2. Menu: **Levee Produtos > Enviar para Loja**
3. O produto fica invisivel na loja mas continua no banco

Para reativar: marque o checkbox novamente e envie.

---

## Colunas da Planilha

| Coluna | Nome | Voce edita? | Descricao |
|--------|------|-------------|-----------|
| A | ID | Nao | Numero do produto (automatico) |
| B | Nome | Sim | Nome do produto |
| C | Preco (R$) | Sim | Preco unitario |
| D | Unidade | Sim | un, kg, cx, maco, dz |
| E | Categoria | Sim | Selecione da lista |
| F | Descricao | Sim | Texto livre |
| G | Ativo | Sim | Checkbox — visivel na loja? |
| H | Imagem URL | Nao | Gerenciada pelo painel admin |
| I | Status Sync | Nao | Resultado do ultimo envio |
| J | Ultima Sync | Nao | Data/hora do ultimo envio |

---

## Aba Categorias

A aba **Categorias** e automatica — nao edite manualmente. Ela e atualizada toda vez que voce clica em "Atualizar Planilha". As categorias aparecem como opcoes no dropdown da coluna Categoria.

Para criar novas categorias, use o painel admin da loja.

---

## Status Sync (coluna I)

| Status | Significado |
|--------|-------------|
| **Sincronizado** (verde) | Produto enviado com sucesso |
| **Novo** (azul) | Produto ainda nao enviado |
| **Erro: ...** (vermelho) | Falha no envio — leia a mensagem de erro |

---

## Erros Comuns

| Erro | Causa | Solucao |
|------|-------|---------|
| Nome obrigatorio | Nome vazio ou muito curto | Preencha com pelo menos 2 caracteres |
| Preco deve ser >= 0 | Preco vazio ou negativo | Coloque um numero valido |
| Unidade invalida | Unidade nao reconhecida | Use o dropdown (un, kg, cx, maco, dz) |
| Categoria nao encontrada | Categoria digitada manualmente | Use o dropdown — nao digite manualmente |
| Credenciais nao configuradas | Supabase nao conectado | Levee Produtos > Configuracoes |

---

## Regras Importantes

1. **Sempre atualize antes de editar** — para trabalhar com dados recentes
2. **Sempre envie antes de atualizar** — senao perde suas alteracoes
3. **Nao edite a coluna ID** — ela e automatica
4. **Nao edite a aba Categorias** — ela e automatica
5. **Imagens** sao gerenciadas apenas pelo painel admin, nao pela planilha
6. **Nao delete linhas** — para remover um produto, desmarque o checkbox Ativo

---

## Fluxo Recomendado

```
1. Atualizar Planilha (pegar dados recentes)
          ↓
2. Fazer suas edicoes (precos, nomes, novos produtos)
          ↓
3. Enviar para Loja (salvar no banco)
          ↓
4. Verificar coluna Status Sync (tudo verde?)
```

---

## Suporte

Em caso de problemas:
- Verifique a coluna **Status Sync** para mensagens de erro
- Tente **Atualizar Planilha** e refazer as alteracoes
- Contate o administrador do sistema
