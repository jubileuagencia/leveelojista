# Questões em Aberto — novob2b

## Fase 4.2 — Notificações por Email

**Status:** Pendente decisão
**Data:** 2026-03-04

### Contexto
Supabase não serve para emails transacionais (limite ~4/hora no free tier, só auth). Precisamos de serviço externo para:
- Email de confirmação de pedido
- Notificação de mudança de status do pedido

### Opções de Serviço

| Serviço | Free Tier | Custo depois | Destaque |
|---------|-----------|-------------|----------|
| **Resend** (recomendado) | 3.000/mês | $20/50k | API simples, SDK TypeScript, React Email |
| **Brevo (ex-Sendinblue)** | 300/dia | $9/5k/mês | Templates visuais drag-and-drop, SMTP |
| **SendGrid** | 100/dia | $20/50k | Mais estabelecido, setup complexo |
| **Mailgun** | 100/dia (trial) | $35/50k | API + SMTP |
| **Amazon SES** | 0 (com EC2) | $0.10/1k | Mais barato em escala, setup maior |

### Opções de Arquitetura

| Opção | Como funciona | Prós | Contras |
|-------|---------------|------|---------|
| **A: Edge Function + Database Webhook** (recomendado) | Trigger no banco → Edge Function → API do serviço | Automático, não depende do frontend | Cold start ~200ms |
| **B: pg_net (100% SQL)** | Trigger PostgreSQL → HTTP direto do banco | Tudo dentro do Supabase | Templates limitados, debug difícil |
| **C: App-side** | Frontend chama API após ação | Simples | Não pega mudanças do admin panel |

### Recomendação
**Resend + Edge Function + Database Webhook** — 3k emails grátis cobrem o volume da Levee (~30-100 pedidos/mês), SDK TypeScript nativo, dispara automaticamente em qualquer mudança de status.

### Decisão
- [ ] Serviço de email escolhido: ___
- [ ] Arquitetura escolhida: ___
- [ ] Conta criada no serviço: ___
