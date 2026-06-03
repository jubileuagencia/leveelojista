# Gate — PaymentMethod Enum + Troco (LV-133 §3.3 B)

**Projeto:** novob2b (Levee)
**Facilitador:** Orion (@aios-master)
**Data:** 2026-06-03
**Status:** ✅ Resolvido — 2026-06-03
**Bloqueia:** LV-135 (cliente + MP), LV-141 (migration 020)

> Este doc resolve a divergência identificada no UX spec da Uma (LV-133) vs o doc de decisões
> `fluxo-pagamento-pos-separacao.md`. Após preenchimento, Orion atualiza a fonte da verdade e
> libera @dev para implementar.

---

## Contexto em 30 segundos

O doc de decisões atual define `cartao_entrega` como valor único para pagamento presencial.
O UX spec da Uma propõe separar em 3 valores (`debito_entrega`, `credito_entrega`,
`dinheiro_entrega`) e adicionar um campo de troco (`delivery_change_for`) na tabela `orders`.

Antes de codar, Fernando precisa confirmar qual caminho seguir.

---

## Pergunta 1 — PaymentMethod: separar ou manter unificado?

**Contexto:** A loja precisa saber com antecedência como o cliente vai pagar para se preparar
logisticamente (levar máquina de POS, ter troco disponível, saber a taxa que vai aplicar).

### Opção A — Separar em 3 valores (proposta da Uma)

```
debito_entrega | credito_entrega | dinheiro_entrega
```

- UX: step 1 do sub-fluxo oferece 3 opções (Débito / Crédito / Dinheiro)
- Loja sabe exatamente o tipo de cartão → leva máquina certa, conhece a taxa
- Migration: 3 valores no enum em vez de 1
- Sub-fluxo da Uma fica exatamente como desenhado (§3.3 B)

### Opção B — Manter `cartao_entrega` único + separar só dinheiro

```
cartao_entrega | dinheiro_entrega
```

- UX: step 1 oferece 2 opções (Cartão / Dinheiro)
- Loja sabe se precisa ter troco, mas não sabe débito vs crédito
- Migration mais simples (2 valores)
- Perde distinção de taxa débito/crédito

### Opção C — Manter `cartao_entrega` único sem separar dinheiro (doc atual)

```
cartao_entrega
```

- UX: confirmação simples sem sub-fluxo (como estava no doc original)
- Loja não sabe nada com antecedência
- Sem mudança na migration

**Sua escolha:** `[ ] A` `[x ] B` `[ ] C`

**Observações (opcional):**
```
_
```

---

## Pergunta 2 — Campo de troco na tabela `orders`

**Contexto:** Se o cliente escolher pagar com dinheiro na entrega, a Uma propõe que ele informe
o valor da nota (ex: R$ 100,00 para um pedido de R$ 87,30). A loja então sabe que precisa
levar R$ 12,70 de troco.

### Opção A — Adicionar `delivery_change_for` (proposta da Uma)

```sql
delivery_change_for NUMERIC(12,2) NULL
-- preenchido quando payment_method = 'dinheiro_entrega' + cliente pediu troco
-- null quando cartão, ou dinheiro com valor exato
```

- Loja vê no admin: "Cliente pagará com R$ 100,00 — levar R$ 12,70 de troco"
- Requer campo novo na migration (LV-141)
- Input de troco no sub-fluxo UX fica ativo (§3.3 B step 2b)

### Opção B — Não adicionar o campo

- Troco não é registrado no sistema
- Loja descobre na hora da entrega ou via mensagem fora do sistema
- Migration mais simples

**Sua escolha:** `[x ] A` `[ ] B`

**Observações (opcional):**
```
_
```

---

## Pergunta 3 — Restrição de troco mínimo

**Contexto:** Se adicionar o campo de troco (Pergunta 2 → A), qual a regra de validação?

### Opção A — Troco deve ser maior que o total (proposta da Uma)

```
delivery_change_for > total
```
Exemplo: total R$ 87,30 → nota mínima aceita R$ 87,40

### Opção B — Troco pode ser igual ao total

```
delivery_change_for >= total
```
Não faz muito sentido (troco = R$ 0,00), mas tecnicamente permitido.

> Esta pergunta só é relevante se Pergunta 2 → A.

**Sua escolha:** `[ ] A` `[ ] B` `[ ] não relevante`

**Observações (opcional):**
``` um campo d sim ou não caso precise de troco, se sim, a pessoa escreve de qual valor ela vai precisar de troco, logo se ela for pagar 87 com 90 nós ja saberemos que terá 3 reais de troco, se ela colocar sim mas colocar valor abaixo da venda deverá mostrar que o valor deve ser amior que o valor da venda e nao permite o cliente prosseguri ate que coloque ou corrija o valor.
_
```

---

## Pergunta 4 — Email de confirmação "pagar na entrega"

**Contexto:** A Uma levantou a ideia (§7 do UX spec) de enviar um email de confirmação separado
quando o cliente escolhe pagar na entrega — tanto para o cliente (resumo do método + troco)
quanto para a loja (aviso de que o cliente vai pagar na entrega e como).

O email atual (`awaiting_payment`) já avisa o cliente para ir pagar. Este seria um segundo
email pós-confirmação.

### Opção A — Enviar email de confirmação pós-escolha de entrega

- Cliente recebe: "Pedido confirmado! Você pagará na entrega com {método}. Troco: {valor}."
- Loja recebe: "Cliente confirmou pagamento na entrega — {método}, troco para R$ {valor}."
- Implementação futura (story de infra de email separada, não bloqueia agora)

### Opção B — Não enviar email extra

- Loja acompanha pelo admin
- Cliente vê status no app
- Menos emails = menos ruído

### Opção C — Decidir depois (não bloqueia a implementação atual)

**Sua escolha:** `[ ] A` `[ x] B` `[ ] C`

**Observações (opcional):**
```
_
```

---

## Após preenchimento

Orion irá:
1. Atualizar `docs/decisoes/fluxo-pagamento-pos-separacao.md` com nova rodada formal
2. Commitar UX spec da Uma (estava untracked)
3. Marcar este doc como `✅ Resolvido`
4. Liberar @dev (Dex) para implementar com migration correta

---

**Respondido em:** 2026-06-03
**Aprovado por:** Fernando Gleisson
