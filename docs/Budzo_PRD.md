# PRD --- Budzo

## 1. Visão Geral

Budzo é um SaaS web para criação, envio e acompanhamento de orçamentos
profissionais de forma rápida, simples e rastreável.

Foco: Criar → Enviar → Acompanhar → Converter orçamentos

Não é ERP. Não faz gestão financeira completa. Não controla estoque.

------------------------------------------------------------------------

## 2. Público-Alvo

Autônomos, micro e pequenos empresários que precisam enviar orçamentos
com agilidade e credibilidade.

------------------------------------------------------------------------

## 3. Proposta Única de Valor

"Crie e envie orçamentos profissionais em até 2 minutos."

Diferenciais: - Simples - Compartilhamento rápido (PDF, link, QR,
imagem) - Métricas objetivas - Aprovação online - Personalização da
marca - Plano acessível

------------------------------------------------------------------------

## 4. Stack Tecnológica

Frontend: - Next.js (App Router) - TypeScript - Tailwind + shadcn/ui

Backend: - NestJS (API REST) - TypeScript - Type ORM -

Banco de Dados: - PostgreSQL (Railway)

Pagamentos: - Stripe (Checkout + Webhooks)

Deploy: - Railway

------------------------------------------------------------------------

## 5. Entidades do Sistema

### 5.1 User

Campos: - id (uuid) - name (obrigatório) - email (único) - plan (free \|
pro_monthly \| pro_annual) - status (active \| inactive) - createdAt,
updatedAt, deletedAt

------------------------------------------------------------------------

### 5.2 Company

Campos: - id (uuid) - userId (fk) - legalName (obrigatório) -
tradeName - document (CNPJ) - address completo - contactEmail -
contactPhone - createdAt, updatedAt

------------------------------------------------------------------------

### 5.3 Branding

Campos: - id (uuid) - companyId (fk) - primaryColor (hex) - logoUrl -
createdAt, updatedAt

------------------------------------------------------------------------

### 5.4 Client

Campos: - id (uuid) - companyId (fk) - code (sequencial único por
empresa) - name (obrigatório) - legalName - endereço completo - email -
phone - status (active \| inactive) - createdAt, updatedAt, deletedAt

------------------------------------------------------------------------

### 5.5 Quote

Campos: - id (uuid) - companyId (fk) - clientId (fk) - code (sequencial
único por empresa) - title (obrigatório) - status (pending \| accepted
\| rejected \| discarded \| expired) - expiresInValue - expiresInUnit
(hours \| days) - expiresAt - total (calculado) - publicToken (único) -
createdAt, updatedAt, deletedAt

------------------------------------------------------------------------

### 5.6 QuoteItem

Campos: - id (uuid) - quoteId (fk) - description - quantity - unit (sv
\| hour \| unit) - unitPrice - lineTotal (calculado) - position -
createdAt, updatedAt

------------------------------------------------------------------------

### 5.7 Event

Campos: - id (uuid) - companyId (fk) - actorType (user \| client \|
system) - actorId - title - meta (json) - createdAt

------------------------------------------------------------------------

## 6. Funcionalidades MVP

-   Login Google OAuth2
-   CRUD Clientes
-   CRUD Orçamentos
-   Exportação PDF / Link / QR / Imagem
-   Aprovação online
-   Dashboard com métricas
-   Eventos (auditoria)
-   Página de pagamentos
-   Página de ajuda
-   Landing page institucional
-   Política de privacidade (LGPD)
-   Responsivo (mobile-first)

------------------------------------------------------------------------

## 7. Segurança

-   Conformidade OWASP Top 10
-   Validação server-side
-   Isolamento multi-tenant
-   Verificação de plano no backend
-   Rate limiting endpoints públicos

------------------------------------------------------------------------

## 8. Critérios de Sucesso

-   Funcionalidades operacionais
-   Plano gratuito e pago funcionando
-   Testes unitários e E2E passando
-   Deploy estável no Railway
