# Contrato de API - Budzo

Este documento descreve a API REST para o sistema Budzo.
A API deve ser desenvolvida seguindo os princípios RESTful, utilizando JSON para troca de dados.

## 1. Visão Geral

- **Base URL**: `https://api.budzo.app/v1` (Produção) | `http://localhost:3000/v1` (Desenvolvimento)
- **Protocolo**: HTTPS
- **Formato de Dados**: JSON (`application/json`)
- **Encoding**: UTF-8

## 2. Autenticação e Segurança

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Headers Obrigatórios
Para endpoints protegidos, o cliente deve enviar o token no header `Authorization`.

```http
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json
```

### Fluxo de Autenticação
1. O Frontend realiza o login via **Google OAuth2**.
2. O Google retorna um `accessToken` ou `idToken` para o frontend.
3. O Frontend envia esse token para o Backend via endpoint `/auth/google`.
4. O Backend valida o token junto ao Google, cria/atualiza o usuário e retorna o `accessToken` (JWT) da aplicação Budzo.

## 3. Respostas da API

### Envelope de Sucesso Padrão
Toda resposta de sucesso (2xx) seguirá este formato, exceto quando especificado o contrário (ex: downloads).

```json
{
  "success": true,
  "data": { ... }, // Objeto ou Array de retorno
  "meta": { ... }  // Opcional: paginação, contadores, etc.
}
```

### Envelope de Erro Padrão
Respostas de erro (4xx, 5xx).

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE", // Código legível por máquina (ex: VALIDATION_ERROR, UNAUTHORIZED)
    "message": "Descrição amigável do erro.",
    "details": [] // Opcional: array de erros de validação de campos
  }
}
```

### Códigos HTTP Comuns
- `200 OK`: Sucesso padrão.
- `201 Created`: Recurso criado com sucesso.
- `204 No Content`: Sucesso sem corpo de resposta (ex: delete).
- `400 Bad Request`: Erro de validação ou requisição inválida.
- `401 Unauthorized`: Token ausente ou inválido.
- `403 Forbidden`: Usuário autenticado mas sem permissão.
- `404 Not Found`: Recurso não encontrado.
- `422 Unprocessable Entity`: Erro de regra de negócio.
- `500 Internal Server Error`: Erro inesperado no servidor.

---

## 4. Endpoints

### 4.1. Autenticação (`/auth`)

  ```

#### Login com Google (Redirect)
- **GET** `/auth/google`
- **Ação**: Redireciona o usuário para a página de login do Google.

#### Callback do Google
- **GET** `/auth/google/callback`
- **Ação**: O Google redireciona de volta para este endpoint após o login. O backend processa o código, cria/atualiza o usuário e retorna o `accessToken` e os dados do usuário.

#### Refresh Token (Opcional - para implementação futura)
- **POST** `/auth/refresh`

---

### 4.2. Usuário (`/users`)

#### Obter perfil do usuário logado
- **GET** `/users/me`
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "Nome",
      "email": "email@example.com",
      "plan": "free",
      "companyId": "uuid" // Se já tiver empresa criada
    }
  }
  ```

#### Atualizar perfil
- **PATCH** `/users/me`
- **Body**:
  ```json
  { "name": "Novo Nome" }
  ```

---

### 4.3. Empresa (`/companies`)

#### Criar Empresa (Onboarding)
- **POST** `/companies`
- **Body**:
  ```json
  {
    "legalName": "Razão Social Ltda",
    "tradeName": "Nome Fantasia",
    "document": "12345678000199",
    "contactEmail": "contato@empresa.com",
    "address": {
       "street": "Rua X",
       "number": "123",
       "zipCode": "00000-000",
       "city": "São Paulo",
       "state": "SP"
    }
  }
  ```

#### Obter Empresa do Usuário
- **GET** `/companies/me`
- **Response (200)**: Retorna os dados da empresa vinculada ao usuário logado.

#### Atualizar Empresa
- **PATCH** `/companies/me`
- **Body**: Campos parciais da empresa para atualização.

---

### 4.4. Branding (`/branding`)

#### Atualizar Branding da Empresa
- **PUT** `/companies/me/branding`
- **Body**:
  ```json
  {
    "primaryColor": "#FF5733",
    "logoUrl": "https://..."
  }
  ```

#### Upload de Logo
- **POST** `/companies/me/branding/logo`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: Arquivo de imagem (jpg, png).
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": { "logoUrl": "https://storage.googleapis.com/..." }
  }
  ```

---

### 4.5. Clientes (`/clients`)

#### Listar Clientes
- **GET** `/clients`
- **Query Params**: `page`, `limit`, `search` (nome ou email)
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": [ { "id": "uuid", "name": "Cliente A", ... } ],
    "meta": { "total": 10, "page": 1, "lastPage": 2 }
  }
  ```

#### Criar Cliente
- **POST** `/clients`
- **Body**:
  ```json
  {
    "name": "Cliente Exemplo",
    "legalName": "Empresa Exemplo SA",
    "email": "cli@exemplo.com",
    "phone": "1199999999",
    "document": "CPF/CNPJ",
    "address": { ... }
  }
  ```

#### Obter Cliente
- **GET** `/clients/:id`

#### Atualizar Cliente
- **PATCH** `/clients/:id`

#### Deletar Cliente (Soft Delete)
- **DELETE** `/clients/:id`

---

### 4.6. Orçamentos (`/quotes`)

#### Listar Orçamentos
- **GET** `/quotes`
- **Query Params**: `page`, `limit`, `status`, `clientId`, `search` (título)

#### Criar Orçamento (Draft)
- **POST** `/quotes`
- **Body**:
  ```json
  {
    "clientId": "uuid",
    "title": "Orçamento Desenvolvimento Web",
    "expiresInValue": 7,
    "expiresInUnit": "days",
    "items": [
      {
        "description": "Desenvolvimento Frontend",
        "quantity": 40,
        "unit": "hour",
        "unitPrice": 150.00
      }
    ]
  }
  ```

#### Obter Orçamento
- **GET** `/quotes/:id`
- **Response (200)**: Retorna orçamento completo com itens e cliente.

#### Atualizar Orçamento
- **PATCH** `/quotes/:id`
- **Body**: Pode atualizar título, validade, itens (substituição completa ou lógica de diff no backend).

#### Duplicar Orçamento
- **POST** `/quotes/:id/clone`
- **Response (201)**: Retorna o novo orçamento criado em estado `draft`.

#### Enviar Orçamento (Mudar Status para Pending)
- **POST** `/quotes/:id/send`
- **Body** (Opcional):
  ```json
  { "method": "email" } // Se quiser disparar email pelo sistema
  ```
- **Ação**: Gera o `publicToken` se não existir, define status como `pending`, registra evento.

#### Excluir Orçamento
- **DELETE** `/quotes/:id`

#### Download PDF
- **GET** `/quotes/:id/pdf`
- **Response (200)**: Retorna o arquivo PDF do orçamento.
  - **Content-Type**: `application/pdf`
  - **Content-Disposition**: `attachment; filename=quote-:id.pdf`

---

### 4.7. Visualização Pública de Orçamento (`/public/quotes`)

*Estes endpoints NÃO exigem autenticação.*

#### Obter Orçamento Público
- **GET** `/public/quotes/:publicToken`
- **Response (200)**: Dados limitados do orçamento para renderização da página de aprovação.
  ```json
  {
    "success": true,
    "data": {
      "company": { "legalName": "...", "branding": { ... } },
      "client": { "name": "..." },
      "items": [ ... ],
      "total": 1000.00,
      "status": "pending",
      "expiresAt": "2023-10-10T00:00:00Z"
    }
  }
  ```

#### O Cliente Aprova o Orçamento
- **POST** `/public/quotes/:publicToken/approve`
- **Body**: `{ "notes": "Opcional" }`
- **Ação**: Muda status para `accepted`, notifica empresa, registra evento.

#### O Cliente Rejeita o Orçamento
- **POST** `/public/quotes/:publicToken/reject`
- **Body**: `{ "reason": "Preço alto" }`
- **Ação**: Muda status para `rejected`, notifica empresa, registra evento.

---

### 4.8. Eventos de Auditoria (`/events`)

#### Listar Eventos (Histórico)
- **GET** `/events`
- **Query Params**: `entityId` (ex: id do orçamento), `entityType`, `page`.

---

### 4.9. Assinaturas (`/subscriptions`)

#### Criar Sessão de Checkout
- **POST** `/subscriptions/checkout`
- **Body**:
  ```json
  { "priceId": "price_..." }
  ```
- **Response (200)**:
  ```json
  {
    "id": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
  ```

#### Criar Sessão do Portal do Cliente
- **POST** `/subscriptions/portal`
- **Response (200)**:
  ```json
  {
    "url": "https://billing.stripe.com/..."
  }
  ```

#### Webhook Stripe
- **POST** `/subscriptions/webhook`
- **Headers**: `Stripe-Signature`
- **Body**: Evento cru do Stripe.

---

## 5. Tipos de Dados (Enums)

### QuoteStatus
- `draft`: Rascunho, ainda não enviado.
- `pending`: Enviado ao cliente, aguardando resposta.
- `accepted`: Aprovado pelo cliente.
- `rejected`: Rejeitado pelo cliente.
- `expired`: Prazo de validade expirou.
- `discarded`: Cancelado pela própria empresa.

### UnitType
- `sv`: Serviço (preço fechado)
- `hour`: Horas trabalhadas
- `unit`: Unidade de produto/item
- `day`: Diária

### PlanType
- `free`
- `pro_monthly`
- `pro_annual`

---

## 6. Considerações de Desenvolvimento Frontend

1. **Tratamento de Erros Genericos**: Implementar um `interceptor` no cliente HTTP (axios/fetch) para capturar 401 e redirecionar para login. Capturar 4xx e 5xx para exibir toasts de erro usando a mensagem do `error.message`.
2. **Tipagem**: Gerar tipos TypeScript a partir deste contrato (ou usar Swagger/OpenAPI se disponível futuramente).
3. **Estados de Loading**: Sempre exibir indicadores de carregamento durante chamadas à API.
4. **Debounce**: Em campos de busca (`search`), aplicar debounce de ~300ms para evitar chamadas excessivas.

## 7. Considerações de Desenvolvimento Backend

1. **Validação**: Usar `class-validator` (NestJS) ou Zod para validar todos os DTOs de entrada.
2. **Transações**: Operações que Envolvem múltiplas tabelas (ex: criar orçamento com itens) devem ser atômicas.
3. **Segurança**:
   - Sanitizar inputs para evitar injeção.
   - Validar se o usuário tem permissão para acessar o recurso daquela `companyId` (Multi-tenancy lógico).
